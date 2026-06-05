# Spec 011 - Gifted Charts Visual Upgrade

## Objective

Upgrade the `Gráficos` tab from simple view-based charts to richer chart types using `react-native-gifted-charts`, while keeping the tab read-only, local-only, and focused on quick financial understanding.

## Context

Spec 008 introduced the first `Gráficos` tab with simple React Native view-based charts and intentionally avoided a chart dependency. The user now wants to improve the chart visuals:

| Current Insight         | New Chart Type              |
| ----------------------- | --------------------------- |
| Sobra ou Falta por mês  | Positive/negative columns   |
| Despesas por mês        | Line chart with filled area |
| Categorias do mês atual | Donut chart                 |

This direction makes sense for the app because each proposed chart type matches the financial question it answers:

- positive/negative columns make monthly surplus and shortfall easy to compare around a zero baseline
- a line with filled area communicates expense trend and volume over time better than repeated bars
- a donut chart helps compare category share within the current month

The tradeoff is that adding `react-native-gifted-charts` increases dependency surface and requires manual validation on Android. The implementation should only proceed if the library works with the current Expo/React Native version without adding unnecessary extra services or architectural complexity.

## Goals

- Add `react-native-gifted-charts` as the chart rendering library.
- Replace the existing simple charts in the `Gráficos` tab with gifted chart components.
- Show monthly surplus/shortfall as positive and negative columns.
- Show monthly expenses as a line chart with filled area.
- Show current-month category totals as a donut chart.
- Reuse existing finance calculation and chart data helper logic where possible.
- Keep charts read-only.
- Keep the charts usable on Android mobile screen widths.
- Keep empty and zero-data states clear and stable.

## Non-goals

- Do not change finance calculations.
- Do not change stored finance data.
- Do not add backend code.
- Do not add authentication.
- Do not add paid services.
- Do not add export/share behavior.
- Do not add interactive drill-downs in this spec.
- Do not add a dashboard outside the existing `Gráficos` tab.
- Do not replace the app navigation structure.

## Dependency Rules

- Add only the minimum dependency or dependencies required for `react-native-gifted-charts` to work.
- Before implementation, verify the library compatibility with the current Expo and React Native versions in `package.json`.
- If the library requires a peer dependency such as `react-native-svg`, document and install it only if required.
- Do not add an alternative chart library in the same task.
- If compatibility is blocked, stop and document the blocker instead of building a custom replacement under this spec.

## Chart Requirements

### Sobra Ou Falta Por Mes

Use a positive/negative column chart.

Expected behavior:

- Each visible month appears as one column.
- Positive values render above the baseline.
- Negative values render below the baseline.
- Positive values use the app positive finance color.
- Negative values use the app negative finance color.
- The zero baseline is visible enough to understand the split.
- Labels show compact month names.
- The panel still shows the total surplus or shortfall for the visible period.
- Empty data does not crash and shows an appropriate empty state.

### Despesas Por Mes

Use a line chart with filled area.

Expected behavior:

- Uses the same visible projection months as `Resumo`.
- Each visible month appears as one point in the line series.
- The line uses the app accent or chart expense color.
- The area fill is subtle and must not reduce label readability.
- The chart handles all-zero values without rendering misleading spikes.
- The panel still shows the total expenses for the visible period.
- Empty data does not crash and shows an appropriate empty state.

### Categorias Do Mes Atual

Use a donut chart.

Expected behavior:

- Uses category totals for the current projection month.
- Shows only categories with values greater than zero unless showing zero categories is necessary for clarity.
- Each visible category has a distinct, readable segment color.
- The donut center may show the total current-month category amount.
- A legend or adjacent list maps segment colors to category names and amounts.
- Long category names must not overflow on mobile width.
- If there are no category values, show an empty state instead of an empty donut.

## Visual Rules

- Charts should follow the active app theme.
- If Spec 010 is implemented, charts must use the dark theme tokens.
- If Spec 010 is not implemented yet, charts must still fit the current light theme without hard-coding future-only colors.
- Avoid overly dense labels; prefer compact month labels and formatted currency in summaries.
- Chart panels must not become wider than the mobile viewport.
- Legends should be scannable and not rely on color alone when amounts are important.

## Data Rules

Charts should continue to use:

- configured visible months
- existing category/account/monthly value data
- existing current-month extra balance rules
- existing salary and finance settings

Charts must not mutate finance state.

## Implementation Notes

Recommended implementation:

- Keep pure chart data helpers under `src/lib/`.
- Add or adjust adapter helpers that convert app chart data into `react-native-gifted-charts` data shapes.
- Keep unit tests focused on pure data mapping and financial values.
- Keep gifted chart usage inside chart components under `src/components/finance/`.
- Preserve `ChartsScreen` as the owner of the tab layout.
- Avoid mixing chart library adoption with unrelated visual refactors.

## Acceptance Criteria

- `react-native-gifted-charts` is added only after compatibility is verified.
- The `Gráficos` tab remains read-only.
- `Sobra ou Falta por mês` renders as positive/negative columns.
- Positive monthly surplus values are visually distinct from negative shortfall values.
- `Despesas por mês` renders as a line chart with a filled area.
- `Categorias do mês atual` renders as a donut chart.
- Category donut includes a readable legend or list with category names and amounts.
- All charts respect the configured visible month range where applicable.
- All charts handle empty data without crashing.
- All charts fit Android mobile width without clipped labels or horizontal overflow.
- No finance calculation behavior changes.
- TypeScript validation passes.
- Existing tests pass.
- Unit tests cover any new pure chart data adapter logic.

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

- charts render with empty data
- charts render with filled data
- positive and negative columns align around a visible baseline
- the expense line and area render without hiding labels
- donut chart renders category shares correctly
- legend text fits on mobile width
- tab scrolling remains smooth enough for normal use

## Documentation Requirements

Update `README.md` after implementation to mention:

- `react-native-gifted-charts` as the chart library
- the three chart types in the `Gráficos` tab
- any new validation or setup notes caused by chart dependencies

Follow:

- `docs/standards/ai-workflow.md`
- `docs/standards/readme-policy.md`
- `docs/standards/testing-policy.md`
