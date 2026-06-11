# Plan 035 - Spending Trends and Averages

Status: Pending

## Spec

`docs/specs/035-spending-trends-and-averages.md`

## Objective

Turn the existing `monthHistory` into insight. On `Resumo`, show how the current month's total spending compares to the historical average with a neutral trend indicator. In `Histórico`, show per-category averages and how each past month's category total varied against its average, plus an overall-average summary. No new storage or dependencies; math lives in pure helpers.

## Tasks

| Task   | File                                               | Purpose                                                                                                                |
| ------ | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 035-01 | `docs/tasks/035-01-add-spending-trends-helpers.md` | Add `src/lib/spendingTrends.ts` (`computeTotalTrend`, `computeCategoryAverages`, `categoryVariation`) with unit tests. |
| 035-02 | `docs/tasks/035-02-add-resumo-trend-line.md`       | Render the total trend line in `SummaryScreen` current-month view.                                                     |
| 035-03 | `docs/tasks/035-03-add-history-variation.md`       | Show per-category variation and overall-average summary in `HistoryCard` / the `Histórico` view.                       |
| 035-04 | `docs/tasks/035-04-update-docs-and-validate.md`    | Update `docs/app-context.md`, run full validation.                                                                     |

## Helper Shapes (035-01)

`src/lib/spendingTrends.ts` — pure, operating on history + a passed-in current total (not raw `FinanceState`):

```ts
type TrendDirection = 'above' | 'below' | 'average';

type TotalTrend = {
  hasEnoughData: boolean;     // monthHistory.length >= 2
  average: number;            // mean of totalExpenses
  current: number;            // current-month total expenses
  deltaAmount: number;        // current - average
  deltaRatio: number | null;  // (current - average) / average, null if average is 0
  direction: TrendDirection;
};

type CategoryAverage = {
  categoryId: string;
  name: string;
  average: number;            // mean across entries where it appears
};

computeTotalTrend(monthHistory, currentTotal): TotalTrend;
computeCategoryAverages(monthHistory): CategoryAverage[];
categoryVariation(monthTotal, average): { direction: TrendDirection; ratio: number | null };
```

- The ±2% neutral band for `direction` is applied inside these helpers.
- `MonthHistoryEntry` already carries `totalExpenses` and per-category totals (`entry.categories[].total`); `computeCategoryAverages` averages only over entries where the category appears.

## Notes

- `Resumo`: in the current-month view, add a compact trend line near the expenses/commitment area. Current total comes from the existing `currentMonthlyTotalExpenses` in `SummaryScreen`; average from `computeTotalTrend(financeState.monthHistory, currentMonthlyTotalExpenses)`. Show arrow (▲ above / ▼ below / ◦ average), delta percentage and amount (e.g. `12% acima da média · +R$ 900`). When `hasEnoughData` is false: `Sem histórico suficiente para comparar.`
- `Histórico`: in each expanded `HistoryCard` `Categorias` tab row, show the category's variation vs its historical average via `categoryVariation` (e.g. `+18%` / `−7%` / `na média`). Add an overall-average monthly-spend summary at the top of the list or card. With fewer than 2 entries, show the insufficient-data message instead of variations.
- Use a **neutral informational color** for trend text — do NOT reuse `resolveCommitmentColor`, so trends are not confused with the commitment semaphore.
- All monetary values respect `valuesHidden` (`maskCurrency`). Percentages use `percentageFormatter` where appropriate.
- No changes to `monthHistory`, the data model, storage, or backup/restore. No new charts or dependencies.

## Tests (035-01)

- `computeTotalTrend` averages `totalExpenses` correctly across entries.
- `direction` is `above`/`below`/`average` respecting the ±2% band.
- `deltaRatio` is `null` when the average is 0.
- `hasEnoughData` false with fewer than 2 entries.
- `computeCategoryAverages` averages only over entries where the category appears.
- `categoryVariation` returns correct direction and ratio for above/below/within-band cases.

## Validation

- `npm run check`
- `npm test`
