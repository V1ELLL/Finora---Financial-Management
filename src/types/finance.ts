/**
 * Finora - Data Models & Types
 * 100% Offline-first local data structures
 */

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  walletId: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  note?: string;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export type WalletType = 'cash' | 'bank' | 'ewallet';

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
  icon: string;
  color: string;
  accountNumber?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  monthlyLimit: number;
  month: string; // YYYY-MM
}

export interface SavingsLog {
  id: string;
  amount: number;
  date: string;
  type: 'deposit' | 'withdraw';
  note?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // YYYY-MM-DD
  icon: string;
  color: string;
  logs: SavingsLog[];
}

export interface UserProfile {
  name: string;
  hideBalance: boolean;
  pinCode?: string;
  pinEnabled: boolean;
  biometricEnabled: boolean;
  lastPinUpdate?: string;
  theme: 'light' | 'dark' | 'system';
}

export type BudgetStatusLevel = 'aman' | 'perhatian' | 'overbudget';

export interface BudgetAnalysis {
  budget: Budget;
  category: Category;
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatusLevel;
}
