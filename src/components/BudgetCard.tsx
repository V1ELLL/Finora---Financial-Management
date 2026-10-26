import React, { useState } from 'react';
import { Target, AlertTriangle, Plus, Check, Trash2, PieChart } from 'lucide-react';
import { BudgetAnalysis, Category } from '../types/finance';
import { CategoryIcon } from './CategoryIcon';
import { formatRupiah } from '../utils/finance';

interface BudgetCardProps {
  budgets: BudgetAnalysis[];
  categories: Category[];
  onUpsertBudget: (categoryId: string, limit: number) => void;
  onDeleteBudget: (budgetId: string) => void;
  onViewAll?: () => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budgets,
  categories,
  onUpsertBudget,
  onDeleteBudget,
  onViewAll,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState('');
  const [limitStr, setLimitStr] = useState('');

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const handleOpenAdd = (catId?: string, currentLimit?: number) => {
    setSelectedCatId(catId || (expenseCategories[0]?.id || ''));
    setLimitStr(currentLimit ? currentLimit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = limitStr.replace(/[^0-9]/g, '');
    const num = parseInt(cleanDigits, 10);
    if (!num || num <= 0 || !selectedCatId) return;

    onUpsertBudget(selectedCatId, num);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <PieChart size={17} />
          </div>
          <h3 className="font-semibold text-[15px] text-[#0F172A]">Anggaran Pengeluaran</h3>
        </div>
        <button
          onClick={() => handleOpenAdd()}
          className="text-[12px] font-semibold text-[#2563EB] flex items-center gap-1 hover:underline"
        >
          <Plus size={14} />
          <span>Atur Baru</span>
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
          <p className="text-[13px] text-slate-500 mb-2">Belum ada batas anggaran bulan ini.</p>
          <button
            onClick={() => handleOpenAdd()}
            className="px-3.5 py-1.5 bg-blue-50 text-[#2563EB] rounded-lg text-[12px] font-semibold hover:bg-blue-100 transition-colors"
          >
            Mulai Buat Anggaran
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {budgets.map((item) => {
            const { budget, category, spent, remaining, percentage, status } = item;

            // Status Badge Colors per design guidelines
            let badgeBg = 'bg-[#DCFCE7] text-[#16A34A]';
            let statusLabel = 'Aman';
            let barColor = 'bg-[#2563EB]';

            if (status === 'overbudget') {
              badgeBg = 'bg-[#FEE2E2] text-[#DC2626]';
              statusLabel = 'Overbudget';
              barColor = 'bg-[#DC2626]';
            } else if (status === 'perhatian') {
              badgeBg = 'bg-[#FEF3C7] text-[#D97706]';
              statusLabel = 'Perhatian';
              barColor = 'bg-[#D97706]';
            }

            return (
              <div key={budget.id} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: category.color }}
                    >
                      <CategoryIcon name={category.icon} size={14} />
                    </span>
                    <div>
                      <span className="font-semibold text-[13px] text-slate-800">
                        {category.name}
                      </span>
                      <span className="text-[11px] text-slate-500 ml-2 tabular-nums">
                        Sisa {formatRupiah(remaining)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`h-6 px-2.5 rounded-full text-[11px] font-bold flex items-center justify-center ${badgeBg}`}
                    >
                      {statusLabel}
                    </span>
                    <button
                      onClick={() => onDeleteBudget(budget.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 transition-opacity"
                      aria-label="Hapus Anggaran"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Progress Bar (8dp rounded) */}
                <div className="w-full h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 tabular-nums">
                  <span>Terpakai {formatRupiah(spent)}</span>
                  <span>Batas {formatRupiah(budget.monthlyLimit)} ({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl">
            <h4 className="text-[16px] font-bold text-[#0F172A] mb-3">Atur Batas Anggaran</h4>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1">
                  Kategori Pengeluaran
                </label>
                <select
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                  className="w-full text-[13px] border border-slate-300 rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                >
                  {expenseCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1">
                  Batas Maksimal Bulanan
                </label>
                <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#2563EB]">
                  <span className="text-[14px] font-bold text-slate-400 mr-1.5">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={limitStr}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, '');
                      setLimitStr(clean ? parseInt(clean, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '');
                    }}
                    placeholder="Contoh: 1.500.000"
                    className="w-full text-[15px] font-bold text-[#0F172A] focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 text-[13px] font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-[13px] font-semibold text-white bg-[#2563EB] rounded-xl hover:bg-[#1D4ED8]"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
