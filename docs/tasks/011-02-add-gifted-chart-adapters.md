# Task 011-02 - Add Gifted Chart Adapters

## Spec

`docs/specs/011-gifted-charts-visual-upgrade.md`

## Plan

`docs/plans/011-gifted-charts-visual-upgrade-plan.md`

## Goal

Add pure helpers that convert app chart data into `react-native-gifted-charts` data shapes.

## Steps

1. Add adapter helpers under `src/lib/`.
2. Map surplus/shortfall points to positive/negative bar data.
3. Map expense points to line/area chart data.
4. Map category points to donut chart data with stable segment colors.
5. Add unit tests for the adapters.

## Acceptance Criteria

- Adapter helpers are pure.
- Positive and negative bar colors are assigned correctly.
- Expense line data keeps labels and values.
- Donut data hides zero values and assigns readable colors.
- Unit tests pass.
