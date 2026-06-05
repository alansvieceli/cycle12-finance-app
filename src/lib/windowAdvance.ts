import {
  AccountItem,
  Category,
  FinanceState,
  MonthNumber,
  MonthlyValue,
} from '../types/finance';

type MonthReference = {
  year: number;
  month: MonthNumber;
};

const WINDOW_MONTH_COUNT = 12;

export function shouldAdvanceWindow(
  windowStartYear: number,
  windowStartMonth: MonthNumber,
  nowYear: number,
  nowMonth: MonthNumber,
): boolean {
  return (
    toMonthIndex({ year: nowYear, month: nowMonth }) >
    toMonthIndex({ year: windowStartYear, month: windowStartMonth })
  );
}

export function advanceWindow(
  state: FinanceState,
  nowYear: number,
  nowMonth: MonthNumber,
): FinanceState {
  if (
    !shouldAdvanceWindow(
      state.settings.windowStartYear,
      state.settings.windowStartMonth,
      nowYear,
      nowMonth,
    )
  ) {
    return state;
  }

  return advanceWindow(advanceWindowOneStep(state), nowYear, nowMonth);
}

export function getNextWindowStart(state: FinanceState): MonthReference {
  return addMonths(
    {
      year: state.settings.windowStartYear,
      month: state.settings.windowStartMonth,
    },
    1,
  );
}

function advanceWindowOneStep(state: FinanceState): FinanceState {
  const oldestMonth = {
    year: state.settings.windowStartYear,
    month: state.settings.windowStartMonth,
  };
  const nextWindowStart = addMonths(oldestMonth, 1);
  const newTrailingMonth = addMonths(oldestMonth, WINDOW_MONTH_COUNT);
  const monthlyValuesWithoutOldest = state.monthlyValues.filter(
    (monthlyValue) => !isSameMonth(monthlyValue, oldestMonth),
  );

  return {
    ...state,
    monthlyValues: [
      ...monthlyValuesWithoutOldest,
      ...buildTrailingMonthValues(
        state.categories,
        state.accountItems,
        monthlyValuesWithoutOldest,
        newTrailingMonth,
      ),
    ],
    paymentStatuses: state.paymentStatuses.filter(
      (paymentStatus) => !isSameMonth(paymentStatus, oldestMonth),
    ),
    settings: {
      ...state.settings,
      windowStartYear: nextWindowStart.year,
      windowStartMonth: nextWindowStart.month,
    },
  };
}

function buildTrailingMonthValues(
  categories: Category[],
  accountItems: AccountItem[],
  monthlyValues: MonthlyValue[],
  newTrailingMonth: MonthReference,
): MonthlyValue[] {
  return accountItems.map((accountItem) => {
    const category = categories.find(
      (currentCategory) => currentCategory.id === accountItem.categoryId,
    );

    return {
      accountItemId: accountItem.id,
      amount: getPropagatedAmount(
        category,
        accountItem.id,
        monthlyValues,
        newTrailingMonth,
      ),
      month: newTrailingMonth.month,
      year: newTrailingMonth.year,
    };
  });
}

function getPropagatedAmount(
  category: Category | undefined,
  accountItemId: string,
  monthlyValues: MonthlyValue[],
  newTrailingMonth: MonthReference,
): number {
  if (!category || category.propagation === 'zero') {
    return 0;
  }

  if (
    category.propagation === 'installment' &&
    isAfterInstallmentEndDate(newTrailingMonth, category.installmentEndDate)
  ) {
    return 0;
  }

  return getMostRecentAccountAmount(accountItemId, monthlyValues);
}

function getMostRecentAccountAmount(
  accountItemId: string,
  monthlyValues: MonthlyValue[],
): number {
  const mostRecentValue = monthlyValues
    .filter((monthlyValue) => monthlyValue.accountItemId === accountItemId)
    .sort((left, right) => toMonthIndex(right) - toMonthIndex(left))[0];

  return mostRecentValue?.amount ?? 0;
}

function isAfterInstallmentEndDate(
  monthReference: MonthReference,
  installmentEndDate: string | undefined,
): boolean {
  if (!installmentEndDate) {
    return true;
  }

  const [yearText, monthText] = installmentEndDate.split('-');
  const year = Number(yearText);
  const month = Number(monthText);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return true;
  }

  return (
    toMonthIndex(monthReference) >
    toMonthIndex({
      year,
      month: month as MonthNumber,
    })
  );
}

function addMonths(
  monthReference: MonthReference,
  monthsToAdd: number,
): MonthReference {
  const date = new Date(monthReference.year, monthReference.month - 1 + monthsToAdd, 1);

  return {
    year: date.getFullYear(),
    month: (date.getMonth() + 1) as MonthNumber,
  };
}

function isSameMonth(
  value: Pick<MonthReference, 'month' | 'year'>,
  monthReference: MonthReference,
): boolean {
  return value.month === monthReference.month && value.year === monthReference.year;
}

function toMonthIndex(monthReference: Pick<MonthReference, 'month' | 'year'>): number {
  return monthReference.year * 12 + monthReference.month;
}
