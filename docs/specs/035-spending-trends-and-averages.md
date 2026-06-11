# Spec 035 - Spending Trends and Averages

## Goal

Turn the existing month history from a passive record into insight. Show, on `Resumo`, how the current month's total spending compares to the historical average with a trend indicator (spending more or less than usual); and, in `Histórico`, per-category averages and how each past month varied against its category average.

## Context

Spec 030 introduced `monthHistory` — up to 12 snapshots captured when the planning window advances, each with `totalIncome`, `totalExpenses`, and per-category/per-account breakdowns. Today this data is only displayed as-is in the `Histórico` view; the app never compares months or surfaces what is "normal".

Users want to know whether the current month is heavier or lighter than usual, and which categories trend up or down — using data the app already captures, with no new storage.

## Non-Goals

- Do not add new charts or chart dependencies (simple indicators only: a trend arrow, a delta, small per-category figures).
- Do not change `monthHistory`, the data model, storage, or backup/restore.
- Do not allow editing history.
- Do not project future trends or forecasts.
- Do not add new dependencies.

## Definitions

- **Historical average (total):** the mean of `totalExpenses` across all `monthHistory` entries.
- **Per-category average:** for a given category, the mean of that category's total across the `monthHistory` entries in which it appears.
- **Current-month total:** the current projection month's total expenses, computed live via `calculateMonthlyTotalExpenses` (the current month is not yet in history).
- **Trend:** comparison of a value against its average — `acima` (above), `abaixo` (below), or `na média` (within a small neutral band, e.g. ±2%).

A minimum of **2 history entries** is required to show averages/trends; below that, show an insufficient-data message.

## UX Behavior

### Resumo — total trend indicator

In the current-month view of `Resumo`, add a compact trend line near the expenses/commitment area:

- Compares current-month total expenses to the historical average.
- Shows a direction arrow (▲ above / ▼ below / ◦ on average), the delta as a percentage and amount (e.g. `12% acima da média · +R$ 900`), colored neutrally (this is informational, not the commitment semaphore).
- When there are fewer than 2 history entries: `Sem histórico suficiente para comparar.`
- Monetary values respect the `valuesHidden` eye toggle.

### Histórico — per-category averages and variation

Within the `Histórico` view, surface per-category averages and per-month variation:

- In each expanded history card's `Categorias` tab, alongside each category's total for that month, show its variation versus that category's historical average (e.g. `+18%` / `−7%` / `na média`), colored neutrally.
- Add a small summary at the top of the `Histórico` list (or card) noting the overall average monthly spend across history.
- When there are fewer than 2 entries, show the insufficient-data message instead of variations.
- Values respect the eye toggle.

## Data Builder

Add pure helpers in the lib layer (e.g. `src/lib/spendingTrends.ts`):

```ts
type TrendDirection = 'above' | 'below' | 'average';

type TotalTrend = {
  hasEnoughData: boolean; // monthHistory.length >= 2
  average: number; // mean of totalExpenses
  current: number; // current-month total expenses
  deltaAmount: number; // current - average
  deltaRatio: number | null; // (current - average) / average, null if average is 0
  direction: TrendDirection;
};

type CategoryAverage = {
  categoryId: string;
  name: string;
  average: number; // mean across entries where it appears
};
```

- `computeTotalTrend(monthHistory, currentTotal)` returns `TotalTrend`.
- `computeCategoryAverages(monthHistory)` returns `CategoryAverage[]`.
- `categoryVariation(monthTotal, average)` returns direction + ratio for a single history card row.
- The ±2% neutral band for `direction` is applied in these helpers.

Keeping the math pure keeps it unit-testable and the components focused on rendering.

## Implementation Notes

- Add `src/lib/spendingTrends.ts` with the helpers above, reusing `calculateMonthlyTotalExpenses` results passed in by the caller (helpers operate on history + a current total, not on raw `FinanceState`, to stay pure).
- Update `SummaryScreen` to compute the current-month total (already available) and the historical average, and render the trend line in the current-month view.
- Update the history view / `HistoryCard` to show per-category variation in the `Categorias` tab and the overall-average summary, using `computeCategoryAverages` and `categoryVariation`.
- Use a neutral informational color for trend text (not `resolveCommitmentColor`), so trends are not confused with the commitment semaphore.
- All monetary values respect `valuesHidden`.

## Tests

Unit tests for the helpers:

- `computeTotalTrend` averages `totalExpenses` correctly across entries.
- `direction` is `above`/`below`/`average` respecting the ±2% band.
- `deltaRatio` is `null` when the average is 0.
- `hasEnoughData` is false with fewer than 2 entries.
- `computeCategoryAverages` averages only over entries where the category appears.
- `categoryVariation` returns the correct direction and ratio for above/below/within-band cases.

## Acceptance Criteria

- `Resumo` shows a trend line comparing current-month spending to the historical average, with direction arrow, delta percentage, and delta amount.
- With fewer than 2 history entries, `Resumo` shows the insufficient-data message instead.
- `Histórico` shows per-category variation versus each category's historical average in the `Categorias` tab.
- `Histórico` shows the overall average monthly spend across history.
- Trend indicators use neutral coloring, distinct from the commitment semaphore.
- All monetary values respect the eye icon toggle.
- No changes to `monthHistory`, storage, or backup/restore.
- No new dependencies.
- TypeScript validation passes.
- Unit tests pass.

## Validation

```bash
npm run check
npm test
```
