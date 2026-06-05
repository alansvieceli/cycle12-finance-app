import {
  buildCurrentMonthCategoryChartData,
  buildMonthlyExpenseChartData,
  buildSurplusShortfallChartData,
} from './chartData';
import { ProjectionMonth } from './financeCalculations';
import { FinanceState } from '../types/finance';

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
    windowStartMonth: 6,
    windowStartYear: 2026,
  },
};

describe('chart data helpers', () => {
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
      { categoryId: 'cards', label: 'Cartões', value: 1000 },
      { categoryId: 'home', label: 'Casa', value: 250 },
    ]);
  });
});
