export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type CategoryPropagation = 'fixed' | 'zero' | 'installment';

export type FinanceSettings = {
  monthlySalary: number;
  currentMonthExtraBalance: number;
  summaryVisibleMonthCount: number;
  commitmentWarningThreshold: number;
  commitmentDangerThreshold: number;
  commitmentGoal: number;
  windowStartYear: number;
  windowStartMonth: MonthNumber;
};

export type Category = {
  id: string;
  name: string;
  sortOrder: number;
  propagation: CategoryPropagation;
  installmentEndDate?: string;
  color?: string;
};

export type AccountItem = {
  id: string;
  categoryId: string;
  name: string;
  dueDay: number;
  sortOrder: number;
};

/**
 * A recurring subscription with a fixed monthly cost.
 *
 * It has no due day, no per-month value, and no payment status on purpose: that
 * absence is what keeps subscriptions out of the payment, reminder, and
 * projection flows. The money is already counted in the account the
 * subscription is charged to, so this is an informational view, never a second
 * source of expense.
 */
export type Subscription = {
  id: string;
  name: string;
  amount: number;
  color?: string;
};

export type MonthlyValue = {
  accountItemId: string;
  month: MonthNumber;
  year: number;
  amount: number;
};

/** Monthly status of an account: whether it was paid and whether its value was reviewed. */
export type MonthlyPaymentStatus = {
  accountItemId: string;
  month: MonthNumber;
  year: number;
  isPaid: boolean;
  isReviewed?: boolean;
};

export type MonthHistoryEntry = {
  month: MonthNumber;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  categories: {
    id: string;
    name: string;
    color?: string;
    sortOrder?: number;
    total: number;
  }[];
  accounts: {
    id: string;
    name: string;
    categoryId: string;
    dueDay?: number;
    amount: number;
  }[];
  /** Optional so entries recorded before subscriptions existed keep parsing. */
  subscriptionsTotal?: number;
  subscriptions?: { id: string; name: string; amount: number }[];
};

export type FinanceState = {
  settings: FinanceSettings;
  categories: Category[];
  accountItems: AccountItem[];
  subscriptions: Subscription[];
  monthlyValues: MonthlyValue[];
  paymentStatuses: MonthlyPaymentStatus[];
  monthHistory: MonthHistoryEntry[];
};

export function createDefaultFinanceSettings(date = new Date()): FinanceSettings {
  return {
    monthlySalary: 0,
    currentMonthExtraBalance: 0,
    summaryVisibleMonthCount: 12,
    windowStartYear: date.getFullYear(),
    windowStartMonth: (date.getMonth() + 1) as MonthNumber,
    commitmentWarningThreshold: 70,
    commitmentDangerThreshold: 90,
    commitmentGoal: 70,
  };
}

export const emptyFinanceState: FinanceState = {
  settings: {
    ...createDefaultFinanceSettings(),
  },
  categories: [],
  accountItems: [],
  subscriptions: [],
  monthlyValues: [],
  paymentStatuses: [],
  monthHistory: [],
};
