# Task 025-04 - Mask Display Values

## Spec

`docs/specs/025-hide-values-toggle.md`

## Plan

`docs/plans/025-hide-values-toggle-plan.md`

## Goal

Apply `maskCurrency` to every read-only monetary value rendered across all tabs.

## Steps

For each file below, add `valuesHidden: boolean` to the component props and replace every `currencyFormatter.format(value)` call that renders a display value with `maskCurrency(value, valuesHidden)`.

**`src/screens/SummaryScreen.tsx`**

- Projected balance (`currentSurplusOrShortfall`)
- Despesas, Pendente, Pago KPI cards
- Pass `valuesHidden` down to `MonthSummaryCard` and `MonthDetailsPanel`

**`src/components/finance/MonthSummaryCard.tsx`**

- Monthly balance (`surplusOrShortfall`)
- Despesas (`monthlyTotalExpenses`)

**`src/components/finance/MonthDetailsPanel.tsx`**

- Category totals and monthly total

**`src/components/finance/CategoryTotalsList.tsx`**

- Category total amounts

**`src/components/finance/PaymentSummaryPanel.tsx`**

- Paid and pending totals

**`src/components/finance/CurrentMonthPaymentChecklist.tsx`**

- Individual account item amounts

**`src/screens/ChartsScreen.tsx`**

- Pass `valuesHidden` down to `MonthlyBarChart` and `CategoryBarChart`

**`src/components/finance/MonthlyBarChart.tsx`** and **`src/components/finance/CategoryBarChart.tsx`**

- Replace formatted label strings passed to gifted-charts with `maskCurrency(value, valuesHidden)`

Do not mask percentage values anywhere.

## Acceptance Criteria

- When `valuesHidden` is `true`, all monetary display values across Resumo, Gráficos, Pagamentos, and month detail panels show `R$ ••••`.
- When `valuesHidden` is `false`, all values show normally.
- Percentage values are not masked.
- The `Próximo venc.` KPI (day number) is not masked.
- TypeScript validation passes.
- Existing tests pass.
