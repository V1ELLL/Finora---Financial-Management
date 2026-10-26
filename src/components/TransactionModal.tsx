import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Transaction, Category, Wallet, TransactionType } from '../types/finance';
import { CategoryIcon } from './CategoryIcon';
import { formatRupiah, parseRupiahInput } from '../utils/finance';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (txData: {
    type: TransactionType;
    amount: number;
    categoryId: string;
    walletId: string;
    date: string;
    time?: string;
    note?: string;
  }) => void;
  categories: Category[];
  wallets: Wallet[];
  editTransaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  wallets,
  editTransaction,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editTransaction) {
        setType(editTransaction.type);
        setAmountStr(editTransaction.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
        setCategoryId(editTransaction.categoryId);
        setWalletId(editTransaction.walletId);
        setDate(editTransaction.date);
        setTime(editTransaction.time || '12:00');
        setNote(editTransaction.note || '');
      } else {
        const now = new Date();
        setType('expense');
        setAmountStr('');
        setDate(now.toISOString().slice(0, 10));
        setTime(
          `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
        );
        setNote('');
        setError('');

        // default to first expense category and first wallet
        const defaultCat = categories.find(c => c.type === 'expense');
        if (defaultCat) setCategoryId(defaultCat.id);
        if (wallets.length > 0) setWalletId(wallets[0].id);
      }
    }
  }, [isOpen, editTransaction, categories, wallets]);

  // Adjust category if type changes and selected category is wrong type
  const availableCategories = categories.filter(c => c.type === type);
  useEffect(() => {
    if (availableCategories.length > 0) {
      const match = availableCategories.some(c => c.id === categoryId);
      if (!match) {
        setCategoryId(availableCategories[0].id);
      }
    }
  }, [type, categories]);

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/[^0-9]/g, '');
    if (!rawDigits) {
      setAmountStr('');
      return;
    }
    const num = parseInt(rawDigits, 10);
    setAmountStr(num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseRupiahInput(amountStr);
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Masukkan nominal transaksi yang valid.');
      return;
    }
    if (!categoryId) {
      setError('Pilih kategori transaksi.');
      return;
    }
    if (!walletId) {
      setError('Pilih dompet pembayaran.');
      return;
    }

    onSave({
      type,
      amount: parsedAmount,
      categoryId,
      walletId,
      date: date || new Date().toISOString().slice(0, 10),
      time: time || '12:00',
      note: note.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity p-0 sm:p-4">
      <div
        className="w-full sm:max-w-md bg-white rounded-t-[24px] sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <h2 id="modal-title" className="text-[17px] font-bold text-[#0F172A]">
            {editTransaction ? 'Ubah Transaksi' : 'Tambah Transaksi'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Transaction Type Segmented Toggle */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 text-[13px] font-semibold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-white text-[#DC2626] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 text-[13px] font-semibold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-white text-[#16A34A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pemasukan
            </button>
          </div>

          {/* Large Amount Field */}
          <div>
            <label className="block text-[12px] font-medium text-slate-500 mb-1.5">
              Nominal Transaksi
            </label>
            <div className="relative flex items-center border border-slate-300 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-100 rounded-xl px-3.5 py-2.5 transition-all bg-white">
              <span className="text-[20px] font-bold text-slate-400 mr-2 select-none">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                value={amountStr}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full text-[24px] font-bold text-[#0F172A] tabular-nums focus:outline-none placeholder:text-slate-300"
                autoFocus={!editTransaction}
              />
            </div>
            {error && <p className="text-[12px] text-rose-600 mt-1">{error}</p>}
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-[12px] font-medium text-slate-500 mb-2">
              Pilih Kategori ({type === 'expense' ? 'Pengeluaran' : 'Pemasukan'})
            </label>
            <div className="grid grid-cols-4 gap-2 max-h-44 overflow-y-auto p-1">
              {availableCategories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-[#2563EB] bg-blue-50/70 shadow-xs'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-1 text-white shadow-xs"
                      style={{ backgroundColor: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} size={20} />
                    </div>
                    <span className="text-[10px] font-medium line-clamp-1 leading-tight text-slate-700">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wallet Picker */}
          <div>
            <label className="block text-[12px] font-medium text-slate-500 mb-1.5">
              Sumber Dompet / Rekening
            </label>
            <div className="grid grid-cols-3 gap-2">
              {wallets.map((w) => {
                const isSelected = walletId === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWalletId(w.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#2563EB] bg-blue-50/70 text-[#2563EB]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: w.color }}
                      />
                      <span className="text-[11px] font-semibold truncate">{w.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 tabular-nums block truncate">
                      {formatRupiah(w.balance)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-slate-500 mb-1">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-[13px] border border-slate-300 rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-slate-500 mb-1">Waktu</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-[13px] border border-slate-300 rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-[12px] font-medium text-slate-500 mb-1">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Makan siang dengan rekan kerja"
              className="w-full text-[13px] border border-slate-300 rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#2563EB] placeholder:text-slate-400"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(37,99,235,0.24)] transition-all"
            >
              <Check size={18} strokeWidth={2.5} />
              <span>{editTransaction ? 'Simpan Perubahan' : 'Catat Transaksi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
