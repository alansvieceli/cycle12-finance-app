import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  clearFinanceState,
  loadFinanceState,
  normalizeFinanceState,
  saveFinanceState,
} from './financeStorage';
import { FinanceState, emptyFinanceState } from '../types/finance';

const sampleState: FinanceState = {
  accountItems: [
    {
      categoryId: 'category-fixed',
      dueDay: 10,
      id: 'account-rent',
      name: 'Aluguel',
      sortOrder: 0,
    },
  ],
  categories: [
    {
      id: 'category-fixed',
      name: 'Fixos',
      propagation: 'zero',
      sortOrder: 0,
    },
  ],
  monthHistory: [],
  monthlyValues: [
    {
      accountItemId: 'account-rent',
      amount: 1200,
      month: 6,
      year: 2026,
    },
  ],
  paymentStatuses: [
    {
      accountItemId: 'account-rent',
      isPaid: true,
      month: 6,
      year: 2026,
    },
  ],
  settings: {
    commitmentDangerThreshold: 80,
    commitmentWarningThreshold: 60,
    currentMonthExtraBalance: 250,
    monthlySalary: 5000,
    summaryVisibleMonthCount: 6,
    windowStartMonth: 6,
    windowStartYear: 2026,
  },
};

describe('financeStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('loads the empty finance state when storage has no value', async () => {
    await expect(loadFinanceState()).resolves.toEqual(emptyFinanceState);
  });

  it('saves and loads a normalized finance state', async () => {
    await saveFinanceState(sampleState);

    await expect(loadFinanceState()).resolves.toEqual(sampleState);
  });

  it('clears the saved finance state', async () => {
    await saveFinanceState(sampleState);
    await clearFinanceState();

    await expect(loadFinanceState()).resolves.toEqual(emptyFinanceState);
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
