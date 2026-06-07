import AsyncStorage from '@react-native-async-storage/async-storage';

import { clampVisibleMonthCount } from '../lib/inputParsers';
import { buildResetFinanceState } from '../lib/financeBackup';
import {
  Category,
  CategoryPropagation,
  FinanceSettings,
  FinanceState,
  MonthNumber,
  createDefaultFinanceSettings,
  emptyFinanceState,
} from '../types/finance';

const FINANCE_STATE_STORAGE_KEY = '@cycle12-finance-app/finance-state/v2';

export async function loadFinanceState(): Promise<FinanceState> {
  const storedValue = await AsyncStorage.getItem(FINANCE_STATE_STORAGE_KEY);

  if (!storedValue) {
    return buildResetFinanceState();
  }

  return normalizeFinanceState({
    ...emptyFinanceState,
    ...JSON.parse(storedValue),
  });
}

export async function saveFinanceState(financeState: FinanceState): Promise<void> {
  await AsyncStorage.setItem(FINANCE_STATE_STORAGE_KEY, JSON.stringify(financeState));
}

export async function clearFinanceState(): Promise<void> {
  await AsyncStorage.removeItem(FINANCE_STATE_STORAGE_KEY);
}

export function normalizeFinanceState(financeState: FinanceState): FinanceState {
  return {
    ...financeState,
    categories: financeState.categories.map(normalizeCategory),
    monthHistory: Array.isArray(financeState.monthHistory)
      ? financeState.monthHistory
      : [],
    paymentStatuses: financeState.paymentStatuses ?? [],
    settings: normalizeSettings(financeState.settings),
  };
}

function normalizeCategory(category: Category): Category {
  const propagation = normalizePropagation(category.propagation);

  return {
    ...category,
    propagation,
    installmentEndDate:
      propagation === 'installment' && typeof category.installmentEndDate === 'string'
        ? category.installmentEndDate
        : undefined,
  };
}

function normalizePropagation(
  propagation: CategoryPropagation | undefined,
): CategoryPropagation {
  return propagation === 'fixed' || propagation === 'installment'
    ? propagation
    : 'zero';
}

function normalizeSettings(
  settings: (Partial<FinanceSettings> & { visibleMonthCount?: number }) | undefined,
): FinanceSettings {
  const defaultSettings = createDefaultFinanceSettings();
  const summaryVisibleMonthCount =
    settings?.summaryVisibleMonthCount ?? settings?.visibleMonthCount;
  const { visibleMonthCount: _visibleMonthCount, ...currentSettings } = settings ?? {};

  return {
    ...defaultSettings,
    ...currentSettings,
    summaryVisibleMonthCount: clampVisibleMonthCount(summaryVisibleMonthCount),
    windowStartYear: normalizeYear(settings?.windowStartYear, defaultSettings),
    windowStartMonth: normalizeMonth(settings?.windowStartMonth, defaultSettings),
  };
}

function normalizeYear(
  year: number | undefined,
  defaultSettings: FinanceSettings,
): number {
  return typeof year === 'number' && Number.isFinite(year)
    ? Math.round(year)
    : defaultSettings.windowStartYear;
}

function normalizeMonth(
  month: MonthNumber | undefined,
  defaultSettings: FinanceSettings,
): MonthNumber {
  return typeof month === 'number' &&
    Number.isInteger(month) &&
    month >= 1 &&
    month <= 12
    ? month
    : defaultSettings.windowStartMonth;
}
