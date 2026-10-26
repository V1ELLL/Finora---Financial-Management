import React, { useState } from 'react';
import { X, Calendar, Clock, Wallet as WalletIcon, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { Transaction, Category, Wallet } from '../types/finance';
import { CategoryIcon } from './CategoryIcon';
import { formatRupiah, formatIndonesianDate } from '../utils/finance';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  categories: Category[];
  wallets: Wallet[];
  onClose: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  categories,
  wallets,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!transaction) return null;

  const category = categories.find((c) => c.id === transaction.categoryId) || {
    id: transaction.categoryId,
    name: 'Kategori Lain',
    icon: 'Tag',
    color: '#64748B',
    type: transaction.type,
  };

  const wallet = wallets.find((w) => w.id === transaction.walletId) || {
    id: transaction.walletId,
    name: 'Dompet Utama',
    type: 'cash' as const,
    balance: 0,
    icon: 'Wallet',
    color: '#2563EB',
  };

  const isIncome = transaction.type === 'income';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div
        className="w-full sm:max-w-md bg-white rounded-t-[24px] sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
          <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
            Rincian Transaksi
          </span>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Header Amount & Icon */}
          <div className="flex flex-col items-center text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-3 shadow-sm"
              style={{ backgroundColor: category.color }}
            >
              <CategoryIcon name={category.icon} size={30} />
            </div>
            <h3 id="detail-title" className="text-[17px] font-bold text-[#0F172A] mb-1">
              {category.name}
            </h3>
            <p
              className={`text-[28px] font-bold tabular-nums tracking-tight ${
                isIncome ? 'text-[#16A34A]' : 'text-[#DC2626]'
              }`}
            >
              {isIncome ? '+' : '-'}
              {formatRupiah(transaction.amount)}
            </p>
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar size={15} />
                Tanggal
              </span>
              <span className="font-semibold text-slate-800">
                {formatIndonesianDate(transaction.date)}
              </span>
            </div>

            {transaction.time && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock size={15} />
                  Waktu
                </span>
                <span className="font-semibold text-slate-800">
                  {transaction.time} WIB
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <WalletIcon size={15} />
                Dompet
              </span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: wallet.color }}
                />
                {wallet.name}
              </span>
            </div>

            {transaction.note && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block text-[11px] font-medium mb-1">
                  Catatan:
                </span>
                <p className="text-slate-800 font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/60">
                  {transaction.note}
                </p>
              </div>
            )}
          </div>

          {/* Delete Confirmation Box */}
          {showConfirmDelete ? (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center space-y-3">
              <div className="flex items-center justify-center text-rose-600 gap-1.5 font-bold text-[14px]">
                <AlertCircle size={18} />
                Hapus transaksi ini?
              </div>
              <p className="text-[12px] text-rose-700">
                Saldo dompet {wallet.name} akan disesuaikan kembali secara otomatis.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="py-2 text-[13px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    onDelete(transaction.id);
                    onClose();
                  }}
                  className="py-2 text-[13px] font-semibold text-white bg-[#DC2626] rounded-lg hover:bg-rose-700"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onEdit(transaction);
                }}
                className="h-11 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors"
              >
                <Edit2 size={16} />
                <span>Ubah</span>
              </button>
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="h-11 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#DC2626] font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 size={16} />
                <span>Hapus</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
