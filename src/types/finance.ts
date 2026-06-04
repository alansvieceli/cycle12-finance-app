export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type FinanceSettings = {
  monthlySalary: number;
  currentMonthExtraBalance: number;
  visibleMonthCount: number;
  commitmentWarningThreshold: number;
  commitmentDangerThreshold: number;
};

export type Category = {
  id: string;
  name: string;
  sortOrder: number;
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

export type FinanceState = {
  settings: FinanceSettings;
  categories: Category[];
  accountItems: AccountItem[];
  monthlyValues: MonthlyValue[];
  paymentStatuses: MonthlyPaymentStatus[];
};

export const emptyFinanceState: FinanceState = {
  settings: {
    monthlySalary: 0,
    currentMonthExtraBalance: 0,
    visibleMonthCount: 12,
    commitmentWarningThreshold: 80,
    commitmentDangerThreshold: 90,
  },
  categories: [],
  accountItems: [],
  monthlyValues: [],
  paymentStatuses: [],
};
