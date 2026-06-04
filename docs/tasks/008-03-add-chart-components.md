# Task 008-03 - Add Chart Components

## Plan Reference

`docs/plans/008-finance-charts-tab-plan.md`

## Spec Reference

`docs/specs/008-finance-charts-tab.md`

## Objective

Add simple reusable React Native chart components without a chart dependency.

## Steps

1. Add a vertical monthly bar chart component.
2. Add a horizontal category bar list component.
3. Add chart totals to each panel.
4. Add empty states.
5. Keep styles mobile-friendly.

## Acceptance Criteria

- Components use simple React Native views.
- Components handle zero values.
- Components show total values for the chart data.
- Components are read-only.
- No chart dependency is added.

## Validation

Run:

```bash
npx tsc --noEmit
```
