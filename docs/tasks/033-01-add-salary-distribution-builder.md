# Task 033-01 - Add Salary Distribution Builder

Status: Pending

## Spec

`docs/specs/033-salary-distribution-panel.md`

## Plan

`docs/plans/033-salary-distribution-panel-plan.md`

## Goal

Add a pure `buildSalaryDistribution(financeState, projectionMonth)` helper in `src/lib/salaryDistribution.ts` that derives the "Onde vai o salário" stacked-bar data (segments, leftover, over-budget flag), reusing existing finance calculation helpers. Add unit tests covering the rules from the plan.

## Files

- Create: `src/lib/salaryDistribution.ts`
- Create: `src/lib/salaryDistribution.test.ts`

## Steps

1. Create `src/lib/salaryDistribution.ts`:

```ts
import {
  calculateAvailableIncome,
  calculateCategoryTotals,
  calculateMonthlyTotalExpenses,
  ProjectionMonth,
} from './financeCalculations';
import { getCategoryColor } from './categoryColors';
import { sortCategories } from './sorting';
import { FinanceState } from '../types/finance';

const TAIL_SHARE_THRESHOLD = 0.08;

export type SalaryDistributionSegment = {
  categoryId: string;
  color: string;
  label: string;
  value: number;
  share: number;
};

export type SalaryDistribution = {
  availableIncome: number;
  totalExpenses: number;
  isOverBudget: boolean;
  hasSalary: boolean;
  denominator: number;
  leftover: number;
  leftoverShare: number;
  segments: SalaryDistributionSegment[];
  tailGroupedCount: number;
};

export function buildSalaryDistribution(
  financeState: FinanceState,
  projectionMonth: ProjectionMonth,
): SalaryDistribution {
  const sortedCategories = sortCategories(financeState.categories);
  const categoryNamesById = Object.fromEntries(
    sortedCategories.map((category) => [category.id, category.name]),
  );

  const availableIncome = calculateAvailableIncome(
    financeState.settings,
    projectionMonth,
  );
  const totalExpenses = calculateMonthlyTotalExpenses(
    sortedCategories,
    financeState.accountItems,
    financeState.monthlyValues,
    projectionMonth,
  );
  const isOverBudget = totalExpenses > availableIncome;
  const denominator = isOverBudget ? totalExpenses : availableIncome;
  const leftover = Math.max(availableIncome - totalExpenses, 0);
  const leftoverShare = !isOverBudget && denominator > 0 ? leftover / denominator : 0;

  const segments: SalaryDistributionSegment[] = calculateCategoryTotals(
    sortedCategories,
    financeState.accountItems,
    financeState.monthlyValues,
    projectionMonth,
  )
    .filter((categoryTotal) => categoryTotal.total > 0)
    .map((categoryTotal) => ({
      categoryId: categoryTotal.categoryId,
      color: getCategoryColor(categoryTotal.categoryId, sortedCategories),
      label: categoryNamesById[categoryTotal.categoryId] ?? '-',
      value: categoryTotal.total,
      share: denominator > 0 ? categoryTotal.total / denominator : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const tailGroupedCount = segments.filter(
    (segment) => segment.share < TAIL_SHARE_THRESHOLD,
  ).length;

  return {
    availableIncome,
    totalExpenses,
    isOverBudget,
    hasSalary: availableIncome > 0,
    denominator,
    leftover,
    leftoverShare,
    segments,
    tailGroupedCount,
  };
}
```

2. Create `src/lib/salaryDistribution.test.ts`:

```ts
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
```

3. Run `npm test -- salaryDistribution` and confirm all tests pass.

4. Run `npx tsc --noEmit` and confirm no type errors.

## Acceptance Criteria

- `buildSalaryDistribution` is a pure function reusing `calculateAvailableIncome`, `calculateCategoryTotals`, `calculateMonthlyTotalExpenses`, `sortCategories`, and `getCategoryColor`.
- Segment shares plus `leftoverShare` sum to 1 in the normal case.
- Over-budget case has `leftover === 0`, `leftoverShare === 0`, `isOverBudget === true`, and segment shares sum to 1 against `totalExpenses`.
- `hasSalary` is `false` and no `NaN` values appear when available income is 0.
- `segments` only include categories with `value > 0`, sorted descending by value.
- `tailGroupedCount` counts segments with `share < 0.08`.
- Segment colors come from `getCategoryColor`.
- Current-month available income includes the extra balance; other months use salary only.
- All unit tests pass.
- TypeScript compilation passes.
