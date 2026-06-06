# Task 023-04 - Revise ChartsScreen

## Plan

`docs/plans/023-graficos-tab-revision-plan.md`

## Goal

Update `src/screens/ChartsScreen.tsx` to use the new components and reflect the new panel order. Remove the "Despesas por mês" line chart.

## Steps

1. Add `MonthlyCommitmentList` and `PaymentSummaryPanel` imports.
2. Compute payment summary and account counts for the current month using `calculatePaymentSummary`, `getMonthlyValueAmount`, and `isAccountItemPaid`.
3. Render panels in the new order: Comprometimento → Pago vs Pendente → Categorias → Saldo.
4. Remove `buildMonthlyExpenseChartData` and the `MonthlyBarChart` expense instance.
5. Keep "Saldo por mês" title on the surplus/shortfall bar chart.

## Acceptance Criteria

- Panel order: `MonthlyCommitmentList`, `PaymentSummaryPanel`, `CategoryBarChart`, `MonthlyBarChart` (balance).
- "Despesas por mês" line chart is removed.
- All panels handle empty state without crashing.
- No changes to `Resumo` tab or finance calculations.
- TypeScript passes.
- All tests pass.
