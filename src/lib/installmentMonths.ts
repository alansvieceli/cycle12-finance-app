import { MonthNumber } from '../types/finance';

type InstallmentMonth = {
  year: number;
  month: MonthNumber;
};

const MONTHS_IN_WINDOW = 12;

export function buildInstallmentMonths(
  startYear: number,
  startMonth: MonthNumber,
  installments: number,
  windowStartYear: number,
  windowStartMonth: MonthNumber,
): InstallmentMonth[] {
  const safeInstallments = Math.max(0, Math.floor(installments));

  if (safeInstallments < 1) {
    return [];
  }

  const startOffset = getMonthOffset(
    windowStartYear,
    windowStartMonth,
    startYear,
    startMonth,
  );

  if (startOffset < 0 || startOffset >= MONTHS_IN_WINDOW) {
    return [];
  }

  return Array.from({ length: safeInstallments }, (_, index) =>
    addMonths(startYear, startMonth, index),
  ).filter((targetMonth) => {
    const targetOffset = getMonthOffset(
      windowStartYear,
      windowStartMonth,
      targetMonth.year,
      targetMonth.month,
    );

    return targetOffset >= 0 && targetOffset < MONTHS_IN_WINDOW;
  });
}

function getMonthOffset(
  originYear: number,
  originMonth: MonthNumber,
  targetYear: number,
  targetMonth: MonthNumber,
) {
  return (targetYear - originYear) * 12 + targetMonth - originMonth;
}

function addMonths(year: number, month: MonthNumber, offset: number): InstallmentMonth {
  const monthIndex = month - 1 + offset;
  const nextDate = new Date(year, monthIndex, 1);

  return {
    year: nextDate.getFullYear(),
    month: (nextDate.getMonth() + 1) as MonthNumber,
  };
}
