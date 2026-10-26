import React from 'react';
import { Eye, EyeOff, ArrowDownLeft, ArrowUpRight, Plus, Wallet as WalletIcon } from 'lucide-react';
import { Wallet } from '../types/finance';
import { formatRupiah } from '../utils/finance';

interface HeroBalanceCardProps {
  totalBalance: number;
  income: number;
  expense: number;
  hideBalance: boolean;
  onToggleHideBalance: () => void;
  wallets: Wallet[];
  onAddTransaction: () => void;
  onSelectWallet?: (walletId: string) => void;
  selectedWalletId?: string | null;
  onManageWallets?: () => void;
}

export const HeroBalanceCard: React.FC<HeroBalanceCardProps> = ({
  totalBalance,
  income,
  expense,
  hideBalance,
  onToggleHideBalance,
  wallets,
  onAddTransaction,
  onSelectWallet,
  selectedWalletId,
  onManageWallets,
}) => {
  return (
    <div className="space-y-4">
      {/* Primary Balance Module */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)] relative overflow-hidden">
        {/* Subtle decorative background gradient accent */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-50/60 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[13px] font-medium tracking-wide text-slate-500">
              Total Saldo Seluruh Dompet
            </span>
            <button
              onClick={onToggleHideBalance}
              className="p-1.5 -mr-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label={hideBalance ? 'Tampilkan Saldo' : 'Sembunyikan Saldo'}
            >
              {hideBalance ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="font-bold text-[30px] leading-tight text-[#0F172A] tabular-nums tracking-tight">
            {hideBalance ? 'Rp •••••••' : formatRupiah(totalBalance)}
          </div>

          {/* Income & Expense Split Badges */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
            {/* Pemasukan */}
            <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-100/60 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center shrink-0">
                <ArrowDownLeft size={20} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-emerald-800">Pemasukan Bulan Ini</p>
                <p className="font-bold text-[14px] text-[#16A34A] tabular-nums truncate">
                  {hideBalance ? 'Rp •••' : formatRupiah(income, { showPlus: true })}
                </p>
              </div>
            </div>

            {/* Pengeluaran */}
            <div className="bg-rose-50/70 rounded-xl p-3 border border-rose-100/60 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-rose-100 text-[#DC2626] flex items-center justify-center shrink-0">
                <ArrowUpRight size={20} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-rose-800">Pengeluaran Bulan Ini</p>
                <p className="font-bold text-[14px] text-[#DC2626] tabular-nums truncate">
                  {hideBalance ? 'Rp •••' : formatRupiah(expense)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallets Quick Carousel */}
      <div>
        <div className="flex items-center justify-between mb-2 px-0.5">
          <div className="flex items-center gap-1.5 text-[#0F172A]">
            <WalletIcon size={16} className="text-[#2563EB]" />
            <h2 className="text-[14px] font-semibold">Dompet & Rekening ({wallets.length})</h2>
          </div>
          {onManageWallets && (
            <button
              onClick={onManageWallets}
              className="text-[12px] font-semibold text-[#2563EB] hover:underline"
            >
              Kelola
            </button>
          )}
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {wallets.map((wallet) => {
            const isSelected = selectedWalletId === wallet.id;
            return (
              <button
                key={wallet.id}
                onClick={() => onSelectWallet?.(isSelected ? '' : wallet.id)}
                className={`flex-shrink-0 w-36 text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 border-[#2563EB] shadow-xs'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: wallet.color }}
                  />
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    {wallet.type}
                  </span>
                </div>
                <p className="text-[12px] font-medium text-slate-700 truncate">{wallet.name}</p>
                <p className="text-[13px] font-bold text-[#0F172A] tabular-nums truncate">
                  {hideBalance ? '•••••' : formatRupiah(wallet.balance)}
                </p>
              </button>
            );
          })}

          <button
            onClick={onManageWallets}
            className="flex-shrink-0 w-28 flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-slate-300 hover:border-[#2563EB] hover:bg-blue-50/40 text-slate-500 hover:text-[#2563EB] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center mb-1 text-slate-600">
              <Plus size={16} />
            </div>
            <span className="text-[11px] font-semibold">Tambah</span>
          </button>
        </div>
      </div>
    </div>
  );
};
