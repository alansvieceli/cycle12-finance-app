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

export type MonthlyValue = {
  accountItemId: string;
  month: MonthNumber;
  year: number;
  amount: number;
};

export type MonthlyPaymentStatus = {
  accountItemId: string;
  month: MonthNumber;
  year: number;
  isPaid: boolean;
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
};

export type FinanceState = {
  settings: FinanceSettings;
  categories: Category[];
  accountItems: AccountItem[];
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
  monthlyValues: [],
  paymentStatuses: [],
  monthHistory: [],
};
