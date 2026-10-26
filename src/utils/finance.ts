import { Budget, Category, Transaction, Wallet, BudgetAnalysis } from '../types/finance';

/**
 * Format number to strict Indonesian Rupiah standard format
 * e.g.: Rp2.450.000 (no space between Rp and numbers, dot as thousand separator)
 */
export function formatRupiah(amount: number, options?: { prefix?: string; showPlus?: boolean }): string {
  const isNegative = amount < 0;
  const absVal = Math.round(Math.abs(amount));
  const formatted = absVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const customPrefix = options?.prefix !== undefined ? options.prefix : 'Rp';
  
  if (isNegative) {
    return `-${customPrefix}${formatted}`;
  }
  if (options?.showPlus && amount > 0) {
    return `+${customPrefix}${formatted}`;
  }
  return `${customPrefix}${formatted}`;
}

/**
 * Parses numeric string from Indonesian format or raw digits
 */
export function parseRupiahInput(value: string): number {
  if (!value) return 0;
  // Remove 'Rp', whitespace, dots
  const cleaned = value.replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Calculate total balance aggregated across all active wallets
 */
export function calculateTotalBalance(wallets: Wallet[]): number {
  return wallets.reduce((sum, w) => sum + (Number(w.balance) || 0), 0);
}

/**
 * Calculate income, expense and net savings within a date range
 */
export function calculateCashflow(
  transactions: Transaction[],
  startDate?: string,
  endDate?: string
): { income: number; expense: number; net: number } {
  let filtered = transactions;
  if (startDate && endDate) {
    filtered = transactions.filter(t => t.date >= startDate && t.date <= endDate);
  } else if (startDate) {
    filtered = transactions.filter(t => t.date >= startDate);
  }

  let income = 0;
  let expense = 0;

  for (const t of filtered) {
    const val = Math.abs(Number(t.amount) || 0);
    if (t.type === 'income') {
      income += val;
    } else {
      expense += val;
    }
  }

  return {
    income,
    expense,
    net: income - expense,
  };
}

/**
 * Calculate expense distribution grouped by category
 */
export function calculateCategoryExpenses(
  transactions: Transaction[],
  categories: Category[],
  options?: { startDate?: string; endDate?: string }
): {
  categoryId: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
  count: number;
}[] {
  let filtered = transactions.filter(t => t.type === 'expense');
  if (options?.startDate && options?.endDate) {
    filtered = filtered.filter(t => t.date >= options.startDate! && t.date <= options.endDate!);
  }

  const categoryMap = new Map<string, Category>();
  categories.forEach(c => categoryMap.set(c.id, c));

  const totalExpense = filtered.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const sums = new Map<string, { amount: number; count: number }>();

  for (const t of filtered) {
    const current = sums.get(t.categoryId) || { amount: 0, count: 0 };
    current.amount += Number(t.amount) || 0;
    current.count += 1;
    sums.set(t.categoryId, current);
  }

  const results = Array.from(sums.entries()).map(([catId, data]) => {
    const cat = categoryMap.get(catId) || {
      id: catId,
      name: 'Lainnya',
      icon: 'Tag',
      color: '#64748B',
      type: 'expense' as const,
    };
    const percentage = totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0;
    return {
      categoryId: catId,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      amount: data.amount,
      percentage: Math.round(percentage * 10) / 10,
      count: data.count,
    };
  });

  return results.sort((a, b) => b.amount - a.amount);
}

/**
 * Calculate budget status: Aman (<75%), Perhatian (75-99%), Overbudget (>=100%)
 */
export function calculateBudgetStatus(spent: number, limit: number): {
  spent: number;
  limit: number;
  remaining: number;
  percentage: number;
  status: 'aman' | 'perhatian' | 'overbudget';
} {
  const safeLimit = Math.max(1, limit);
  const percentage = Math.round((spent / safeLimit) * 100);
  const remaining = Math.max(0, limit - spent);

  let status: 'aman' | 'perhatian' | 'overbudget' = 'aman';
  if (spent >= limit) {
    status = 'overbudget';
  } else if (percentage >= 75) {
    status = 'perhatian';
  }

  return {
    spent,
    limit,
    remaining,
    percentage,
    status,
  };
}

/**
 * Analyze all active budgets against monthly transactions
 */
export function analyzeBudgets(
  budgets: Budget[],
  categories: Category[],
  transactions: Transaction[],
  targetMonth: string // YYYY-MM
): BudgetAnalysis[] {
  const catMap = new Map(categories.map(c => [c.id, c]));
  const monthTransactions = transactions.filter(
    t => t.type === 'expense' && t.date.startsWith(targetMonth)
  );

  return budgets.map(b => {
    const category = catMap.get(b.categoryId) || {
      id: b.categoryId,
      name: 'Kategori',
      icon: 'Tag',
      color: '#64748B',
      type: 'expense' as const,
    };
    const spent = monthTransactions
      .filter(t => t.categoryId === b.categoryId)
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const calc = calculateBudgetStatus(spent, b.monthlyLimit);

    return {
      budget: b,
      category,
      spent,
      remaining: calc.remaining,
      percentage: calc.percentage,
      status: calc.status,
    };
  });
}

/**
 * Format standard Indonesian date label
 */
export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '';
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (dateStr === todayStr) {
    return 'Hari Ini';
  }
  if (dateStr === yesterdayStr) {
    return 'Kemarin';
  }

  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const day = parseInt(parts[2], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const year = parts[0];

  return `${day} ${monthNames[monthIdx] || ''} ${year}`;
}

/**
 * Generate CSV text for transaction export
 */
export function exportTransactionsToCSV(
  transactions: Transaction[],
  categories: Category[],
  wallets: Wallet[]
): string {
  const catMap = new Map(categories.map(c => [c.id, c.name]));
  const walletMap = new Map(wallets.map(w => [w.id, w.name]));

  const headers = ['ID', 'Tanggal', 'Tipe', 'Kategori', 'Dompet', 'Nominal (Rp)', 'Catatan'];
  const rows = transactions.map(t => [
    t.id,
    t.date,
    t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    `"${(catMap.get(t.categoryId) || 'Lainnya').replace(/"/g, '""')}"`,
    `"${(walletMap.get(t.walletId) || 'Utama').replace(/"/g, '""')}"`,
    t.amount,
    `"${(t.note || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
