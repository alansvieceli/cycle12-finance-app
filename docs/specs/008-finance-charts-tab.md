# Spec 008 - Finance Charts Tab

## Objective

Add a `Gráficos` tab after `Resumo` to help the user quickly compare monthly finance trends.

## Context

The app already calculates monthly expenses, income commitment, surplus or shortfall, and category totals. These values are currently shown mostly as cards and lists.

The user wants a new tab with visual charts. The first implementation should stay simple, local-only, and avoid unnecessary chart dependencies.

## Goals

- Add a `Gráficos` tab immediately after `Resumo`.
- Show useful finance visuals for the configured visible month window.
- Use simple React Native views for chart bars instead of adding a chart library.
- Reuse existing finance calculation logic.
- Keep charts read-only.
- Keep the UI clear on Android/mobile screens.

## Non-goals

- Do not add backend code.
- Do not add authentication.
- Do not add paid services.
- Do not add a chart library yet.
- Do not add interactive drill-downs yet.
- Do not add export/share features.
- Do not add animated charts in the first version.

## Tab Placement

The tab order should be:

1. `Resumo`
2. `Gráficos`
3. `Planejamento`
4. `Categorias`
5. `Ajustes`

## Charts

The first version should include:

### Surplus/Shortfall By Month

Show a bar chart for monthly surplus or shortfall.

Expected behavior:

- Positive values use the positive balance color.
- Negative values use the negative balance color.
- Labels show the month and formatted amount.
- The panel shows the total surplus or shortfall for the visible period.

### Expenses By Month

Show a bar chart for total monthly expenses.

Expected behavior:

- Uses the same visible projection months as `Resumo`.
- Each month shows total expense amount.
- Bars scale relative to the largest visible expense.
- The panel shows the total expenses for the visible period.

### Category Totals For Current Month

Show horizontal bars for current-month category totals.

Expected behavior:

- Uses the current projection month.
- Uses sorted categories.
- Bars scale relative to the largest category total in the current month.
- Empty or zero categories may be hidden if that keeps the chart easier to scan.
- The panel shows the total expenses for the current month categories.

## Data Rules

Charts should use:

- configured visible months
- existing category/account/monthly value data
- current settings for salary and current-month extra balance

Surplus/shortfall should use the same current-month extra balance rules as `Resumo`.

Charts should not change any state.

## Implementation Notes

Recommended implementation:

- Add pure helpers under `src/lib/` to build chart-friendly data.
- Add focused tests for those helpers.
- Add finance chart components under `src/components/finance/`.
- Add `ChartsScreen` under `src/screens/`.
- Add the new tab in `FinanceApp`.

## Acceptance Criteria

- `Gráficos` appears immediately after `Resumo`.
- The charts tab is read-only.
- The tab shows surplus/shortfall by month.
- The tab shows expenses by month.
- The tab shows current-month category totals.
- Each chart panel shows a total for its chart data.
- Charts respect configured visible months.
- Charts handle empty data without crashing.
- No new chart dependency is added.
- TypeScript validation passes.
- Existing tests pass.
- Unit tests cover chart data helpers.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```

Run:

```bash
npm run test:coverage
```

When applicable, validate manually on Android through Expo:

```bash
npx expo start
```

Confirm:

- `Gráficos` appears after `Resumo`
- charts render with empty data
- charts render with filled monthly values
- bars fit on mobile width

## Documentation Requirements

Update README if implementation changes:

- app behavior
- source structure only if new folders are added
- validation/test commands if changed

Follow:

- `docs/standards/ai-workflow.md`
- `docs/standards/readme-policy.md`
- `docs/standards/testing-policy.md`
