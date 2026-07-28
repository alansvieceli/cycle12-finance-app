# Spec 046 - Negative Balance Total

## Objective

Simplify the `Gráficos` tab and make the monthly balance summary show the total shortfall across the visible period.

## Changes

- Remove the `Pago vs Pendente — mês atual` panel from `Gráficos`.
- Keep the existing `Saldo por mês` chart and its positive and negative monthly values.
- Keep `Total do período`, calculated by adding every monthly balance.
- Add `Total negativo no período`, calculated by adding only monthly balances
  below zero.
- Preserve negative signs in the formatted totals.

Example:

- Monthly balances: `-10`, `-45`, `40`, `60`.
- Total balance: `45`.
- Total negative balance: `-55`.

## Data Flow

`ChartsScreen` continues to build monthly balance data with
`buildSurplusShortfallChartData`. `MonthlyBarChart` derives the period total
from every point and the negative total from only the negative points in that
existing data.

No finance state or stored data changes.

## Testing

- Add focused unit tests proving that the period total includes every monthly
  balance and that positive and zero balances are excluded from the negative
  total.
- Keep the existing chart data and finance calculation tests unchanged.

## Out of Scope

- New charts.
- New dependencies.
- Changes to payment tracking outside `Gráficos`.
- Changes to the individual monthly balance bars or value list.

## Acceptance Criteria

- `Pago vs Pendente — mês atual` is no longer shown in `Gráficos`.
- The balance chart still shows every visible month.
- `Total do período` adds all monthly balances.
- `Total negativo no período` adds only negative monthly balances.
- Both summaries keep their negative signs when monetary values are visible.
- Hidden monetary values continue to use the app's existing privacy mask.
- TypeScript, tests, lint, duplication, and the full project quality gate pass.
- README and app context describe the updated `Gráficos` behavior.
