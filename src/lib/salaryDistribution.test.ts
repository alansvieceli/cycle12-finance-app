import { buildSalaryDistribution } from './salaryDistribution';
import { ProjectionMonth } from './financeCalculations';
import { FinanceState } from '../types/finance';

const projectionMonths: ProjectionMonth[] = [
  { isCurrentMonth: true, key: '2026-06', month: 6, year: 2026 },
  { isCurrentMonth: false, key: '2026-07', month: 7, year: 2026 },
];

const financeState: FinanceState = {
  accountItems: [
    { categoryId: 'rent', dueDay: 5, id: 'rent-item', name: 'Aluguel', sortOrder: 0 },
    { categoryId: 'cards', dueDay: 10, id: 'card-item', name: 'Cartão', sortOrder: 0 },
    { categoryId: 'subs', dueDay: 15, id: 'sub-item', name: 'Streaming', sortOrder: 0 },
  ],
  categories: [
    {
      color: '#111111',
      id: 'rent',
      name: 'Aluguel',
      propagation: 'zero',
      sortOrder: 1,
    },
    { id: 'cards', name: 'Cartões', propagation: 'zero', sortOrder: 2 },
    { id: 'subs', name: 'Assinaturas', propagation: 'zero', sortOrder: 3 },
    { id: 'empty', name: 'Vazia', propagation: 'zero', sortOrder: 4 },
  ],
  monthHistory: [],
  monthlyValues: [
    { accountItemId: 'rent-item', amount: 1500, month: 6, year: 2026 },
    { accountItemId: 'card-item', amount: 400, month: 6, year: 2026 },
    { accountItemId: 'sub-item', amount: 100, month: 6, year: 2026 },
  ],
  paymentStatuses: [],
  settings: {
    currentMonthExtraBalance: 500,
    monthlySalary: 3000,
    summaryVisibleMonthCount: 2,
    commitmentWarningThreshold: 80,
    commitmentDangerThreshold: 90,
    windowStartMonth: 6,
    windowStartYear: 2026,
  },
};

describe('buildSalaryDistribution', () => {
  it('sums segment shares plus leftover share to 1 in the normal case', () => {
    const result = buildSalaryDistribution(financeState, projectionMonths[0]);

    expect(result.isOverBudget).toBe(false);
    expect(result.availableIncome).toBe(3500);
    expect(result.totalExpenses).toBe(2000);
    expect(result.leftover).toBe(1500);

    const totalShare =
      result.segments.reduce((sum, segment) => sum + segment.share, 0) +
      result.leftoverShare;
    expect(totalShare).toBeCloseTo(1, 5);
  });

  it('zeroes leftover and sums segment shares to 1 against totalExpenses when over budget', () => {
    const overBudgetState: FinanceState = {
      ...financeState,
      settings: {
        ...financeState.settings,
        monthlySalary: 1000,
        currentMonthExtraBalance: 0,
      },
    };

    const result = buildSalaryDistribution(overBudgetState, projectionMonths[0]);

    expect(result.isOverBudget).toBe(true);
    expect(result.availableIncome).toBe(1000);
    expect(result.denominator).toBe(2000);
    expect(result.leftover).toBe(0);
    expect(result.leftoverShare).toBe(0);

    const totalShare = result.segments.reduce((sum, segment) => sum + segment.share, 0);
    expect(totalShare).toBeCloseTo(1, 5);
  });

  it('returns hasSalary false and a safe structure when available income is 0', () => {
    const noSalaryState: FinanceState = {
      ...financeState,
      settings: {
        ...financeState.settings,
        monthlySalary: 0,
        currentMonthExtraBalance: 0,
      },
    };

    const result = buildSalaryDistribution(noSalaryState, projectionMonths[0]);

    expect(result.hasSalary).toBe(false);
    expect(result.availableIncome).toBe(0);
    expect(result.leftover).toBe(0);
    expect(result.leftoverShare).toBe(0);
    expect(Number.isNaN(result.segments[0]?.share)).toBe(false);
  });

  it('only includes categories with value > 0, sorted descending by value', () => {
    const result = buildSalaryDistribution(financeState, projectionMonths[0]);

    expect(result.segments.map((segment) => segment.categoryId)).toEqual([
      'rent',
      'cards',
      'subs',
    ]);
    expect(result.segments.every((segment) => segment.value > 0)).toBe(true);
  });

  it('counts segments with share below 8% in tailGroupedCount', () => {
    const result = buildSalaryDistribution(financeState, projectionMonths[0]);

    // subs: 100 / 3500 ≈ 2.9% < 8%; rent and cards are above 8%.
    expect(result.tailGroupedCount).toBe(1);
  });

  it('resolves segment colors via getCategoryColor (explicit color or palette fallback)', () => {
    const result = buildSalaryDistribution(financeState, projectionMonths[0]);

    expect(result.segments.find((s) => s.categoryId === 'rent')?.color).toBe('#111111');
    expect(result.segments.find((s) => s.categoryId === 'cards')?.color).toBe(
      '#32D078',
    );
  });

  it('includes the current-month extra balance, while other months use salary only', () => {
    const current = buildSalaryDistribution(financeState, projectionMonths[0]);
    const other = buildSalaryDistribution(financeState, projectionMonths[1]);

    expect(current.availableIncome).toBe(3500);
    expect(other.availableIncome).toBe(3000);
  });
});
