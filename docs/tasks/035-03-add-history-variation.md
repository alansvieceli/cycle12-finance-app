# Task 035-03 - Add History Category Variation and Average Summary

Status: Done

## Spec

`docs/specs/035-spending-trends-and-averages.md`

## Plan

`docs/plans/035-spending-trends-and-averages-plan.md`

## Goal

In the `Histórico` view, show per-category variation against each category's historical average inside `HistoryCard`'s `Categorias` tab, and add an overall average-monthly-spend summary to the `Histórico` list, using `computeCategoryAverages` and `categoryVariation` from `src/lib/spendingTrends.ts` (added in 035-01).

## Files

- Modify: `src/components/finance/HistoryCard.tsx`
- Modify: `src/screens/SummaryScreen.tsx`

## Steps

1. In `src/screens/SummaryScreen.tsx` (`activeView === 'history'` branch):
   - Compute `categoryAverages = computeCategoryAverages(financeState.monthHistory)` once.
   - When `financeState.monthHistory.length >= 2`, render a small summary line above the history list: overall average monthly spend = mean of `entry.totalExpenses` across `monthHistory` (reuse `computeTotalTrend(financeState.monthHistory, 0).average`, or compute inline the same way), formatted with `maskCurrency(average, valuesHidden)`, e.g. `"Média mensal: R$ X"`. Style with `colors.info` / a label-like text style. When fewer than 2 entries, render nothing extra (existing empty/short-history states are unchanged).
   - Pass `categoryAverages` and a `hasEnoughHistory` (`monthHistory.length >= 2`) flag down to `HistoryCard` as new props.

2. In `src/components/finance/HistoryCard.tsx`:
   - Add props: `categoryAverages: CategoryAverage[]` and `hasEnoughHistory: boolean` (import `CategoryAverage` and `categoryVariation` from `../../lib/spendingTrends`).
   - In the `Categorias` tab row for each `sortedCategories` entry, when `hasEnoughHistory` is true, look up the matching `CategoryAverage` by `category.id` and compute `categoryVariation(category.total, average)`. Render the variation next to the amount:
     - `'above'` → `+{percent}%`
     - `'below'` → `-{percent}%`
     - `'average'` → `na média`
     - If no matching average exists for the category (new category, not in history), render nothing for that row.
   - Style the variation text with `colors.info`, small/secondary size (e.g. reuse or extend `typography.label`), placed alongside `styles.rowAmount`.
   - When `hasEnoughHistory` is false, render rows exactly as before (no variation text).

## Acceptance Criteria

- `Histórico` shows an overall average monthly spend summary when there are 2+ history entries, respecting `valuesHidden`.
- Each category row in an expanded `HistoryCard`'s `Categorias` tab shows its variation vs that category's historical average (`+X%` / `-X%` / `na média`) when `monthHistory.length >= 2`.
- Categories with no historical average (not present in any history entry) show no variation text.
- With fewer than 2 history entries, no variation text or average summary is shown (existing behavior preserved).
- Variation/summary text uses `colors.info`, distinct from the commitment semaphore colors.
- TypeScript compilation passes (`npx tsc --noEmit`).
