import AsyncStorage from '@react-native-async-storage/async-storage';

import { buildResetFinanceState, normalizeFinanceState } from '../lib/financeBackup';
import { FinanceState, emptyFinanceState } from '../types/finance';

const FINANCE_STATE_STORAGE_KEY = '@cycle12-finance-app/finance-state/v2';
const SELECTED_PLANNING_ACCOUNT_STORAGE_KEY =
  '@cycle12-finance-app/selected-planning-account-id';

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

export async function loadSelectedPlanningAccountId(): Promise<string | null> {
  return AsyncStorage.getItem(SELECTED_PLANNING_ACCOUNT_STORAGE_KEY);
}

export async function saveSelectedPlanningAccountId(
  accountItemId: string,
): Promise<void> {
  await AsyncStorage.setItem(SELECTED_PLANNING_ACCOUNT_STORAGE_KEY, accountItemId);
}
