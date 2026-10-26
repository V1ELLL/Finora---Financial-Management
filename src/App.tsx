import React, { useState, useEffect, useMemo } from 'react';
import {
  Transaction,
  Category,
  Wallet,
  Budget,
  SavingsGoal,
  UserProfile,
  TransactionType,
} from './types/finance';
import { LocalDb } from './db/localDb';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { BerandaView } from './views/BerandaView';
import { TransaksiView } from './views/TransaksiView';
import { StatistikView } from './views/StatistikView';
import { ProfilView } from './views/ProfilView';
import { TransactionModal } from './components/TransactionModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { PinModal } from './components/PinModal';
import { PinLockScreen } from './components/PinLockScreen';
import { PinSuccessView } from './components/PinSuccessView';
import {
  calculateTotalBalance,
  calculateCashflow,
  analyzeBudgets,
} from './utils/finance';

export default function App() {
  // Database States
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Navigation & Screen States
  const [activeTab, setActiveTab] = useState<NavTab>('beranda');
  const [currentSubView, setCurrentSubView] = useState<'none' | 'pin-success'>('none');
  const [isLocked, setIsLocked] = useState(false);

  // Modals
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [viewingTx, setViewingTx] = useState<Transaction | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from local DB on mount
  useEffect(() => {
    LocalDb.initDatabase();
    refreshAllData();
  }, []);

  const refreshAllData = () => {
    setTransactions(LocalDb.getTransactions());
    setCategories(LocalDb.getCategories());
    setWallets(LocalDb.getWallets());
    setBudgets(LocalDb.getBudgets());
    setSavingsGoals(LocalDb.getSavingsGoals());
    setProfile(LocalDb.getProfile());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Calculations
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const currentMonth = useMemo(() => todayStr.slice(0, 7), [todayStr]);

  const totalBalance = useMemo(() => calculateTotalBalance(wallets), [wallets]);

  const monthCashflow = useMemo(() => {
    return calculateCashflow(transactions, `${currentMonth}-01`, `${currentMonth}-31`);
  }, [transactions, currentMonth]);

  const analyzedBudgets = useMemo(() => {
    return analyzeBudgets(budgets, categories, transactions, currentMonth);
  }, [budgets, categories, transactions, currentMonth]);

  // Transaction Actions
  const handleSaveTransaction = (txData: {
    type: TransactionType;
    amount: number;
    categoryId: string;
    walletId: string;
    date: string;
    time?: string;
    note?: string;
  }) => {
    if (editingTx) {
      LocalDb.updateTransaction(editingTx.id, txData);
      showToast('Transaksi berhasil diperbarui!');
      setEditingTx(null);
    } else {
      LocalDb.addTransaction(txData);
      showToast('Transaksi berhasil dicatat!');
    }
    refreshAllData();
  };

  const handleDeleteTransaction = (id: string) => {
    LocalDb.deleteTransaction(id);
    refreshAllData();
    showToast('Transaksi telah dihapus.');
  };

  // Budget Actions
  const handleUpsertBudget = (categoryId: string, limit: number) => {
    LocalDb.upsertBudget({
      categoryId,
      monthlyLimit: limit,
      month: currentMonth,
    });
    refreshAllData();
    showToast('Batas anggaran berhasil disimpan.');
  };

  const handleDeleteBudget = (budgetId: string) => {
    LocalDb.deleteBudget(budgetId);
    refreshAllData();
    showToast('Anggaran dihapus.');
  };

  // Savings Actions
  const handleDepositSavings = (goalId: string, amount: number, walletId: string, note?: string) => {
    const ok = LocalDb.depositToSavings(goalId, amount, walletId, note);
    if (ok) {
      refreshAllData();
      showToast('Setoran tabungan berhasil dicatat!');
    }
  };

  const handleWithdrawSavings = (goalId: string, amount: number, walletId: string, note?: string) => {
    const ok = LocalDb.withdrawFromSavings(goalId, amount, walletId, note);
    if (ok) {
      refreshAllData();
      showToast('Penarikan dana tabungan berhasil dicatat!');
    }
  };

  const handleAddSavingsGoal = (goal: {
    title: string;
    targetAmount: number;
    deadline: string;
    icon: string;
    color: string;
  }) => {
    LocalDb.addSavingsGoal(goal);
    refreshAllData();
    showToast('Target tabungan baru berhasil dibuat!');
  };

  // Wallet Actions
  const handleAddWallet = (w: Omit<Wallet, 'id'>) => {
    LocalDb.addWallet(w);
    refreshAllData();
    showToast(`Dompet ${w.name} berhasil ditambahkan!`);
  };

  const handleUpdateWallet = (id: string, updated: Partial<Wallet>) => {
    LocalDb.updateWallet(id, updated);
    refreshAllData();
    showToast('Data dompet berhasil diperbarui.');
  };

  const handleDeleteWallet = (id: string) => {
    const ok = LocalDb.deleteWallet(id);
    if (ok) {
      refreshAllData();
      showToast('Dompet berhasil dihapus.');
    }
  };

  // Profile & PIN Actions
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    if (!profile) return;
    const merged = { ...profile, ...updated };
    LocalDb.saveProfile(merged);
    setProfile(merged);
  };

  const handlePinSaved = (newPin: string) => {
    const now = new Date();
    const indonesianMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const timeFormatted = `Hari ini, ${now.getDate()} ${indonesianMonths[now.getMonth()]} ${now.getFullYear()} • ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    handleUpdateProfile({
      pinCode: newPin,
      pinEnabled: true,
      lastPinUpdate: timeFormatted,
    });
    // Open the PinSuccessView matching the design in Image_22
    setCurrentSubView('pin-success');
    showToast('PIN keamanan berhasil diperbarui!');
  };

  // Export / Backup Actions
  const handleExportBackup = () => {
    const json = LocalDb.exportFullBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Finora_Cadangan_Lokal_${todayStr}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File cadangan lokal berhasil diunduh!');
  };

  const handleRestoreBackup = (content: string) => {
    const res = LocalDb.restoreFullBackup(content);
    if (res.success) {
      refreshAllData();
      showToast(res.message);
    } else {
      alert(res.message);
    }
  };

  const handleResetDatabase = () => {
    LocalDb.resetToDefault();
    refreshAllData();
    showToast('Data dikembalikan ke pengaturan awal.');
  };

  if (!profile) {
    return <div className="min-h-screen bg-[#F8FAFC]" />;
  }

  // If locked, show full screen PIN lock
  if (isLocked) {
    return (
      <PinLockScreen
        correctPin={profile.pinCode || '123456'}
        userName={profile.name}
        biometricEnabled={profile.biometricEnabled}
        onUnlock={() => setIsLocked(false)}
      />
    );
  }

  // Header Title derivation
  let headerTitle = 'Finora';
  let showBack = false;

  if (currentSubView === 'pin-success') {
    headerTitle = 'Keamanan Finora';
    showBack = true;
  } else if (activeTab === 'transaksi') {
    headerTitle = 'Riwayat Transaksi';
  } else if (activeTab === 'statistik') {
    headerTitle = 'Analisis Keuangan';
  } else if (activeTab === 'profil') {
    headerTitle = 'Profil & Pengaturan';
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans select-none">
      {/* Fixed Header */}
      <Header
        title={headerTitle}
        showBack={showBack}
        onBack={() => setCurrentSubView('none')}
        userName={profile.name}
        onProfileClick={() => {
          setCurrentSubView('none');
          setActiveTab('profil');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-24">
        {currentSubView === 'pin-success' ? (
          <PinSuccessView
            onBackToSettings={() => {
              setCurrentSubView('none');
              setActiveTab('profil');
            }}
            onGoHome={() => {
              setCurrentSubView('none');
              setActiveTab('beranda');
            }}
            lastUpdated={profile.lastPinUpdate}
            biometricActive={profile.biometricEnabled}
          />
        ) : (
          <>
            {activeTab === 'beranda' && (
              <BerandaView
                totalBalance={totalBalance}
                income={monthCashflow.income}
                expense={monthCashflow.expense}
                hideBalance={profile.hideBalance}
                onToggleHideBalance={() =>
                  handleUpdateProfile({ hideBalance: !profile.hideBalance })
                }
                wallets={wallets}
                budgets={analyzedBudgets}
                savingsGoals={savingsGoals}
                recentTransactions={transactions}
                categories={categories}
                onOpenAddTransaction={() => {
                  setEditingTx(null);
                  setIsTxModalOpen(true);
                }}
                onSelectTransaction={(tx) => setViewingTx(tx)}
                onViewAllTransactions={() => setActiveTab('transaksi')}
                onUpsertBudget={handleUpsertBudget}
                onDeleteBudget={handleDeleteBudget}
                onDepositSavings={handleDepositSavings}
                onWithdrawSavings={handleWithdrawSavings}
                onAddSavingsGoal={handleAddSavingsGoal}
                onManageWallets={() => setActiveTab('profil')}
              />
            )}

            {activeTab === 'transaksi' && (
              <TransaksiView
                transactions={transactions}
                categories={categories}
                wallets={wallets}
                onSelectTransaction={(tx) => setViewingTx(tx)}
                onOpenAddTransaction={() => {
                  setEditingTx(null);
                  setIsTxModalOpen(true);
                }}
              />
            )}

            {activeTab === 'statistik' && (
              <StatistikView
                transactions={transactions}
                categories={categories}
                wallets={wallets}
              />
            )}

            {activeTab === 'profil' && (
              <ProfilView
                profile={profile}
                wallets={wallets}
                categories={categories}
                transactions={transactions}
                onUpdateProfile={handleUpdateProfile}
                onOpenPinModal={() => setIsPinModalOpen(true)}
                onViewPinStatus={() => setCurrentSubView('pin-success')}
                onLockApp={() => setIsLocked(true)}
                onAddWallet={handleAddWallet}
                onUpdateWallet={handleUpdateWallet}
                onDeleteWallet={handleDeleteWallet}
                onExportBackup={handleExportBackup}
                onRestoreBackup={handleRestoreBackup}
                onResetDatabase={handleResetDatabase}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      {currentSubView === 'none' && (
        <Navigation activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
      )}

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTx(null);
        }}
        onSave={handleSaveTransaction}
        categories={categories}
        wallets={wallets}
        editTransaction={editingTx}
      />

      {/* Transaction Detail View Modal */}
      <TransactionDetailModal
        transaction={viewingTx}
        categories={categories}
        wallets={wallets}
        onClose={() => setViewingTx(null)}
        onEdit={(tx) => {
          setEditingTx(tx);
          setIsTxModalOpen(true);
        }}
        onDelete={handleDeleteTransaction}
      />

      {/* 6-Digit PIN Keypad Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onPinSaved={handlePinSaved}
        currentPin={profile.pinCode}
      />

      {/* Floating Offline Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 inset-x-4 max-w-sm mx-auto z-50 bg-slate-900/90 text-white text-[13px] px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
