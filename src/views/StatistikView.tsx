import React, { useState, useMemo } from 'react';
import { PieChart, TrendingUp, Calendar, ArrowDownLeft, ArrowUpRight, DollarSign } from 'lucide-react';
import { Transaction, Category, Wallet } from '../types/finance';
import { CategoryIcon } from '../components/CategoryIcon';
import {
  formatRupiah,
  calculateCashflow,
  calculateCategoryExpenses,
} from '../utils/finance';

interface StatistikViewProps {
  transactions: Transaction[];
  categories: Category[];
  wallets: Wallet[];
}

export const StatistikView: React.FC<StatistikViewProps> = ({
  transactions,
  categories,
  wallets,
}) => {
  const [period, setPeriod] = useState<'month' | 'week' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Compute date ranges based on period
  const dateRange = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    if (period === 'month') {
      const monthPrefix = todayStr.slice(0, 7);
      return { start: `${monthPrefix}-01`, end: `${monthPrefix}-31`, label: 'Bulan Ini' };
    } else if (period === 'week') {
      const past = new Date();
      past.setDate(now.getDate() - 7);
      return { start: past.toISOString().slice(0, 10), end: todayStr, label: '7 Hari Terakhir' };
    } else {
      const year = todayStr.slice(0, 4);
      return { start: `${year}-01-01`, end: `${year}-12-31`, label: 'Tahun Ini' };
    }
  }, [period]);

  // Cashflow for period
  const cashflow = useMemo(() => {
    return calculateCashflow(transactions, dateRange.start, dateRange.end);
  }, [transactions, dateRange]);

  // Category breakdown for period
  const categoryBreakdown = useMemo(() => {
    return calculateCategoryExpenses(transactions, categories, {
      startDate: dateRange.start,
      endDate: dateRange.end,
    });
  }, [transactions, categories, dateRange]);

  // Daily expense trend (last 7 days)
  const dailyTrend = useMemo(() => {
    const days: { date: string; label: string; amount: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dStr = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'narrow' });
      const dayNum = d.getDate();

      const dayExpense = transactions
        .filter((t) => t.type === 'expense' && t.date === dStr)
        .reduce((sum, t) => sum + t.amount, 0);

      days.push({
        date: dStr,
        label: `${dayName} ${dayNum}`,
        amount: dayExpense,
      });
    }

    const rawMax = Math.max(...days.map((d) => d.amount), 50000);
    const step = rawMax > 500000 ? 100000 : rawMax > 100000 ? 50000 : 25000;
    const ceiling = Math.ceil((rawMax * 1.25) / step) * step;
    return { days, max: rawMax, ceiling };
  }, [transactions]);

  // SVG Donut calculation
  const donutSlices = useMemo(() => {
    if (categoryBreakdown.length === 0) return [];
    let cumulativeAngle = 0;
    return categoryBreakdown.map((cat) => {
      const angle = (cat.percentage / 100) * 360;
      const startAngle = cumulativeAngle;
      cumulativeAngle += angle;
      return {
        ...cat,
        startAngle,
        angle,
      };
    });
  }, [categoryBreakdown]);

  return (
    <div className="space-y-4 pb-24">
      {/* Period Selector Tabs */}
      <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setPeriod('month')}
          className={`py-2 text-[12px] font-semibold rounded-lg transition-all ${
            period === 'month'
              ? 'bg-white text-[#2563EB] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Bulan Ini
        </button>
        <button
          onClick={() => setPeriod('week')}
          className={`py-2 text-[12px] font-semibold rounded-lg transition-all ${
            period === 'week'
              ? 'bg-white text-[#2563EB] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          7 Hari
        </button>
        <button
          onClick={() => setPeriod('year')}
          className={`py-2 text-[12px] font-semibold rounded-lg transition-all ${
            period === 'year'
              ? 'bg-white text-[#2563EB] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tahun Ini
        </button>
      </div>

      {/* Cashflow Summary Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-semibold text-slate-700">
            Arus Kas ({dateRange.label})
          </span>
          <span
            className={`text-[12px] font-bold px-2 py-0.5 rounded-md ${
              cashflow.net >= 0
                ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                : 'bg-rose-50 text-[#DC2626] border border-rose-200'
            }`}
          >
            {cashflow.net >= 0 ? 'Surplus' : 'Defisit'}: {formatRupiah(cashflow.net)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100/60">
            <span className="text-[11px] font-medium text-emerald-800 block">Total Pemasukan</span>
            <span className="text-[16px] font-bold text-[#16A34A] tabular-nums">
              +{formatRupiah(cashflow.income)}
            </span>
          </div>

          <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-100/60">
            <span className="text-[11px] font-medium text-rose-800 block">Total Pengeluaran</span>
            <span className="text-[16px] font-bold text-[#DC2626] tabular-nums">
              -{formatRupiah(cashflow.expense)}
            </span>
          </div>
        </div>
      </div>

      {/* Category Expense Donut Chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <h3 className="font-semibold text-[15px] text-[#0F172A] mb-4">
          Distribusi Pengeluaran per Kategori
        </h3>

        {categoryBreakdown.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-[13px]">
            Belum ada pengeluaran pada periode ini.
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Native SVG Donut Chart */}
            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {donutSlices.map((slice, i) => {
                  const radius = 38;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((slice.startAngle / 360) * circumference);

                  return (
                    <circle
                      key={slice.categoryId}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth="14"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === slice.categoryId ? null : slice.categoryId
                        )
                      }
                    />
                  );
                })}
              </svg>
              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total</span>
                <span className="text-[12px] font-bold text-slate-900 tabular-nums">
                  {formatRupiah(cashflow.expense)}
                </span>
              </div>
            </div>

            {/* Legend & Breakdown List */}
            <div className="flex-1 w-full space-y-2.5">
              {categoryBreakdown.slice(0, 5).map((cat) => {
                const isSelected = selectedCategory === cat.categoryId;
                return (
                  <button
                    key={cat.categoryId}
                    onClick={() =>
                      setSelectedCategory(isSelected ? null : cat.categoryId)
                    }
                    className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-[12px] font-medium text-slate-800 truncate">
                        {cat.name}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[12px] font-bold text-slate-900 tabular-nums mr-2">
                        {formatRupiah(cat.amount)}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
                        {cat.percentage}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Daily Expense Trend Bar Chart (Last 7 Days) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[15px] text-[#0F172A]">
            Tren Pengeluaran 7 Hari Terakhir
          </h3>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md tabular-nums">
            Batas Skala: {formatRupiah(dailyTrend.ceiling)}
          </span>
        </div>

        {/* Chart Box with bounded height and dashed gridlines */}
        <div className="relative pt-6 pb-1">
          {/* Ceiling guideline */}
          <div className="absolute top-6 inset-x-0 border-b border-dashed border-slate-200/80 pointer-events-none" />

          {/* 50% guideline */}
          <div className="absolute top-[86px] inset-x-0 border-b border-dashed border-slate-100 pointer-events-none" />

          {/* Baseline */}
          <div className="absolute bottom-6 inset-x-0 border-b border-slate-200 pointer-events-none" />

          {/* Bars Column Container */}
          <div className="h-28 flex items-end justify-between gap-1.5 sm:gap-2 px-1 relative z-10">
            {dailyTrend.days.map((d) => {
              const heightPercent = d.amount > 0
                ? Math.min(92, Math.max(8, Math.round((d.amount / dailyTrend.ceiling) * 100)))
                : 4;

              return (
                <div
                  key={d.date}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                >
                  {/* Floating Tooltip clamped directly above the bar */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-150 text-[10px] bg-slate-900 text-white font-semibold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap pointer-events-none z-30 tabular-nums">
                    {formatRupiah(d.amount)}
                  </div>

                  {/* Bar Track & Fill */}
                  <div className="w-full max-w-[26px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        d.amount > 0
                          ? 'bg-[#2563EB] group-hover:bg-[#1D4ED8]'
                          : 'bg-slate-200'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Date Labels Row directly under baseline */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 px-1 mt-1.5 pt-0.5">
            {dailyTrend.days.map((d) => (
              <span
                key={d.date}
                className="flex-1 text-center text-[10px] font-medium text-slate-500 truncate"
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Category Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <h3 className="font-semibold text-[15px] text-[#0F172A] mb-3">
          Rincian Semua Kategori
        </h3>

        <div className="divide-y divide-slate-100">
          {categoryBreakdown.map((cat) => (
            <div key={cat.categoryId} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: cat.color }}
                >
                  <CategoryIcon name={cat.icon} size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-slate-800 truncate">{cat.name}</p>
                  <p className="text-[11px] text-slate-500">{cat.count} transaksi</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[13px] font-bold text-slate-900 tabular-nums">
                  {formatRupiah(cat.amount)}
                </p>
                <p className="text-[11px] text-slate-500 tabular-nums">{cat.percentage}% dari total</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
