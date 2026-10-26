import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  parseRupiahInput,
  calculateTotalBalance,
  calculateCashflow,
  calculateBudgetStatus,
  calculateCategoryExpenses,
} from './finance';
import { Category, Transaction, Wallet } from '../types/finance';

test('formatRupiah formats Indonesian currency correctly', () => {
  assert.equal(formatRupiah(2450000), 'Rp2.450.000');
  assert.equal(formatRupiah(0), 'Rp0');
  assert.equal(formatRupiah(-45000), '-Rp45.000');
  assert.equal(formatRupiah(150000, { showPlus: true }), '+Rp150.000');
});

test('parseRupiahInput handles formatted and raw strings', () => {
  assert.equal(parseRupiahInput('Rp2.450.000'), 2450000);
  assert.equal(parseRupiahInput('50000'), 50000);
  assert.equal(parseRupiahInput(''), 0);
  assert.equal(parseRupiahInput('Rp 150.000,00'), 15000000);
});

test('calculateTotalBalance aggregates all wallet balances', () => {
  const wallets: Wallet[] = [
    { id: '1', name: 'Kas Tunai', type: 'cash', balance: 500000, icon: 'Wallet', color: '#16A34A' },
    { id: '2', name: 'BCA', type: 'bank', balance: 3500000, icon: 'CreditCard', color: '#2563EB' },
    { id: '3', name: 'GoPay', type: 'ewallet', balance: 250000, icon: 'Smartphone', color: '#0073AE' },
  ];
  assert.equal(calculateTotalBalance(wallets), 4250000);
});

test('calculateCashflow aggregates income, expense and net savings', () => {
  const transactions: Transaction[] = [
    { id: 't1', type: 'income', amount: 5000000, categoryId: 'c1', walletId: 'w1', date: '2026-10-01', createdAt: 1 },
    { id: 't2', type: 'expense', amount: 150000, categoryId: 'c2', walletId: 'w1', date: '2026-10-02', createdAt: 2 },
    { id: 't3', type: 'expense', amount: 350000, categoryId: 'c3', walletId: 'w1', date: '2026-10-03', createdAt: 3 },
  ];

  const result = calculateCashflow(transactions);
  assert.equal(result.income, 5000000);
  assert.equal(result.expense, 500000);
  assert.equal(result.net, 4500000);
});

test('calculateBudgetStatus assigns correct warning thresholds', () => {
  // Below 75% -> Aman
  const aman = calculateBudgetStatus(500000, 1000000);
  assert.equal(aman.status, 'aman');
  assert.equal(aman.percentage, 50);
  assert.equal(aman.remaining, 500000);

  // 75% to 99% -> Perhatian
  const perhatian = calculateBudgetStatus(800000, 1000000);
  assert.equal(perhatian.status, 'perhatian');
  assert.equal(perhatian.percentage, 80);

  // 100% and above -> Overbudget
  const over = calculateBudgetStatus(1200000, 1000000);
  assert.equal(over.status, 'overbudget');
  assert.equal(over.remaining, 0);
});

test('calculateCategoryExpenses groups and sorts properly', () => {
  const categories: Category[] = [
    { id: 'c1', name: 'Makanan', type: 'expense', icon: 'Utensils', color: '#DC2626' },
    { id: 'c2', name: 'Transport', type: 'expense', icon: 'Car', color: '#2563EB' },
  ];
  const transactions: Transaction[] = [
    { id: 't1', type: 'expense', amount: 100000, categoryId: 'c1', walletId: 'w1', date: '2026-10-10', createdAt: 1 },
    { id: 't2', type: 'expense', amount: 200000, categoryId: 'c1', walletId: 'w1', date: '2026-10-11', createdAt: 2 },
    { id: 't3', type: 'expense', amount: 100000, categoryId: 'c2', walletId: 'w1', date: '2026-10-12', createdAt: 3 },
  ];

  const breakdown = calculateCategoryExpenses(transactions, categories);
  assert.equal(breakdown.length, 2);
  assert.equal(breakdown[0].categoryId, 'c1');
  assert.equal(breakdown[0].amount, 300000);
  assert.equal(breakdown[0].percentage, 75);
  assert.equal(breakdown[1].categoryId, 'c2');
  assert.equal(breakdown[1].amount, 100000);
  assert.equal(breakdown[1].percentage, 25);
});
