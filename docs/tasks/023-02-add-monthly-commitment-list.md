# Task 023-02 - Add MonthlyCommitmentList Component

## Plan

`docs/plans/023-graficos-tab-revision-plan.md`

## Goal

Add a read-only `MonthlyCommitmentList` component under `src/components/finance/`. It displays one row per projection month with the month label, a colored progress bar, and the commitment percentage.

## Steps

1. Create `src/components/finance/MonthlyCommitmentList.tsx`.
2. Render one row per `CommitmentChartPoint` with label, progress bar, and percentage text.
3. Color the bar and percentage text using the color from each point.
4. Show empty state text when data array is empty.

## Acceptance Criteria

- Progress bar width is clamped between 0% and 100%.
- Bar color and text color reflect the point color from `CommitmentChartPoint`.
- When percentage is null, bar is neutral and text shows `—`.
- Empty state renders without crashing.
- TypeScript passes.
