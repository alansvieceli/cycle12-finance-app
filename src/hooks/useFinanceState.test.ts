import { emptyFinanceState } from '../types/finance';
import {
  buildAccountItemWithValueState,
  replaceMonthlyValuesForAccount,
} from './useFinanceState';

const baseState = {
  ...emptyFinanceState,
  categories: [
    { id: 'cat-1', name: 'Moradia', sortOrder: 0, propagation: 'zero' as const },
  ],
};

const projectionMonth = { month: 6 as const, year: 2026 };

describe('buildAccountItemWithValueState', () => {
  it('adds a new account item to state', () => {
    const result = buildAccountItemWithValueState(
      baseState,
      'acc-1',
      'Aluguel',
      'cat-1',
      5,
      projectionMonth,
      0,
    );
    expect(result.accountItems).toHaveLength(1);
    expect(result.accountItems[0]).toMatchObject({
      id: 'acc-1',
      name: 'Aluguel',
      categoryId: 'cat-1',
      dueDay: 5,
      sortOrder: 0,
    });
  });

  it('trims whitespace from name', () => {
    const result = buildAccountItemWithValueState(
      baseState,
      'acc-1',
      '  Internet  ',
      'cat-1',
      10,
      projectionMonth,
      0,
    );
    expect(result.accountItems[0].name).toBe('Internet');
  });

  it('adds a monthly value when amount > 0', () => {
    const result = buildAccountItemWithValueState(
      baseState,
      'acc-1',
      'Aluguel',
      'cat-1',
      5,
      projectionMonth,
      1200,
    );
    expect(result.monthlyValues).toHaveLength(1);
    expect(result.monthlyValues[0]).toMatchObject({
      accountItemId: 'acc-1',
      month: 6,
      year: 2026,
      amount: 1200,
    });
  });

  it('does not add a monthly value when amount is 0', () => {
    const result = buildAccountItemWithValueState(
      baseState,
      'acc-1',
      'Aluguel',
      'cat-1',
      5,
      projectionMonth,
      0,
    );
    expect(result.monthlyValues).toHaveLength(0);
  });

  it('preserves existing account items and monthly values', () => {
    const stateWithExisting = {
      ...baseState,
      accountItems: [
        {
          id: 'acc-existing',
          name: 'Existente',
          categoryId: 'cat-1',
          dueDay: 1,
          sortOrder: 0,
        },
      ],
      monthlyValues: [
        { accountItemId: 'acc-existing', month: 6 as const, year: 2026, amount: 500 },
      ],
    };
    const result = buildAccountItemWithValueState(
      stateWithExisting,
      'acc-new',
      'Nova',
      'cat-1',
      15,
      projectionMonth,
      200,
    );
    expect(result.accountItems).toHaveLength(2);
    expect(result.monthlyValues).toHaveLength(2);
  });
});

describe('replaceMonthlyValuesForAccount', () => {
  const stateWithMonthlyValues = {
    ...baseState,
    accountItems: [
      {
        categoryId: 'cat-1',
        dueDay: 5,
        id: 'acc-1',
        name: 'Aluguel',
        sortOrder: 0,
      },
      {
        categoryId: 'cat-1',
        dueDay: 10,
        id: 'acc-2',
        name: 'Internet',
        sortOrder: 1,
      },
    ],
    monthlyValues: [
      { accountItemId: 'acc-1', amount: 100, month: 6 as const, year: 2026 },
      { accountItemId: 'acc-1', amount: 200, month: 7 as const, year: 2026 },
      { accountItemId: 'acc-1', amount: 300, month: 8 as const, year: 2026 },
      { accountItemId: 'acc-2', amount: 50, month: 6 as const, year: 2026 },
    ],
    paymentStatuses: [
      {
        accountItemId: 'acc-1',
        isPaid: false,
        isReviewed: true,
        month: 6 as const,
        year: 2026,
      },
    ],
  };

  it('replaces supplied months and creates missing values for one account', () => {
    const result = replaceMonthlyValuesForAccount(stateWithMonthlyValues, 'acc-1', [
      { amount: 125, month: 6, year: 2026 },
      { amount: 0, month: 7, year: 2026 },
      { amount: 450, month: 9, year: 2026 },
    ]);

    expect(result.monthlyValues).toEqual(
      expect.arrayContaining([
        { accountItemId: 'acc-1', amount: 125, month: 6, year: 2026 },
        { accountItemId: 'acc-1', amount: 0, month: 7, year: 2026 },
        { accountItemId: 'acc-1', amount: 300, month: 8, year: 2026 },
        { accountItemId: 'acc-1', amount: 450, month: 9, year: 2026 },
      ]),
    );
  });

  it('leaves other accounts, unsupplied months, and review marks untouched', () => {
    const result = replaceMonthlyValuesForAccount(stateWithMonthlyValues, 'acc-1', [
      { amount: 125, month: 6, year: 2026 },
    ]);

    expect(result.monthlyValues).toContainEqual({
      accountItemId: 'acc-1',
      amount: 200,
      month: 7,
      year: 2026,
    });
    expect(result.monthlyValues).toContainEqual({
      accountItemId: 'acc-2',
      amount: 50,
      month: 6,
      year: 2026,
    });
    expect(result.paymentStatuses).toBe(stateWithMonthlyValues.paymentStatuses);
  });
});
