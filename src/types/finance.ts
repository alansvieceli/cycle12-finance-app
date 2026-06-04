export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type FinanceSettings = {
  monthlySalary: number;
  currentMonthExtraBalance: number;
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

export type FinanceState = {
  settings: FinanceSettings;
  categories: Category[];
  accountItems: AccountItem[];
  monthlyValues: MonthlyValue[];
};

export const emptyFinanceState: FinanceState = {
  settings: {
    monthlySalary: 0,
    currentMonthExtraBalance: 0,
  },
  categories: [],
  accountItems: [],
  monthlyValues: [],
};
