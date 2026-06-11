# Task 035-01 - Add Spending Trends Helpers

Status: Done

## Spec

`docs/specs/035-spending-trends-and-averages.md`

## Plan

`docs/plans/035-spending-trends-and-averages-plan.md`

## Goal

Add pure helper functions in `src/lib/spendingTrends.ts` that compute the historical total-expense trend and per-category averages/variations from `monthHistory`, with unit tests.

## Files

- Create: `src/lib/spendingTrends.ts`
- Create: `src/lib/spendingTrends.test.ts`

## Steps

1. Create `src/lib/spendingTrends.ts`:

```ts
import { MonthHistoryEntry } from '../types/finance';

const NEUTRAL_BAND_RATIO = 0.02;

export type TrendDirection = 'above' | 'below' | 'average';

export type TotalTrend = {
  hasEnoughData: boolean;
  average: number;
  current: number;
  deltaAmount: number;
  deltaRatio: number | null;
  direction: TrendDirection;
};

export type CategoryAverage = {
  categoryId: string;
  name: string;
  average: number;
};

function resolveDirection(ratio: number | null, deltaAmount: number): TrendDirection {
  if (ratio === null) {
    return deltaAmount === 0 ? 'average' : 'above';
  }
  if (ratio > NEUTRAL_BAND_RATIO) return 'above';
  if (ratio < -NEUTRAL_BAND_RATIO) return 'below';
  return 'average';
}

export function computeTotalTrend(
  monthHistory: MonthHistoryEntry[],
  currentTotal: number,
): TotalTrend {
  const hasEnoughData = monthHistory.length >= 2;
  const average = hasEnoughData
    ? monthHistory.reduce((sum, entry) => sum + entry.totalExpenses, 0) /
      monthHistory.length
    : 0;
  const deltaAmount = currentTotal - average;
  const deltaRatio = average === 0 ? null : deltaAmount / average;

  return {
    hasEnoughData,
    average,
    current: currentTotal,
    deltaAmount,
    deltaRatio,
    direction: resolveDirection(deltaRatio, deltaAmount),
  };
}

export function computeCategoryAverages(
  monthHistory: MonthHistoryEntry[],
): CategoryAverage[] {
  const totalsById = new Map<string, { name: string; sum: number; count: number }>();

  for (const entry of monthHistory) {
    for (const category of entry.categories) {
      const existing = totalsById.get(category.id);
      if (existing) {
        existing.sum += category.total;
        existing.count += 1;
        existing.name = category.name;
      } else {
        totalsById.set(category.id, {
          name: category.name,
          sum: category.total,
          count: 1,
        });
      }
    }
  }

  return Array.from(totalsById.entries()).map(([categoryId, { name, sum, count }]) => ({
    categoryId,
    name,
    average: sum / count,
  }));
}

export function categoryVariation(
  monthTotal: number,
  average: number,
): { direction: TrendDirection; ratio: number | null } {
  const deltaAmount = monthTotal - average;
  const ratio = average === 0 ? null : deltaAmount / average;

  return {
    direction: resolveDirection(ratio, deltaAmount),
    ratio,
  };
}
```

2. Create `src/lib/spendingTrends.test.ts` covering:
   - `computeTotalTrend` averages `totalExpenses` across entries correctly.
   - `direction` is `'above'`/`'below'`/`'average'` respecting the ±2% band (test values just inside and just outside the band).
   - `deltaRatio` is `null` when `average === 0`.
   - `hasEnoughData` is `false` for 0 or 1 history entries, `true` for 2+.
   - `computeCategoryAverages` averages a category only across the entries where it appears (e.g. category present in 2 of 3 entries).
   - `categoryVariation` returns correct direction/ratio for above, below, within-band, and `average === 0` cases.

3. Run `npx tsc --noEmit` and `npm test -- spendingTrends` and confirm both pass.

## Acceptance Criteria

- `src/lib/spendingTrends.ts` exports `TrendDirection`, `TotalTrend`, `CategoryAverage`, `computeTotalTrend`, `computeCategoryAverages`, `categoryVariation`.
- Helpers are pure (no side effects, no dependency on `FinanceState`).
- ±2% neutral band applied consistently in both `computeTotalTrend` and `categoryVariation`.
- Unit tests in `src/lib/spendingTrends.test.ts` cover all cases listed above and pass.
- TypeScript compilation passes.
