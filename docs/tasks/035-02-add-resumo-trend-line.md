# Task 035-02 - Add Resumo Trend Line

Status: Done

## Spec

`docs/specs/035-spending-trends-and-averages.md`

## Plan

`docs/plans/035-spending-trends-and-averages-plan.md`

## Goal

In `SummaryScreen`'s current-month view, render a compact trend line comparing the current month's total expenses to the historical average from `monthHistory`, using `computeTotalTrend` from `src/lib/spendingTrends.ts` (added in 035-01).

## Files

- Modify: `src/screens/SummaryScreen.tsx`

## Steps

1. Import `computeTotalTrend` and `TrendDirection` from `../lib/spendingTrends`.
2. In `SummaryScreen`, compute:

```ts
const totalTrend = computeTotalTrend(
  financeState.monthHistory,
  currentMonthlyTotalExpenses,
);
```

3. Add a helper to render the trend line text and arrow:
   - `hasEnoughData === false` → text: `"Sem histórico suficiente para comparar."`
   - Otherwise:
     - Arrow: `▲` for `'above'`, `▼` for `'below'`, `◦` for `'average'`.
     - Percentage: `percentageFormatter.format(Math.abs(totalTrend.deltaRatio ?? 0))`.
     - Direction label: `'acima da média'` / `'abaixo da média'` / `'na média'`.
     - Amount: `maskCurrency(Math.abs(totalTrend.deltaAmount), valuesHidden)`, prefixed with `+` if `direction === 'above'` and `-` if `'below'` (omit sign for `'average'`).
     - For `'average'` direction, omit the percentage/amount segment entirely and just show `"◦ na média"` (or similar concise wording) — only show percent+amount for `'above'`/`'below'`.
     - Example for `'above'`: `"▲ 12% acima da média · +R$ 900"`.

4. Place this trend line inside `styles.balancePanel`, below the commitment progress bar (after the existing `styles.progressTrack` block, before the closing `</View>` of `balancePanel`), in the current-month (`activeView === 'current'`) branch only.
5. Style the text with `colors.info` (neutral informational color, not `commitmentColor` / `resolveCommitmentColor`). Add a new style (e.g. `trendLine`) using `typography.label` or similar small text style, consistent with existing label styles in the file.
6. Ensure all monetary parts go through `maskCurrency(value, valuesHidden)`.

## Acceptance Criteria

- Current-month view of `Resumo` shows a trend line comparing current total expenses to the historical average.
- With `monthHistory.length < 2`, shows `"Sem histórico suficiente para comparar."` instead.
- Direction arrow (`▲`/`▼`/`◦`), percentage, and delta amount are shown for `'above'`/`'below'`; `'average'` shows a neutral "na média" message without percent/amount.
- Text uses `colors.info`, distinct from `commitmentColor`.
- Monetary values respect `valuesHidden` via `maskCurrency`.
- TypeScript compilation passes (`npx tsc --noEmit`).
