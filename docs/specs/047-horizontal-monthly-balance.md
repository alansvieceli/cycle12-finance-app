# Spec 047 - Horizontal Monthly Balance

## Objective

Make `Saldo por mês` show every visible projection month at once, replacing the
vertical bar chart that clips months on narrow screens.

## Problem

`MonthlyBarChart` renders a fixed-width vertical `BarChart` (max `360`) with
scrolling disabled inside a container with `overflow: hidden`. Twelve months
need at least `12 × (barWidth 22 + spacing 10) + initialSpacing 18 ≈ 402` of
horizontal space, so the last months are cut off. Width is the scarce axis on a
phone; the number of months is fixed at 12.

## Changes

- Replace the vertical `BarChart` in `Saldo por mês` with a diverging
  horizontal bar list: one row per month, bar growing left from a center zero
  line for shortfall and right for surplus.
- Show each month's formatted balance in its own row, so the `Valores` toggle
  and its value list are removed as redundant.
- Keep `Total do período` and `Total negativo no período` unchanged.
- Add a bottom legend naming both directions (`falta` / `sobra`).
- Bar length is proportional to the largest absolute monthly balance in the
  visible period; a non-zero balance always keeps a visible minimum length.
- Delete `toGiftedBalanceBarData` and `GiftedBarPoint`, now unused.
  `react-native-gifted-charts` stays as a dependency for the category donut.

## Data Flow

`ChartsScreen` keeps building the data with `buildSurplusShortfallChartData`.
`MonthlyBarChart` derives the bar length of each row from the period's largest
absolute value through a new `calculateBalanceBarRatio` helper in `chartData`.

No finance state or stored data changes.

## Testing

- Add focused unit tests for `calculateBalanceBarRatio` covering the full-length
  case, proportional lengths, the zero balance, and the minimum visible length.
- Remove the `toGiftedBalanceBarData` test with the deleted helper.

## Out of Scope

- New dependencies.
- Changes to `Comprometimento por mês` or `Categorias no mês atual`.
- Changes to the balance calculation or to the period totals.
- Changing how hidden monetary values are masked.

## Acceptance Criteria

- `Saldo por mês` shows all 12 visible months without clipping or scrolling.
- Each row shows the month label, a diverging bar, and the formatted balance.
- Shortfall rows point left in the negative color, surplus rows point right in
  the positive color.
- Both period totals keep their current values, labels, and negative signs.
- The eye toggle keeps masking every monetary value in the panel.
- `npm run check` and `npm run dup` pass.
- README and app context describe the updated `Saldo por mês` panel.
