# Spec 046 - Negative Balance Total

## Objective

Simplify the `Gráficos` tab and make the monthly balance summary show the total shortfall across the visible period.

## Changes

- Remove the `Pago vs Pendente — mês atual` panel from `Gráficos`.
- Keep the existing `Saldo por mês` chart and its positive and negative monthly values.
- Replace `Total no período` with `Total negativo no período`.
- Calculate that total by adding only monthly balances below zero.
- Preserve the negative sign in the formatted total.

Example:

- Monthly balances: `-10`, `-45`, `40`, `60`.
- Total negative balance: `-55`.

## Data Flow

`ChartsScreen` continues to build monthly balance data with
`buildSurplusShortfallChartData`. `MonthlyBarChart` derives the displayed total
from the negative points in that existing data.

No finance state or stored data changes.

## Testing

- Add a focused unit test proving that positive and zero monthly balances are
  excluded from the negative total.
- Keep the existing chart data and finance calculation tests unchanged.

## Out of Scope

- New charts.
- New dependencies.
- Changes to payment tracking outside `Gráficos`.
- Changes to the individual monthly balance bars or value list.

## Acceptance Criteria

- `Pago vs Pendente — mês atual` is no longer shown in `Gráficos`.
- The balance chart still shows every visible month.
- The summary adds only negative monthly balances.
- The summary keeps the minus sign when monetary values are visible.
- Hidden monetary values continue to use the app's existing privacy mask.
- TypeScript, tests, lint, duplication, and the full project quality gate pass.
- README and app context describe the updated `Gráficos` behavior.
