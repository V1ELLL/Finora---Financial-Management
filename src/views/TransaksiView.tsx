import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Plus, Calendar, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Transaction, Category, Wallet, TransactionType } from '../types/finance';
import { CategoryIcon } from '../components/CategoryIcon';
import { formatRupiah, formatIndonesianDate, exportTransactionsToCSV } from '../utils/finance';

interface TransaksiViewProps {
  transactions: Transaction[];
  categories: Category[];
  wallets: Wallet[];
  onSelectTransaction: (tx: Transaction) => void;
  onOpenAddTransaction: () => void;
}

export const TransaksiView: React.FC<TransaksiViewProps> = ({
  transactions,
  categories,
  wallets,
  onSelectTransaction,
  onOpenAddTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [walletFilter, setWalletFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const catMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const walletMap = useMemo(() => new Map(wallets.map((w) => [w.id, w.name])), [wallets]);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      // Wallet filter
      if (walletFilter !== 'all' && tx.walletId !== walletFilter) return false;
      // Category filter
      if (categoryFilter !== 'all' && tx.categoryId !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const cat = catMap.get(tx.categoryId);
        const catName = cat ? cat.name.toLowerCase() : '';
        const note = (tx.note || '').toLowerCase();
        const amountStr = tx.amount.toString();
        if (!catName.includes(query) && !note.includes(query) && !amountStr.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, typeFilter, walletFilter, categoryFilter, searchQuery, catMap]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const tx of filtered) {
      const list = map.get(tx.date) || [];
      list.push(tx);
      map.set(tx.date, list);
    }
    // Sort dates descending
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const handleExportCSV = () => {
    const csvContent = exportTransactionsToCSV(filtered, categories, wallets);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Finora_Transaksi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Search Bar & Export Action */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi atau catatan..."
            className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] shadow-2xs"
          />
        </div>

        <button
          onClick={handleExportCSV}
          className="h-10 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-[12px] font-semibold flex items-center gap-1.5 shrink-0 shadow-2xs"
          title="Ekspor ke CSV"
        >
          <Download size={15} />
          <span className="hidden sm:inline">Ekspor CSV</span>
        </button>
      </div>

      {/* Filter Chips (Semua, Pengeluaran, Pemasukan) */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setTypeFilter('all')}
          className={`h-8 px-4 rounded-full text-[12px] font-semibold transition-all shrink-0 ${
            typeFilter === 'all'
              ? 'bg-[#DBEAFE] text-[#1D4ED8] border border-blue-300'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Semua ({transactions.length})
        </button>

        <button
          onClick={() => setTypeFilter('expense')}
          className={`h-8 px-4 rounded-full text-[12px] font-semibold transition-all shrink-0 ${
            typeFilter === 'expense'
              ? 'bg-rose-100 text-[#DC2626] border border-rose-300'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Pengeluaran
        </button>

        <button
          onClick={() => setTypeFilter('income')}
          className={`h-8 px-4 rounded-full text-[12px] font-semibold transition-all shrink-0 ${
            typeFilter === 'income'
              ? 'bg-emerald-100 text-[#16A34A] border border-emerald-300'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Pemasukan
        </button>
      </div>

      {/* Secondary Dropdown Filters: Wallet & Category */}
      <div className="grid grid-cols-2 gap-2">
        <select
          value={walletFilter}
          onChange={(e) => setWalletFilter(e.target.value)}
          className="text-[12px] bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-[#2563EB]"
        >
          <option value="all">Semua Dompet</option>
          {wallets.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-[12px] bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-[#2563EB]"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.type === 'income' ? 'Masuk' : 'Keluar'})
            </option>
          ))}
        </select>
      </div>

      {/* Transaction List Grouped by Date */}
      {groupedByDate.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80">
          <p className="text-[14px] font-semibold text-slate-700 mb-1">
            Tidak ada transaksi ditemukan
          </p>
          <p className="text-[12px] text-slate-500 mb-4">
            Coba sesuaikan kata kunci pencarian atau filter yang Anda pilih.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
              setWalletFilter('all');
              setCategoryFilter('all');
            }}
            className="px-4 py-2 bg-blue-50 text-[#2563EB] text-[12px] font-semibold rounded-xl hover:bg-blue-100"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByDate.map(([date, txs]) => {
            const dayExpense = txs
              .filter((t) => t.type === 'expense')
              .reduce((s, t) => s + t.amount, 0);
            const dayIncome = txs
              .filter((t) => t.type === 'income')
              .reduce((s, t) => s + t.amount, 0);

            return (
              <div
                key={date}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.03)]"
              >
                {/* Date Group Header */}
                <div className="bg-slate-50/90 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between text-[12px]">
                  <span className="font-bold text-slate-800">
                    {formatIndonesianDate(date)}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] font-semibold tabular-nums">
                    {dayIncome > 0 && (
                      <span className="text-[#16A34A]">+{formatRupiah(dayIncome)}</span>
                    )}
                    {dayExpense > 0 && (
                      <span className="text-[#DC2626]">-{formatRupiah(dayExpense)}</span>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-100">
                  {txs.map((tx) => {
                    const cat = catMap.get(tx.categoryId) || {
                      name: 'Lainnya',
                      icon: 'Tag',
                      color: '#64748B',
                    };
                    const isIncome = tx.type === 'income';

                    return (
                      <button
                        key={tx.id}
                        onClick={() => onSelectTransaction(tx)}
                        className="w-full text-left p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                            style={{ backgroundColor: cat.color }}
                          >
                            <CategoryIcon name={cat.icon} size={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[14px] text-[#0F172A] truncate">
                              {tx.note || cat.name}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {cat.name} · {walletMap.get(tx.walletId) || 'Dompet'}
                              {tx.time ? ` · ${tx.time}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 pl-2">
                          <p
                            className={`text-[14px] font-bold tabular-nums ${
                              isIncome ? 'text-[#16A34A]' : 'text-[#DC2626]'
                            }`}
                          >
                            {isIncome ? '+' : '-'}
                            {formatRupiah(tx.amount)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-5 sm:right-[max(1.25rem,calc((100vw-28rem)/2+1.25rem))] z-30">
        <button
          onClick={onOpenAddTransaction}
          className="w-14 h-14 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white flex items-center justify-center shadow-[0_10px_20px_rgba(37,99,235,0.35)] transition-all"
          aria-label="Tambah Transaksi Baru"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
