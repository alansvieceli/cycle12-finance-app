import type { AccountItem, MonthlyPaymentStatus, MonthlyValue } from '../types/finance';
import {
  buildDueReminders,
  DEFAULT_REMINDER_SETTINGS,
  type ReminderSettings,
} from './reminders';

const accountItems: AccountItem[] = [
  { id: 'rent', categoryId: 'cat', name: 'Aluguel', dueDay: 10, sortOrder: 0 },
  { id: 'card', categoryId: 'cat', name: 'Cartão', dueDay: 13, sortOrder: 1 },
];

const monthlyValues: MonthlyValue[] = [
  { accountItemId: 'rent', month: 6, year: 2026, amount: 1500 },
  { accountItemId: 'card', month: 6, year: 2026, amount: 400 },
];

const paymentStatuses: MonthlyPaymentStatus[] = [];

const fromDate = new Date(2026, 5, 1); // 2026-06-01

function withSettings(overrides: Partial<ReminderSettings>): ReminderSettings {
  return { ...DEFAULT_REMINDER_SETTINGS, ...overrides };
}

describe('buildDueReminders', () => {
  it('returns a payload only for days with at least one pending account in the window', () => {
    const result = buildDueReminders(
      accountItems,
      monthlyValues,
      paymentStatuses,
      withSettings({ daysBefore: 0 }),
      fromDate,
    );

    const dates = result.map((r) => r.date.getDate());
    expect(dates).toEqual([10, 13]);
  });

  it('daysBefore = 0 produces a reminder only on the due day itself', () => {
    const result = buildDueReminders(
      accountItems,
      monthlyValues,
      paymentStatuses,
      withSettings({ daysBefore: 0 }),
      fromDate,
    );

    const rentReminder = result.find((r) => r.date.getDate() === 10);
    expect(rentReminder).toBeDefined();
    expect(result.find((r) => r.date.getDate() === 9)).toBeUndefined();
  });

  it('daysBefore = 1 produces a reminder the day before the due date', () => {
    const result = buildDueReminders(
      accountItems,
      monthlyValues,
      paymentStatuses,
      withSettings({ daysBefore: 1 }),
      fromDate,
    );

    const dayBefore = result.find((r) => r.date.getDate() === 9);
    expect(dayBefore).toBeDefined();
    expect(dayBefore?.count).toBe(1);
    expect(dayBefore?.pendingTotal).toBe(1500);
  });

  it('excludes paid accounts from counts and pending totals', () => {
    const paidStatuses: MonthlyPaymentStatus[] = [
      { accountItemId: 'rent', month: 6, year: 2026, isPaid: true },
    ];

    const result = buildDueReminders(
      accountItems,
      monthlyValues,
      paidStatuses,
      withSettings({ daysBefore: 0 }),
      fromDate,
    );

    expect(result.find((r) => r.date.getDate() === 10)).toBeUndefined();
    const cardReminder = result.find((r) => r.date.getDate() === 13);
    expect(cardReminder?.count).toBe(1);
    expect(cardReminder?.pendingTotal).toBe(400);
  });

  it('excludes accounts with no value for the month', () => {
    const sparseValues: MonthlyValue[] = [
      { accountItemId: 'rent', month: 6, year: 2026, amount: 1500 },
    ];

    const result = buildDueReminders(
      accountItems,
      sparseValues,
      paymentStatuses,
      withSettings({ daysBefore: 0 }),
      fromDate,
    );

    expect(result.find((r) => r.date.getDate() === 13)).toBeUndefined();
    expect(result.find((r) => r.date.getDate() === 10)).toBeDefined();
  });

  it('pending total equals the sum of qualifying accounts amounts', () => {
    const sameDayItems: AccountItem[] = [
      { id: 'rent', categoryId: 'cat', name: 'Aluguel', dueDay: 10, sortOrder: 0 },
      { id: 'water', categoryId: 'cat', name: 'Água', dueDay: 10, sortOrder: 1 },
    ];
    const sameDayValues: MonthlyValue[] = [
      { accountItemId: 'rent', month: 6, year: 2026, amount: 1500 },
      { accountItemId: 'water', month: 6, year: 2026, amount: 100 },
    ];

    const result = buildDueReminders(
      sameDayItems,
      sameDayValues,
      paymentStatuses,
      withSettings({ daysBefore: 0 }),
      fromDate,
    );

    const reminder = result.find((r) => r.date.getDate() === 10);
    expect(reminder?.count).toBe(2);
    expect(reminder?.pendingTotal).toBe(1600);
  });

  it('bounds the horizon to 14 days', () => {
    const lateItem: AccountItem[] = [
      { id: 'late', categoryId: 'cat', name: 'Tarde', dueDay: 20, sortOrder: 0 },
    ];
    const lateValue: MonthlyValue[] = [
      { accountItemId: 'late', month: 6, year: 2026, amount: 50 },
    ];

    // fromDate = 2026-06-10 -> day 20 is offset 10, within horizon.
    const withinResult = buildDueReminders(
      lateItem,
      lateValue,
      paymentStatuses,
      withSettings({ daysBefore: 0 }),
      new Date(2026, 5, 10),
    );
    expect(withinResult.find((r) => r.date.getDate() === 20)).toBeDefined();

    // fromDate = 2026-06-15 -> day 20 is offset 5, but day 20 of July (offset 35) must not appear.
    const result = buildDueReminders(
      lateItem,
      lateValue,
      paymentStatuses,
      withSettings({ daysBefore: 0 }),
      new Date(2026, 5, 25),
    );

    expect(result.length).toBeLessThanOrEqual(14);
    for (const r of result) {
      const diffDays = Math.round(
        (r.date.getTime() - new Date(2026, 5, 25).getTime()) / (24 * 60 * 60 * 1000),
      );
      expect(diffDays).toBeLessThan(14);
    }
  });
});
