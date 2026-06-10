import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  clearFinanceState,
  loadFinanceState,
  saveFinanceState,
} from './financeStorage';
import { buildResetFinanceState, normalizeFinanceState } from '../lib/financeBackup';
import { buildSampleFinanceState } from '../lib/financeStateFixtures';
import { FinanceState, emptyFinanceState } from '../types/finance';

const sampleState = buildSampleFinanceState({ summaryVisibleMonthCount: 6 });

describe('financeStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('loads the reset defaults when storage has no value', async () => {
    await expect(loadFinanceState()).resolves.toEqual(buildResetFinanceState());
  });

  it('saves and loads a normalized finance state', async () => {
    await saveFinanceState(sampleState);

    await expect(loadFinanceState()).resolves.toEqual(sampleState);
  });

  it('clears the saved finance state', async () => {
    await saveFinanceState(sampleState);
    await clearFinanceState();

    await expect(loadFinanceState()).resolves.toEqual(buildResetFinanceState());
  });

  it('normalizes legacy state defaults and rolling window fields', () => {
    const legacyState = {
      ...emptyFinanceState,
      categories: [{ id: 'legacy', name: 'Legado', sortOrder: 0 }],
      paymentStatuses: undefined,
      settings: {
        monthlySalary: 3000,
        visibleMonthCount: 4,
      },
    } as unknown as FinanceState;

    const normalizedState = normalizeFinanceState(legacyState);

    expect(normalizedState).toEqual({
      ...emptyFinanceState,
      categories: [
        {
          id: 'legacy',
          installmentEndDate: undefined,
          name: 'Legado',
          propagation: 'zero',
          sortOrder: 0,
        },
      ],
      paymentStatuses: [],
      settings: {
        ...emptyFinanceState.settings,
        monthlySalary: 3000,
        summaryVisibleMonthCount: 4,
      },
    });
    expect(normalizedState.settings.windowStartMonth).toBeGreaterThanOrEqual(1);
    expect(normalizedState.settings.windowStartMonth).toBeLessThanOrEqual(12);
  });
});
