# Plan 033 - Salary Distribution Panel

Status: Pending

## Spec

`docs/specs/033-salary-distribution-panel.md`

## Objective

Add a read-only "Onde vai o salário" panel to the `Resumo` current-month view that shows, as a single stacked bar with a leftover segment, how each category's spending fills the month's available income. The panel is collapsed by default and expands into a scrollable per-category list. All math reuses existing helpers; this is composition and display only.

## Tasks

| Task   | File                                                   | Purpose                                                                                                 |
| ------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| 033-01 | `docs/tasks/033-01-add-salary-distribution-builder.md` | Add pure `buildSalaryDistribution` helper in `src/lib/salaryDistribution.ts` with unit tests.           |
| 033-02 | `docs/tasks/033-02-add-salary-distribution-panel.md`   | Add `SalaryDistributionPanel` component (collapsed bar + expanded list) in `src/components/finance/`.   |
| 033-03 | `docs/tasks/033-03-wire-panel-into-summary.md`         | Render the panel in `SummaryScreen` current-month view, below the balance panel and above the KPI grid. |
| 033-04 | `docs/tasks/033-04-update-docs-and-validate.md`        | Update `docs/app-context.md`, run full validation.                                                      |

## Builder Shape (033-01)

`src/lib/salaryDistribution.ts` exports `buildSalaryDistribution(financeState, projectionMonth)` returning:

```ts
type SalaryDistributionSegment = {
  categoryId: string;
  color: string; // getCategoryColor
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
  segments: SalaryDistributionSegment[]; // categories with value > 0, sorted desc
  tailGroupedCount: number; // segments with share < 0.08 (bar "+N")
};
```

- Reuse `calculateAvailableIncome`, `calculateCategoryTotals`, `calculateMonthlyTotalExpenses`, `sortCategories`, and `getCategoryColor` — mirror the filtering/coloring already in `buildCurrentMonthCategoryChartData` (`src/lib/chartData.ts`).
- `denominator` is `availableIncome` in the normal case and `totalExpenses` in the over-budget case; guard divisions when `denominator <= 0`.

## Notes

- Tail grouping (`share < 0.08` → single neutral "+N" segment) and segment labels (percentage only, only when `share >= 0.08`) are derived in the **component** from the single builder object; the builder only exposes `tailGroupedCount`. The expanded list always shows every segment.
- Denominator/leftover rules: normal case leftover is neutral gray; over-budget has no leftover and bar fills 100% against `totalExpenses` with an "Acima do limite." style hint; `availableIncome <= 0` hides the bar and shows "Configure o salário para ver a distribuição."; no expenses → 100% leftover.
- Component owns its collapsed/expanded local state. Collapsed title `Onde vai o salário · <available income>` (masked when `valuesHidden`), toggle `ver por categoria (N)` / `ocultar`. Expanded list has a fixed max height and is scrollable; each row: color swatch, truncated name, mini bar (`value / largestCategoryTotal`), percentage, amount (masked).
- Leftover and "+N" segments use fixed neutral gray tones (distinct from each other), not category colors. Use `colors`/`typography` from the theme and match the dark/orange `Resumo` styling. Reuse `maskCurrency` and `percentageFormatter` from `src/lib/formatters.ts`.
- Eye toggle applies to monetary values only; percentages and bar widths stay visible.
- Do not touch `CategoryBarChart` / "Categorias no mês atual" in `Gráficos`. No `FinanceState`, storage, migration, or backup/restore changes. No new dependencies.

## Tests (033-01)

- Segment shares + leftover sum to 1 in the normal case.
- Over-budget: `leftover` and `leftoverShare` are 0, `isOverBudget` true, shares sum to 1 against `totalExpenses`.
- `hasSalary` false and structure safe when available income is 0.
- Segments include only categories with `value > 0`, sorted by value descending.
- `tailGroupedCount` counts segments with share below 8%.
- Colors come from `getCategoryColor` (category color or fallback).
- Current-month available income includes the extra balance; other months use salary only.

## Validation

- `npm run check`
- `npm test`
