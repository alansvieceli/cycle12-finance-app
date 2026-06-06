# Task 023-01 - Add Commitment Chart Helper

## Plan

`docs/plans/023-graficos-tab-revision-plan.md`

## Goal

Add a `CommitmentChartPoint` type and a `buildMonthlyCommitmentChartData` helper to `src/lib/chartData.ts`. The helper must compute the income commitment percentage and resolve the threshold color for each projection month.

## Steps

1. Add `CommitmentChartPoint` type to `src/lib/chartData.ts`.
2. Add `buildMonthlyCommitmentChartData` function using `calculateIncomeCommitmentPercentage` and `resolveCommitmentColor`.
3. Add unit tests in `src/lib/chartData.test.ts`.

## Acceptance Criteria

- `CommitmentChartPoint` is exported from `src/lib/chartData.ts`.
- `buildMonthlyCommitmentChartData` returns one point per projection month.
- Returns `null` for percentage when salary is zero.
- Uses `commitmentLow`, `commitmentMedium`, or `commitmentHigh` color based on configured thresholds.
- Uses base salary only (no extra balance) for non-current months.
- Unit tests pass.

## Validation

```bash
npm test -- --testPathPattern=chartData
```
