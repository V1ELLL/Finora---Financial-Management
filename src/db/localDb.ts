import {
  Transaction,
  Category,
  Wallet,
  Budget,
  SavingsGoal,
  UserProfile,
} from '../types/finance';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finora_db_transactions_v1',
  CATEGORIES: 'finora_db_categories_v1',
  WALLETS: 'finora_db_wallets_v1',
  BUDGETS: 'finora_db_budgets_v1',
  SAVINGS: 'finora_db_savings_v1',
  PROFILE: 'finora_db_profile_v1',
  INITIALIZED: 'finora_db_initialized_v1',
};

// Default Categories
export const DEFAULT_CATEGORIES: Category[] = [
  // Expense
  { id: 'cat_food', name: 'Makanan & Minuman', type: 'expense', icon: 'Utensils', color: '#DC2626' },
  { id: 'cat_transport', name: 'Transportasi', type: 'expense', icon: 'Car', color: '#2563EB' },
  { id: 'cat_shopping', name: 'Belanja Harian', type: 'expense', icon: 'ShoppingBag', color: '#7C3AED' },
  { id: 'cat_bills', name: 'Tagihan & Listrik', type: 'expense', icon: 'Zap', color: '#D97706' },
  { id: 'cat_entertainment', name: 'Hiburan & Hobi', type: 'expense', icon: 'Film', color: '#EC4899' },
  { id: 'cat_health', name: 'Kesehatan & Obat', type: 'expense', icon: 'HeartPulse', color: '#059669' },
  { id: 'cat_education', name: 'Pendidikan', type: 'expense', icon: 'GraduationCap', color: '#0284C7' },
  { id: 'cat_other_exp', name: 'Pengeluaran Lain', type: 'expense', icon: 'MoreHorizontal', color: '#64748B' },
  // Income
  { id: 'cat_salary', name: 'Gaji Pokok', type: 'income', icon: 'Briefcase', color: '#16A34A' },
  { id: 'cat_freelance', name: 'Proyek Sampingan', type: 'income', icon: 'Laptop', color: '#0D9488' },
  { id: 'cat_invest', name: 'Hasil Investasi', type: 'income', icon: 'TrendingUp', color: '#2563EB' },
  { id: 'cat_bonus', name: 'Bonus & THR', type: 'income', icon: 'Award', color: '#D97706' },
  { id: 'cat_other_inc', name: 'Pemasukan Lain', type: 'income', icon: 'Gift', color: '#8B5CF6' },
];

// Default Wallets
export const DEFAULT_WALLETS: Wallet[] = [
  { id: 'w_cash', name: 'Kas Tunai', type: 'cash', balance: 750000, icon: 'Wallet', color: '#16A34A' },
  { id: 'w_bca', name: 'BCA Utama', type: 'bank', balance: 5200000, icon: 'CreditCard', color: '#2563EB', accountNumber: '••• 8291' },
  { id: 'w_gopay', name: 'GoPay / E-Wallet', type: 'ewallet', balance: 480000, icon: 'Smartphone', color: '#0073AE' },
];

// Default Budgets for current month
export function getDefaultBudgets(currentMonth: string): Budget[] {
  return [
    { id: 'b_food', categoryId: 'cat_food', monthlyLimit: 2000000, month: currentMonth },
    { id: 'b_transport', categoryId: 'cat_transport', monthlyLimit: 750000, month: currentMonth },
    { id: 'b_shopping', categoryId: 'cat_shopping', monthlyLimit: 1200000, month: currentMonth },
    { id: 'b_bills', categoryId: 'cat_bills', monthlyLimit: 600000, month: currentMonth },
  ];
}

// Default Savings Goals
export const DEFAULT_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'sg_emergency',
    title: 'Dana Darurat Siaga',
    targetAmount: 15000000,
    currentAmount: 8500000,
    deadline: '2026-12-31',
    icon: 'ShieldCheck',
    color: '#0D9488',
    logs: [
      { id: 'log_1', amount: 5000000, date: '2026-09-01', type: 'deposit', note: 'Setoran Awal' },
      { id: 'log_2', amount: 3500000, date: '2026-10-01', type: 'deposit', note: 'Alokasi Gaji Oktober' },
    ],
  },
  {
    id: 'sg_vacation',
    title: 'Liburan Akhir Tahun',
    targetAmount: 5000000,
    currentAmount: 2400000,
    deadline: '2026-12-20',
    icon: 'Plane',
    color: '#2563EB',
    logs: [
      { id: 'log_3', amount: 1500000, date: '2026-09-15', type: 'deposit', note: 'Tabungan Tiket' },
      { id: 'log_4', amount: 900000, date: '2026-10-15', type: 'deposit', note: 'Tabungan Hotel' },
    ],
  },
];

// Initial starter transactions (only seeded if database is fresh)
export function getInitialTransactions(todayDate: string): Transaction[] {
  const [year, month] = todayDate.split('-');
  const m = month || '10';
  const y = year || '2026';

  return [
    {
      id: 'tx_init_1',
      type: 'income',
      amount: 8500000,
      categoryId: 'cat_salary',
      walletId: 'w_bca',
      date: `${y}-${m}-01`,
      time: '08:30',
      note: 'Gaji Bulanan Oktober',
      createdAt: 1727746200000,
    },
    {
      id: 'tx_init_2',
      type: 'expense',
      amount: 45000,
      categoryId: 'cat_food',
      walletId: 'w_cash',
      date: todayDate,
      time: '12:30',
      note: 'Makan Siang Nasi Padang',
      createdAt: Date.now() - 3600000,
    },
    {
      id: 'tx_init_3',
      type: 'expense',
      amount: 35000,
      categoryId: 'cat_transport',
      walletId: 'w_gopay',
      date: todayDate,
      time: '09:15',
      note: 'Ongkos Ojek Online Kantor',
      createdAt: Date.now() - 14400000,
    },
    {
      id: 'tx_init_4',
      type: 'expense',
      amount: 250000,
      categoryId: 'cat_shopping',
      walletId: 'w_bca',
      date: `${y}-${m}-22`,
      time: '16:00',
      note: 'Belanja Mingguan Supermarket',
      createdAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'tx_init_5',
      type: 'expense',
      amount: 320000,
      categoryId: 'cat_bills',
      walletId: 'w_bca',
      date: `${y}-${m}-20`,
      time: '10:00',
      note: 'Token Listrik PLN & Internet',
      createdAt: Date.now() - 86400000 * 4,
    },
    {
      id: 'tx_init_6',
      type: 'income',
      amount: 1200000,
      categoryId: 'cat_freelance',
      walletId: 'w_bca',
      date: `${y}-${m}-15`,
      time: '19:45',
      note: 'Desain Banner Promo Klien',
      createdAt: Date.now() - 86400000 * 9,
    },
    {
      id: 'tx_init_7',
      type: 'expense',
      amount: 85000,
      categoryId: 'cat_entertainment',
      walletId: 'w_gopay',
      date: `${y}-${m}-12`,
      time: '20:15',
      note: 'Tiket Bioskop XXI & Popcorn',
      createdAt: Date.now() - 86400000 * 12,
    },
  ];
}

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Budi Santoso',
  hideBalance: false,
  pinCode: '123456',
  pinEnabled: true,
  biometricEnabled: true,
  lastPinUpdate: 'Hari ini, 24 Okt 2026 • 09:42 WIB',
  theme: 'light',
};

/**
 * Local Database Repository
 * Fully offline, persistent in browser storage with atomic transactions
 */
export class LocalDb {
  static isInitialized(): boolean {
    return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true';
  }

  static initDatabase(): void {
    if (this.isInitialized()) return;

    const today = new Date().toISOString().slice(0, 10);
    const currentMonth = today.slice(0, 7);

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(DEFAULT_WALLETS));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(getDefaultBudgets(currentMonth)));
    localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(DEFAULT_SAVINGS_GOALS));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(getInitialTransactions(today)));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  // Transactions
  static getTransactions(): Transaction[] {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  static addTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const list = this.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: Date.now(),
    };

    list.unshift(newTx);
    this.saveTransactions(list);

    // Update wallet balance atomically
    this.adjustWalletBalance(tx.walletId, tx.type === 'income' ? tx.amount : -tx.amount);

    return newTx;
  }

  static updateTransaction(id: string, updated: Partial<Transaction>): Transaction | null {
    const list = this.getTransactions();
    const index = list.findIndex(t => t.id === id);
    if (index === -1) return null;

    const oldTx = list[index];

    // Revert old wallet balance
    this.adjustWalletBalance(oldTx.walletId, oldTx.type === 'income' ? -oldTx.amount : oldTx.amount);

    const merged: Transaction = { ...oldTx, ...updated };
    list[index] = merged;
    this.saveTransactions(list);

    // Apply new wallet balance
    this.adjustWalletBalance(merged.walletId, merged.type === 'income' ? merged.amount : -merged.amount);

    return merged;
  }

  static deleteTransaction(id: string): boolean {
    const list = this.getTransactions();
    const index = list.findIndex(t => t.id === id);
    if (index === -1) return false;

    const oldTx = list[index];
    // Revert wallet balance
    this.adjustWalletBalance(oldTx.walletId, oldTx.type === 'income' ? -oldTx.amount : oldTx.amount);

    list.splice(index, 1);
    this.saveTransactions(list);
    return true;
  }

  // Categories
  static getCategories(): Category[] {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  static saveCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  static addCategory(cat: Omit<Category, 'id'>): Category {
    const list = this.getCategories();
    const newCat: Category = {
      ...cat,
      id: 'cat_' + Date.now(),
    };
    list.push(newCat);
    this.saveCategories(list);
    return newCat;
  }

  // Wallets
  static getWallets(): Wallet[] {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WALLETS);
      return data ? JSON.parse(data) : DEFAULT_WALLETS;
    } catch {
      return DEFAULT_WALLETS;
    }
  }

  static saveWallets(wallets: Wallet[]): void {
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
  }

  static adjustWalletBalance(walletId: string, delta: number): void {
    const wallets = this.getWallets();
    const target = wallets.find(w => w.id === walletId);
    if (target) {
      target.balance += delta;
      this.saveWallets(wallets);
    }
  }

  static addWallet(wallet: Omit<Wallet, 'id'>): Wallet {
    const list = this.getWallets();
    const newWallet: Wallet = {
      ...wallet,
      id: 'w_' + Date.now(),
    };
    list.push(newWallet);
    this.saveWallets(list);
    return newWallet;
  }

  static updateWallet(id: string, updated: Partial<Wallet>): Wallet | null {
    const list = this.getWallets();
    const index = list.findIndex(w => w.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updated };
    this.saveWallets(list);
    return list[index];
  }

  static deleteWallet(id: string): boolean {
    const list = this.getWallets();
    if (list.length <= 1) return false; // Prevent deleting last wallet
    const filtered = list.filter(w => w.id !== id);
    this.saveWallets(filtered);
    return true;
  }

  // Budgets
  static getBudgets(): Budget[] {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveBudgets(budgets: Budget[]): void {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }

  static upsertBudget(budget: Omit<Budget, 'id'> & { id?: string }): Budget {
    const list = this.getBudgets();
    const existingIndex = list.findIndex(
      b => b.categoryId === budget.categoryId && b.month === budget.month
    );

    if (existingIndex >= 0) {
      list[existingIndex].monthlyLimit = budget.monthlyLimit;
      this.saveBudgets(list);
      return list[existingIndex];
    }

    const newBudget: Budget = {
      ...budget,
      id: budget.id || 'b_' + Date.now(),
    };
    list.push(newBudget);
    this.saveBudgets(list);
    return newBudget;
  }

  static deleteBudget(id: string): boolean {
    const list = this.getBudgets();
    const filtered = list.filter(b => b.id !== id);
    this.saveBudgets(filtered);
    return true;
  }

  // Savings Goals
  static getSavingsGoals(): SavingsGoal[] {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVINGS);
      return data ? JSON.parse(data) : DEFAULT_SAVINGS_GOALS;
    } catch {
      return DEFAULT_SAVINGS_GOALS;
    }
  }

  static saveSavingsGoals(goals: SavingsGoal[]): void {
    localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(goals));
  }

  static addSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'logs'>): SavingsGoal {
    const list = this.getSavingsGoals();
    const newGoal: SavingsGoal = {
      ...goal,
      id: 'sg_' + Date.now(),
      currentAmount: 0,
      logs: [],
    };
    list.push(newGoal);
    this.saveSavingsGoals(list);
    return newGoal;
  }

  static depositToSavings(goalId: string, amount: number, walletId: string, note?: string): boolean {
    const list = this.getSavingsGoals();
    const target = list.find(g => g.id === goalId);
    if (!target) return false;

    target.currentAmount += amount;
    target.logs.unshift({
      id: 'log_' + Date.now(),
      amount,
      date: new Date().toISOString().slice(0, 10),
      type: 'deposit',
      note: note || 'Penambahan Dana Tabungan',
    });
    this.saveSavingsGoals(list);

    // Also deduct from wallet and log transaction
    this.addTransaction({
      type: 'expense',
      amount,
      categoryId: 'cat_other_exp',
      walletId,
      date: new Date().toISOString().slice(0, 10),
      note: `Setor ke Target: ${target.title}${note ? ` (${note})` : ''}`,
    });

    return true;
  }

  static withdrawFromSavings(goalId: string, amount: number, walletId: string, note?: string): boolean {
    const list = this.getSavingsGoals();
    const target = list.find(g => g.id === goalId);
    if (!target || target.currentAmount < amount) return false;

    target.currentAmount -= amount;
    target.logs.unshift({
      id: 'log_' + Date.now(),
      amount,
      date: new Date().toISOString().slice(0, 10),
      type: 'withdraw',
      note: note || 'Penarikan Dana Tabungan',
    });
    this.saveSavingsGoals(list);

    // Also add to wallet and log transaction
    this.addTransaction({
      type: 'income',
      amount,
      categoryId: 'cat_other_inc',
      walletId,
      date: new Date().toISOString().slice(0, 10),
      note: `Tarik dari Target: ${target.title}${note ? ` (${note})` : ''}`,
    });

    return true;
  }

  // Profile & Settings
  static getProfile(): UserProfile {
    this.initDatabase();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  static saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  // Full Database Export & Backup
  static exportFullBackup(): string {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      appName: 'Finora',
      transactions: this.getTransactions(),
      categories: this.getCategories(),
      wallets: this.getWallets(),
      budgets: this.getBudgets(),
      savings: this.getSavingsGoals(),
      profile: this.getProfile(),
    };
    return JSON.stringify(backupData, null, 2);
  }

  // Full Database Import & Restore with integrity validation
  static restoreFullBackup(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.transactions) || !Array.isArray(parsed.wallets)) {
        return { success: false, message: 'Format file cadangan tidak valid atau rusak.' };
      }

      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(parsed.transactions));
      if (Array.isArray(parsed.categories)) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(parsed.categories));
      }
      if (Array.isArray(parsed.wallets)) {
        localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(parsed.wallets));
      }
      if (Array.isArray(parsed.budgets)) {
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(parsed.budgets));
      }
      if (Array.isArray(parsed.savings)) {
        localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(parsed.savings));
      }
      if (parsed.profile) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed.profile));
      }

      return { success: true, message: 'Data cadangan berhasil dipulihkan secara penuh!' };
    } catch (e: any) {
      return { success: false, message: `Gagal membaca file cadangan: ${e.message}` };
    }
  }

  // Reset to initial state
  static resetToDefault(): void {
    localStorage.clear();
    this.initDatabase();
  }
}
