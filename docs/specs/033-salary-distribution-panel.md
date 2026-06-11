# Spec 033 - Salary Distribution Panel

## Goal

Add a read-only "Onde vai o salário" panel to the `Resumo` tab that shows, for the selected month, how each category's spending fills the monthly salary as a single stacked bar with a leftover segment. The panel is collapsed by default and expands into a scrollable per-category list that scales gracefully from a few categories to 30+.

## Context

`Resumo` already answers _"how much of my salary did I commit"_ through the commitment bar in the balance panel. It does not answer the natural follow-up: _"and where did it go"_. Today the only per-category breakdown lives in the `Gráficos` tab (`CategoryBarChart`, "Categorias no mês atual"), which requires switching tabs and shows totals, not how categories stack against the salary.

Users group accounts into categories (for example three credit cards under a "Cartão de crédito" category, or several banks under "Empréstimos") specifically to understand category weight. They want to see that weight at a glance on the main overview, with detail on demand, without the layout breaking when they have many categories.

All the math already exists (`calculateCategoryTotal`, `calculateMonthlyTotalExpenses`, `calculateAvailableIncome`) and category colors are already resolved with a deterministic fallback palette (`getCategoryColor`). This spec is composition and display only.

## Non-Goals

- Do not add the panel to `Gráficos` and do not change or replace the existing `CategoryBarChart` ("Categorias no mês atual").
- Do not let users choose which categories appear — all categories with a value in the month are included.
- Do not edit values, categories, or accounts from this panel (read-only).
- Do not add new calculation logic for category totals, salary, or expenses — reuse existing helpers.
- Do not add new dependencies.
- Do not change the backup/restore format or the data model (`FinanceState`).
- Do not change other tabs.

## Placement

The panel renders in `SummaryScreen`, inside the current-month view (`activeView === 'current'`), positioned **immediately below the balance/commitment panel** and **above the KPI grid** (Despesas / Pendente / Pago / Próximo venc.).

Rationale: the commitment bar answers "how much did I commit", the new panel answers "where did it go" right after it.

## Behavior

### Denominator and the bar

The bar represents the month's **available income** (`calculateAvailableIncome`, i.e. salary, plus current-month extra balance on the current month) — labeled as salary in the title.

- **Normal case (expenses ≤ available income):** the bar denominator is the available income. Each category segment width = `categoryTotal / availableIncome`. The remaining space is a neutral gray **leftover** segment = `(availableIncome − totalExpenses) / availableIncome`.
- **Over-budget case (expenses > available income):** there is no leftover. The bar fills 100% with the denominator switched to `totalExpenses`, so segment widths = `categoryTotal / totalExpenses`. The panel surfaces an over-limit hint (reuse the existing "Acima do limite." wording style).
- **No salary configured (available income ≤ 0):** the bar is not rendered; show the hint "Configure o salário para ver a distribuição.".
- **No expenses:** the bar is entirely the leftover segment (100% sobra).

### Tail grouping (collapsed bar only)

Category segments whose share of the bar denominator is **below 8%** are combined into a single neutral gray **"+N"** segment (N = number of grouped categories), placed after the visible category segments and before the leftover. This keeps the bar readable. The expanded list is unaffected and still shows every category individually.

### Segment labels

A label is drawn inside a segment only based on its width:

- Segment share **≥ 8%** of the bar → show **the percentage only** (e.g. `42%`). No category name (names do not fit and are shown in the expanded list).
- Segment share **< 8%** → no text.

The leftover segment shows `sobra NN%` when its share is ≥ 8%, otherwise no text. The "+N" segment shows `+N`.

### Collapsed state (default)

- Title: `Onde vai o salário · <available income>` (income masked when `valuesHidden`).
- The stacked bar (category segments + optional "+N" + leftover).
- A toggle link `ver por categoria (N)` where N is the count of categories with a value in the month. Tapping expands the panel.

### Expanded state

- The toggle becomes `ocultar`.
- Below the bar, a **scrollable** vertical list with a fixed maximum height (so the panel does not grow unbounded with many categories).
- One row per category **with a value in the month**, sorted by amount **descending**:
  - color swatch (the category color via `getCategoryColor`),
  - category name (truncated with ellipsis if long),
  - a mini progress bar (fill = `categoryTotal / largestCategoryTotal`, for visual ranking),
  - the percentage of available income (`categoryTotal / availableIncome`, or `/ totalExpenses` in the over-budget case, to match the bar), rounded,
  - the amount (masked when `valuesHidden`).
- The list shows **all** categories individually; the "+N" tail grouping applies only to the bar.

### Colors

- Category segments and list swatches use `getCategoryColor(categoryId, sortedCategories)`, which already returns the category's `color` or a deterministic fallback from the palette.
- The leftover and the "+N" tail segments use fixed neutral gray tones (distinct from each other), not a category color.

### Eye icon

All monetary values (title income, list amounts) respect the `valuesHidden` session toggle and display as masked when hidden. Percentages and bar widths are not monetary and remain visible.

## Data Builder

Add a pure helper, `buildSalaryDistribution`, in `src/lib/chartData.ts` (or a new `src/lib/salaryDistribution.ts` if it keeps `chartData.ts` focused), returning a single shape consumed by the component:

```ts
type SalaryDistributionSegment = {
  categoryId: string;
  color: string;
  label: string; // category name
  value: number; // category total for the month
  share: number; // value / denominator (0..1)
};

type SalaryDistribution = {
  availableIncome: number;
  totalExpenses: number;
  isOverBudget: boolean; // totalExpenses > availableIncome
  hasSalary: boolean; // availableIncome > 0
  denominator: number; // availableIncome (normal) or totalExpenses (over budget)
  leftover: number; // max(availableIncome - totalExpenses, 0)
  leftoverShare: number; // leftover / denominator (0 when over budget)
  segments: SalaryDistributionSegment[]; // all categories with value > 0, sorted desc
  tailGroupedCount: number; // number of segments with share < 0.08 (for the bar "+N")
};
```

- `segments` reuses the category totals and color resolution already used by `buildCurrentMonthCategoryChartData` (categories with `total > 0`, color via `getCategoryColor`), sorted by `value` descending.
- The component derives the collapsed bar (applying the 8% tail grouping) and the expanded list (all segments) from this single object.

Keeping the math in a pure builder makes it unit-testable and keeps the component focused on rendering.

## Implementation Notes

- Add `buildSalaryDistribution` to the lib layer reusing `calculateAvailableIncome`, `calculateCategoryTotals` / `calculateCategoryTotal`, `calculateMonthlyTotalExpenses`, `sortCategories`, and `getCategoryColor`.
- Add a `SalaryDistributionPanel` component in `src/components/finance/SalaryDistributionPanel.tsx`:
  - props: the `SalaryDistribution` object and `valuesHidden`.
  - owns its collapsed/expanded local state.
  - renders the stacked bar, segment labels per the width rules, the toggle link, and the scrollable expanded list with a max height.
  - follows existing panel styling (`colors`, `typography` from the theme), matching the dark theme with orange accent used elsewhere in `Resumo`.
- Update `SummaryScreen` to compute the distribution for `currentProjectionMonth` and render the panel in the current-month view, between the balance panel and the KPI grid, passing `valuesHidden`.
- No changes to `FinanceState`, storage, migration, or backup/restore.

## Tests

Unit tests for `buildSalaryDistribution`:

- Segment shares sum with leftover to 1 in the normal case.
- `leftover` and `leftoverShare` are 0 and `isOverBudget` is true when expenses exceed available income; segment shares then sum to 1 against `totalExpenses`.
- `hasSalary` is false and the structure is safe when available income is 0.
- Segments include only categories with `value > 0` and are sorted by value descending.
- `tailGroupedCount` counts segments with share below 8%.
- Category colors come from `getCategoryColor` (category color or fallback).
- Current-month available income includes the extra balance; other months use salary only.

## Acceptance Criteria

- A "Onde vai o salário" panel appears in `Resumo` (current-month view), below the commitment panel and above the KPI grid.
- Collapsed, it shows a single stacked bar of category segments plus a neutral leftover segment, with category segments colored by category color.
- Category segments below 8% of the bar are grouped into a single neutral "+N" segment in the bar; the leftover is shown separately.
- Segment labels show only the percentage and only when the segment is ≥ 8% wide; narrower segments show no text.
- A `ver por categoria (N)` link expands the panel into a scrollable per-category list with a fixed max height.
- The expanded list shows every category with a value, sorted by amount descending, each with color swatch, name, mini bar, percentage, and amount.
- Over-budget months show no leftover and an over-limit hint; the bar fills 100% scaled to total expenses.
- When no salary is configured, the bar is hidden and a configuration hint is shown.
- All monetary values respect the eye icon toggle.
- The existing `Gráficos` "Categorias no mês atual" chart is unchanged.
- TypeScript validation passes.
- Unit tests pass.

## Validation

```bash
npm run check
npm test
```
