# Task 011-03 - Replace Chart Components

## Spec

`docs/specs/011-gifted-charts-visual-upgrade.md`

## Plan

`docs/plans/011-gifted-charts-visual-upgrade-plan.md`

## Goal

Render the `Gráficos` tab with gifted chart components.

## Steps

1. Replace `Sobra ou falta por mês` with a positive/negative gifted column chart.
2. Replace `Despesas por mês` with a gifted line chart using filled area.
3. Replace `Categorias do mês atual` with a gifted donut chart.
4. Keep totals, empty states, and legends readable on mobile width.
5. Keep monthly values available behind a show/hide control so mobile charts stay compact.
6. Keep charts read-only and theme-aligned.

## Acceptance Criteria

- The balance chart uses gifted columns with positive and negative colors.
- The expense chart uses a gifted line chart with area fill.
- The category chart uses a gifted donut chart.
- Empty states still render without crashing.
- Legends and labels fit mobile width.
- Full monthly values can be shown or hidden per chart.
