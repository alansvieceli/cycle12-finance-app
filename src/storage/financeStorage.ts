import AsyncStorage from '@react-native-async-storage/async-storage';

import { FinanceState, emptyFinanceState } from '../types/finance';

const FINANCE_STATE_STORAGE_KEY = '@cycle12-finance-app/finance-state/v2';

export async function loadFinanceState(): Promise<FinanceState> {
  const storedValue = await AsyncStorage.getItem(FINANCE_STATE_STORAGE_KEY);

  if (!storedValue) {
    return emptyFinanceState;
  }

  return normalizeFinanceState({
    ...emptyFinanceState,
    ...JSON.parse(storedValue),
  });
}

export async function saveFinanceState(financeState: FinanceState): Promise<void> {
  await AsyncStorage.setItem(
    FINANCE_STATE_STORAGE_KEY,
    JSON.stringify(financeState),
  );
}

export async function clearFinanceState(): Promise<void> {
  await AsyncStorage.removeItem(FINANCE_STATE_STORAGE_KEY);
}

function normalizeFinanceState(financeState: FinanceState): FinanceState {
  return {
    ...financeState,
    settings: {
      ...emptyFinanceState.settings,
      ...financeState.settings,
      visibleMonthCount: clampVisibleMonthCount(
        financeState.settings.visibleMonthCount,
      ),
    },
  };
}

function clampVisibleMonthCount(value: number | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 12;
  }

  return Math.max(1, Math.min(12, Math.round(value)));
}
