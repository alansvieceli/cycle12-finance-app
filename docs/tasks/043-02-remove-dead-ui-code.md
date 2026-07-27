# Task 043-02 - Remove Dead UI Code

Status: Done

## Spec

`docs/specs/043-tab-review-cleanup.md`

## Plan

`docs/plans/043-tab-review-cleanup-plan.md`

## Goal

Delete three pieces of unreachable UI code found in the tab review. None of them can render today, so nothing on screen changes.

## Files

- Modify: `src/screens/SummaryScreen.tsx`
- Modify: `src/screens/ChartsScreen.tsx`
- Modify: `src/components/finance/AccountEditor.tsx`
- Modify: `src/components/finance/MonthlyBarChart.tsx`
- Modify: `src/lib/giftedChartAdapters.ts`
- Modify: `src/lib/giftedChartAdapters.test.ts`

## Steps

- [x] **Step 1: `KpiCard` extras**

In `SummaryScreen.tsx`, remove the `detail` and `subvalue` props from `KpiCard`'s signature, the two JSX blocks that render them, and the `kpiDetail` / `kpiSubvalue` styles. Spec 038 removed the only card that passed them.

- [x] **Step 2: `AccountEditor.onClose`**

Remove the optional `onClose` prop, its destructured parameter, and the `{onClose ? <ActionButton ... /> : null}` block. `AccountsScreen` never passes it. Keep `panelHeader` — the title still uses it.

- [x] **Step 3: `MonthlyBarChart` expense mode**

- Remove the `mode` prop, keeping only the `BarChart` branch.
- Remove the `LineChart` import and the `toGiftedExpenseLineData` import.
- Remove `maxValue` and `chartMaxValue` (only the line chart used them).
- `totalAmountStyle` and the value-list amount color become unconditional: negative → `negativeAmount`, otherwise `positiveAmount`.
- In `ChartsScreen.tsx`, remove `mode="balance"`.

- [x] **Step 4: Adapter cleanup**

In `giftedChartAdapters.ts`, delete `toGiftedExpenseLineData` and the `GiftedLinePoint` type. Delete their cases in `giftedChartAdapters.test.ts`.

- [x] **Step 5: Validate**

```bash
npm run typecheck && npm test && npm run knip:production
```

## Acceptance Criteria

- No `detail` / `subvalue` on `KpiCard`; no `kpiDetail` / `kpiSubvalue` styles.
- No `onClose` prop on `AccountEditor`.
- `MonthlyBarChart` renders only the balance bar chart and imports no `LineChart`.
- `toGiftedExpenseLineData` and `GiftedLinePoint` no longer exist.
- Typecheck, tests, and knip pass.
