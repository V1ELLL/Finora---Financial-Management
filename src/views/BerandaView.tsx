import React from 'react';
import { Plus, ArrowRight, TrendingUp, Clock } from 'lucide-react';
import {
  Transaction,
  Category,
  Wallet,
  BudgetAnalysis,
  SavingsGoal,
} from '../types/finance';
import { HeroBalanceCard } from '../components/HeroBalanceCard';
import { FinancialTipsCard } from '../components/FinancialTipsCard';
import { BudgetCard } from '../components/BudgetCard';
import { SavingsCard } from '../components/SavingsCard';
import { CategoryIcon } from '../components/CategoryIcon';
import { formatRupiah, formatIndonesianDate } from '../utils/finance';

interface BerandaViewProps {
  totalBalance: number;
  income: number;
  expense: number;
  hideBalance: boolean;
  onToggleHideBalance: () => void;
  wallets: Wallet[];
  budgets: BudgetAnalysis[];
  savingsGoals: SavingsGoal[];
  recentTransactions: Transaction[];
  categories: Category[];
  onOpenAddTransaction: () => void;
  onSelectTransaction: (tx: Transaction) => void;
  onViewAllTransactions: () => void;
  onUpsertBudget: (categoryId: string, limit: number) => void;
  onDeleteBudget: (budgetId: string) => void;
  onDepositSavings: (goalId: string, amount: number, walletId: string, note?: string) => void;
  onWithdrawSavings: (goalId: string, amount: number, walletId: string, note?: string) => void;
  onAddSavingsGoal: (goal: { title: string; targetAmount: number; deadline: string; icon: string; color: string }) => void;
  onManageWallets: () => void;
}

export const BerandaView: React.FC<BerandaViewProps> = ({
  totalBalance,
  income,
  expense,
  hideBalance,
  onToggleHideBalance,
  wallets,
  budgets,
  savingsGoals,
  recentTransactions,
  categories,
  onOpenAddTransaction,
  onSelectTransaction,
  onViewAllTransactions,
  onUpsertBudget,
  onDeleteBudget,
  onDepositSavings,
  onWithdrawSavings,
  onAddSavingsGoal,
  onManageWallets,
}) => {
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const walletMap = new Map(wallets.map((w) => [w.id, w.name]));

  return (
    <div className="space-y-5 pb-24">
      {/* Hero Balance & Wallet Module */}
      <HeroBalanceCard
        totalBalance={totalBalance}
        income={income}
        expense={expense}
        hideBalance={hideBalance}
        onToggleHideBalance={onToggleHideBalance}
        wallets={wallets}
        onAddTransaction={onOpenAddTransaction}
        onManageWallets={onManageWallets}
      />

      {/* Daily Financial Tips Module */}
      <FinancialTipsCard />

      {/* Recent Transactions Module */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Clock size={17} />
            </div>
            <h3 className="font-semibold text-[15px] text-[#0F172A]">Transaksi Terbaru</h3>
          </div>
          <button
            onClick={onViewAllTransactions}
            className="text-[12px] font-semibold text-[#2563EB] flex items-center gap-1 hover:underline"
          >
            <span>Semua</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-[13px]">
            Belum ada transaksi tercatat. Tekan tombol + untuk mencatat.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTransactions.slice(0, 5).map((tx) => {
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
                  className="w-full text-left py-3 flex items-center justify-between hover:bg-slate-50/80 px-1 rounded-xl transition-colors group"
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
                        {cat.name} · {walletMap.get(tx.walletId) || 'Dompet'} · {formatIndonesianDate(tx.date)}
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
        )}
      </div>

      {/* Budget Progress Section */}
      <BudgetCard
        budgets={budgets}
        categories={categories}
        onUpsertBudget={onUpsertBudget}
        onDeleteBudget={onDeleteBudget}
      />

      {/* Target Tabungan Section */}
      <SavingsCard
        goals={savingsGoals}
        wallets={wallets}
        onDeposit={onDepositSavings}
        onWithdraw={onWithdrawSavings}
        onAddGoal={onAddSavingsGoal}
      />

      {/* Elevated Floating Action Button (FAB) anchored */}
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
