import type { FinanceState } from '../types/finance';
import {
  buildCurrentMonthCategoryChartData,
  buildMonthlyCommitmentChartData,
  buildMonthlyExpenseChartData,
  buildSurplusShortfallChartData,
  calculateBalanceTotal,
  calculateNegativeBalanceTotal,
} from './chartData';
import type { ProjectionMonth } from './financeCalculations';

const projectionMonths: ProjectionMonth[] = [
  { isCurrentMonth: true, key: '2026-06', month: 6, year: 2026 },
  { isCurrentMonth: false, key: '2026-07', month: 7, year: 2026 },
];

const financeState: FinanceState = {
  accountItems: [
    {
      categoryId: 'cards',
      dueDay: 8,
      id: 'nubank',
      name: 'Nubank',
      sortOrder: 0,
    },
    {
      categoryId: 'home',
      dueDay: 10,
      id: 'power',
      name: 'Luz',
      sortOrder: 0,
    },
  ],
  categories: [
    { id: 'home', name: 'Casa', propagation: 'zero', sortOrder: 2 },
    { id: 'cards', name: 'Cartões', propagation: 'zero', sortOrder: 1 },
    { id: 'empty', name: 'Vazia', propagation: 'zero', sortOrder: 3 },
  ],
  monthHistory: [],
  monthlyValues: [
    { accountItemId: 'nubank', amount: 1000, month: 6, year: 2026 },
    { accountItemId: 'power', amount: 250, month: 6, year: 2026 },
    { accountItemId: 'nubank', amount: 800, month: 7, year: 2026 },
  ],
  paymentStatuses: [],
  settings: {
    currentMonthExtraBalance: 500,
    monthlySalary: 3000,
    summaryVisibleMonthCount: 2,
    commitmentWarningThreshold: 80,
    commitmentDangerThreshold: 90,
    commitmentGoal: 70,
    windowStartMonth: 6,
    windowStartYear: 2026,
  },
};

describe('buildMonthlyCommitmentChartData', () => {
  it('returns empty array when no projection months', () => {
    expect(buildMonthlyCommitmentChartData(financeState, [])).toEqual([]);
  });

  it('returns null percentage when salary and extra balance are zero', () => {
    const noSalary: FinanceState = {
      ...financeState,
      settings: {
        ...financeState.settings,
        monthlySalary: 0,
        currentMonthExtraBalance: 0,
      },
    };
    const result = buildMonthlyCommitmentChartData(noSalary, projectionMonths);
    expect(result[0].percentage).toBeNull();
    expect(result[1].percentage).toBeNull();
  });

  it('returns correct percentage and commitmentLow color when below warning threshold', () => {
    // Jun: 3500 available (3000 salary + 500 extra), 1250 expenses → ≈35.7% → below 80% → commitmentLow
    const result = buildMonthlyCommitmentChartData(financeState, projectionMonths);
    expect(result[0].key).toBe('2026-06');
    expect(result[0].label).toBe('Jun');
    expect(result[0].percentage).toBeCloseTo(1250 / 3500, 5);
    expect(result[0].color).toBe('#F5F7FA'); // colors.commitmentLow
  });

  it('uses base salary only (no extra) for non-current months', () => {
    // Jul: 3000 available (no extra), 800 expenses → ≈26.7% → below 80% → commitmentLow
    const result = buildMonthlyCommitmentChartData(financeState, projectionMonths);
    expect(result[1].key).toBe('2026-07');
    expect(result[1].label).toBe('Jul');
    expect(result[1].percentage).toBeCloseTo(800 / 3000, 5);
    expect(result[1].color).toBe('#F5F7FA');
  });

  it('uses commitmentMedium color when percentage exceeds warning threshold', () => {
    // Jun: 3500 available, 2600+250=2850 expenses → ≈81.4% → above 80% warning
    const highExpenses: FinanceState = {
      ...financeState,
      monthlyValues: [
        { accountItemId: 'nubank', amount: 2600, month: 6, year: 2026 },
        { accountItemId: 'power', amount: 250, month: 6, year: 2026 },
      ],
    };
    const result = buildMonthlyCommitmentChartData(highExpenses, projectionMonths);
    expect(result[0].color).toBe('#FFC845'); // colors.commitmentMedium
  });

  it('uses commitmentHigh color when percentage exceeds danger threshold', () => {
    // Jun: 3500 available, 3000+250=3250 expenses → ≈92.9% → above 90% danger
    const dangerExpenses: FinanceState = {
      ...financeState,
      monthlyValues: [
        { accountItemId: 'nubank', amount: 3000, month: 6, year: 2026 },
        { accountItemId: 'power', amount: 250, month: 6, year: 2026 },
      ],
    };
    const result = buildMonthlyCommitmentChartData(dangerExpenses, projectionMonths);
    expect(result[0].color).toBe('#FF5D6C'); // colors.commitmentHigh
  });
});

describe('chart data helpers', () => {
  it('adds every monthly balance for the period total', () => {
    expect(
      calculateBalanceTotal([
        { key: '2026-08', label: 'Ago', value: -10 },
        { key: '2026-09', label: 'Set', value: -45 },
        { key: '2026-10', label: 'Out', value: 40 },
        { key: '2026-11', label: 'Nov', value: 60 },
      ]),
    ).toBe(45);
  });

  it('adds only negative monthly balances', () => {
    expect(
      calculateNegativeBalanceTotal([
        { key: '2026-08', label: 'Ago', value: -10 },
        { key: '2026-09', label: 'Set', value: -45 },
        { key: '2026-10', label: 'Out', value: 40 },
        { key: '2026-11', label: 'Nov', value: 60 },
        { key: '2026-12', label: 'Dez', value: 0 },
      ]),
    ).toBe(-55);
  });

  it('builds monthly expense chart data', () => {
    expect(buildMonthlyExpenseChartData(financeState, projectionMonths)).toEqual([
      { key: '2026-06', label: 'Jun', value: 1250 },
      { key: '2026-07', label: 'Jul', value: 800 },
    ]);
  });

  it('builds surplus or shortfall chart data using current-month extra balance', () => {
    expect(buildSurplusShortfallChartData(financeState, projectionMonths)).toEqual([
      { key: '2026-06', label: 'Jun', value: 2250 },
      { key: '2026-07', label: 'Jul', value: 2200 },
    ]);
  });

  it('builds current-month category chart data and hides zero categories', () => {
    expect(
      buildCurrentMonthCategoryChartData(financeState, projectionMonths[0]),
    ).toEqual([
      { categoryId: 'cards', color: '#9B59B6', label: 'Cartões', value: 1000 },
      { categoryId: 'home', color: '#32D078', label: 'Casa', value: 250 },
    ]);
  });
});
