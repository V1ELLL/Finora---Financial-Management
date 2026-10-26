import React, { useState } from 'react';
import { Target, Plus, Minus, Calendar, ChevronRight, Check } from 'lucide-react';
import { SavingsGoal, Wallet } from '../types/finance';
import { CategoryIcon } from './CategoryIcon';
import { formatRupiah, formatIndonesianDate } from '../utils/finance';

interface SavingsCardProps {
  goals: SavingsGoal[];
  wallets: Wallet[];
  onDeposit: (goalId: string, amount: number, walletId: string, note?: string) => void;
  onWithdraw: (goalId: string, amount: number, walletId: string, note?: string) => void;
  onAddGoal: (goal: { title: string; targetAmount: number; deadline: string; icon: string; color: string }) => void;
}

export const SavingsCard: React.FC<SavingsCardProps> = ({
  goals,
  wallets,
  onDeposit,
  onWithdraw,
  onAddGoal,
}) => {
  const [activeModal, setActiveModal] = useState<{
    type: 'deposit' | 'withdraw';
    goal: SavingsGoal;
  } | null>(null);

  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [amountStr, setAmountStr] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState(wallets[0]?.id || '');
  const [note, setNote] = useState('');

  // New Goal Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTargetStr, setNewTargetStr] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const handleOpenAction = (type: 'deposit' | 'withdraw', goal: SavingsGoal) => {
    setActiveModal({ type, goal });
    setAmountStr('');
    setSelectedWalletId(wallets[0]?.id || '');
    setNote('');
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal) return;

    const num = parseInt(amountStr.replace(/[^0-9]/g, ''), 10);
    if (!num || num <= 0 || !selectedWalletId) return;

    if (activeModal.type === 'deposit') {
      onDeposit(activeModal.goal.id, num, selectedWalletId, note);
    } else {
      onWithdraw(activeModal.goal.id, num, selectedWalletId, note);
    }

    setActiveModal(null);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(newTargetStr.replace(/[^0-9]/g, ''), 10);
    if (!newTitle.trim() || !target || target <= 0) return;

    onAddGoal({
      title: newTitle.trim(),
      targetAmount: target,
      deadline: newDeadline || '2026-12-31',
      icon: 'ShieldCheck',
      color: '#0D9488',
    });

    setNewTitle('');
    setNewTargetStr('');
    setNewDeadline('');
    setIsAddGoalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0D9488] flex items-center justify-center">
            <Target size={17} />
          </div>
          <h3 className="font-semibold text-[15px] text-[#0F172A]">Target Tabungan & Impian</h3>
        </div>
        <button
          onClick={() => setIsAddGoalOpen(true)}
          className="text-[12px] font-semibold text-[#0D9488] flex items-center gap-1 hover:underline"
        >
          <Plus size={14} />
          <span>Buat Target</span>
        </button>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div key={goal.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                    style={{ backgroundColor: goal.color }}
                  >
                    <CategoryIcon name={goal.icon} size={18} />
                  </span>
                  <div>
                    <h4 className="font-semibold text-[13px] text-slate-900">{goal.title}</h4>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar size={11} />
                      Target: {formatIndonesianDate(goal.deadline)}
                    </span>
                  </div>
                </div>

                <span className="text-[12px] font-bold text-[#0D9488] tabular-nums bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                  {percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-[#0D9488] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 mb-3 tabular-nums font-medium">
                <span>Terkumpul {formatRupiah(goal.currentAmount)}</span>
                <span className="text-slate-400">Target {formatRupiah(goal.targetAmount)}</span>
              </div>

              {/* Quick Deposit & Withdraw Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                <button
                  onClick={() => handleOpenAction('deposit', goal)}
                  className="h-8 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#0D9488] text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus size={13} />
                  <span>Setor Dana</span>
                </button>
                <button
                  onClick={() => handleOpenAction('withdraw', goal)}
                  disabled={goal.currentAmount <= 0}
                  className="h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Minus size={13} />
                  <span>Tarik Dana</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit / Withdraw Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl">
            <h4 className="text-[16px] font-bold text-[#0F172A] mb-1">
              {activeModal.type === 'deposit' ? 'Setor Dana ke Tabungan' : 'Tarik Dana dari Tabungan'}
            </h4>
            <p className="text-[12px] text-slate-500 mb-4">{activeModal.goal.title}</p>

            <form onSubmit={handleActionSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1">
                  Nominal {activeModal.type === 'deposit' ? 'Setoran' : 'Penarikan'}
                </label>
                <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#0D9488]">
                  <span className="text-[14px] font-bold text-slate-400 mr-1.5">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amountStr}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, '');
                      setAmountStr(clean ? parseInt(clean, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '');
                    }}
                    placeholder="0"
                    className="w-full text-[16px] font-bold text-[#0F172A] focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1">
                  {activeModal.type === 'deposit' ? 'Gunakan Saldo Dari' : 'Transferkan Saldo Ke'}
                </label>
                <select
                  value={selectedWalletId}
                  onChange={(e) => setSelectedWalletId(e.target.value)}
                  className="w-full text-[13px] border border-slate-300 rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#0D9488]"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({formatRupiah(w.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1">
                  Catatan (Opsional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Contoh: Sisa uang belanja"
                  className="w-full text-[13px] border border-slate-300 rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#0D9488]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2 text-[13px] font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-[13px] font-semibold text-white bg-[#0D9488] rounded-xl hover:bg-[#0b7a70]"
                >
                  Konfirmasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Goal Modal */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl">
            <h4 className="text-[16px] font-bold text-[#0F172A] mb-3">Buat Target Tabungan Baru</h4>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1">
                  Nama Target / Impian
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Beli Laptop Baru"
                  className="w-full text-[13px] border border-slate-300 rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#0D9488]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1">
                  Target Nominal
                </label>
                <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2 focus-within:border-[#0D9488]">
                  <span className="text-[14px] font-bold text-slate-400 mr-1.5">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={newTargetStr}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, '');
                      setNewTargetStr(clean ? parseInt(clean, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '');
                    }}
                    placeholder="10.000.000"
                    className="w-full text-[15px] font-bold text-[#0F172A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1">
                  Target Waktu (Deadline)
                </label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full text-[13px] border border-slate-300 rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#0D9488]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddGoalOpen(false)}
                  className="flex-1 py-2 text-[13px] font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-[13px] font-semibold text-white bg-[#0D9488] rounded-xl hover:bg-[#0b7a70]"
                >
                  Simpan Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
