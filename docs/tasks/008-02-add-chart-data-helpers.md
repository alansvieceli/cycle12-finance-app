# Task 008-02 - Add Chart Data Helpers

## Plan Reference

`docs/plans/008-finance-charts-tab-plan.md`

## Spec Reference

`docs/specs/008-finance-charts-tab.md`

## Objective

Add pure helpers that transform finance state into chart-friendly data.

## Steps

1. Add helpers under `src/lib/`.
2. Build monthly surplus/shortfall chart data.
3. Build monthly expense chart data.
4. Build current-month category total chart data.
5. Add unit tests.

## Acceptance Criteria

- Helpers are pure and testable.
- Helpers respect the provided projection months.
- Empty data is handled safely.
- Unit tests cover chart data behavior.

## Validation

Run:

```bash
npm test
```
