# Task 008-04 - Add Charts Screen And Tab

## Plan Reference

`docs/plans/008-finance-charts-tab-plan.md`

## Spec Reference

`docs/specs/008-finance-charts-tab.md`

## Objective

Add the `Gráficos` tab immediately after `Resumo`.

## Steps

1. Add `ChartsScreen`.
2. Use chart data helpers and chart components.
3. Add the `Gráficos` tab after `Resumo`.
4. Pass visible projection months to the chart screen.

## Acceptance Criteria

- `Gráficos` appears after `Resumo`.
- Charts respect visible months.
- Charts render with empty and filled data.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```
