# Spec 036 - Commitment Goal

## Goal

Let the user set a personal **commitment goal** — a target percentage of income they want their spending to stay under (for example "spend at most 70% of what I earn"). The app shows whether the current month is within, near, or over that goal, without changing the existing commitment color semaphore.

## Context

The balance panel in `Resumo` already shows a commitment bar (expenses ÷ available income) colored by two alert thresholds (`commitmentWarningThreshold`, `commitmentDangerThreshold`, default 70/90), which only drive the bar color. The `Gráficos` tab shows a per-month commitment list (`MonthlyCommitmentList`).

What the app lacks is a forward-looking **goal**: a number the user aspires to ("I want to keep spending under 70% of income, so I know how much I can still commit"). The alert thresholds are a semaphore, not a goal. This spec adds the goal as a distinct concept and surfaces it, explicitly **without altering today's color scheme**.

## Non-Goals

- Do not change or reuse the existing alert thresholds or the commitment bar coloring. The semaphore stays exactly as it is today.
- Do not show a "how much I can still commit" amount (explicitly dropped during design).
- Do not add per-category budgets (this replaced an earlier per-category idea).
- Do not add new dependencies or new charts — reuse the existing commitment bar and the existing `MonthlyCommitmentList`.
- Do not include the goal in a place that changes backup shape incompatibly beyond the new settings field.

## Data Model

Add one field to `FinanceSettings`:

```ts
type FinanceSettings = {
  ...
  commitmentGoal: number; // target commitment percentage, e.g. 70; default 70
};
```

- Range 0–100. When `0`, the goal is considered unset and all goal visuals are hidden.
- Included in backup/restore and in the settings migration (existing installs default to `70`).

## Status Rule (the tag)

Given the month's commitment ratio `c` (expenses ÷ available income, as a fraction) and the goal `g` (as a fraction, e.g. 0.70), the status is derived from `c / g`:

- `c / g < 0.90` → **green**, label `dentro da meta`
- `0.90 ≤ c / g ≤ 1.00` → **yellow**, label `quase na meta`
- `c / g > 1.00` → **red**, label `acima da meta`

When the goal is unset (`0`) or commitment cannot be computed (no income), no tag is shown.

The three labels share a parallel structure and the tag is rendered at a fixed width so all states look identical in size.

## UX Behavior

### Resumo — balance panel (current month)

- **Meta marker on the commitment bar:** a thin vertical line ("risco") crossing the existing commitment bar at the goal position (`goal%` of the track width). The bar's fill color is unchanged. The marker is neutral (light gray). Hidden when the goal is unset.
- **Status tag:** the colored status tag (per the rule above) is placed **below** the existing status hint text ("Dentro dos limites…" / "Acima do limite. Revise cartão e empréstimos."), on its own line, so it never breaks or crowds that text.

### Resumo — Projeção (other months) and Histórico

- Show **only the status tag** for the relevant month (no bar marker, no extra text).
  - Projeção: tag for the selected projected month's commitment vs the goal.
  - Histórico: tag for each history entry, using its `totalExpenses ÷ totalIncome` vs the goal.

### Gráficos — "Comprometimento por mês" (existing list)

- Reuse the existing `MonthlyCommitmentList`. Add a single **vertical meta line** crossing the bars at the goal position (`goal%` of the bar track width). Bar colors are unchanged.
- Add a discreet legend **at the bottom** of the chart panel: a short line swatch + `meta 70%` (using the configured goal). The chart **title is unchanged** ("Comprometimento por mês"). The legend is not placed above/under the title.
- Hidden when the goal is unset.

### Ajustes

- Add a `Meta de comprometimento` field (0–100%) near the existing salary / threshold settings. Editing it updates the marker, tag, and chart line everywhere.

## Implementation Notes

- Add `commitmentGoal` to `FinanceSettings`, `createDefaultFinanceSettings` (default 70), `emptyFinanceState`, settings migration (default 70 for existing installs), and backup/restore validation.
- Add a pure helper, e.g. `resolveGoalStatus(commitmentRatio, goalFraction)`, returning `'within' | 'near' | 'over' | null`, applying the `c/g` bands above. Keep it pure and unit-tested. Map status → color + label in a small presentation helper.
- Add a reusable `GoalTag` component (fixed width) used by the balance panel, Projeção, and Histórico.
- Update the balance panel in `SummaryScreen` to render the vertical meta marker over the commitment bar and the `GoalTag` below the hint text.
- Update the Projeção and Histórico views to render `GoalTag` for their respective months.
- Update `MonthlyCommitmentList` (and/or its container in `ChartsScreen`) to draw the vertical meta line across the bar track and a bottom legend with the goal value. The goal line is a neutral overlay; existing per-bar colors are untouched.
- Do not touch `resolveCommitmentColor` or the threshold settings.

## Tests

Unit tests for `resolveGoalStatus`:

- Ratio below 90% of goal → `within`.
- Ratio between 90% and 100% of goal (inclusive bounds) → `near`.
- Ratio above 100% of goal → `over`.
- Goal of 0 (unset) → `null`.
- Null commitment (no income) → `null`.

## Acceptance Criteria

- A `Meta de comprometimento` setting (0–100%) exists in `Ajustes`, default 70%.
- The commitment bar in the `Resumo` balance panel shows a neutral vertical meta marker at the goal position; the bar's color scheme is unchanged.
- A fixed-width status tag appears below the status hint text: green `dentro da meta`, yellow `quase na meta`, red `acima da meta`, per the `c/g` bands.
- Projeção and Histórico show only the status tag for their respective months.
- The existing "Comprometimento por mês" chart shows a single vertical meta line across the bars plus a bottom legend `meta NN%`; its title and bar colors are unchanged.
- All goal visuals are hidden when the goal is unset (0) or commitment cannot be computed.
- The goal persists in backup/restore; existing installs migrate to default 70%.
- The existing alert thresholds and commitment coloring are unaffected.
- TypeScript validation passes.
- Unit tests pass.

## Validation

```bash
npm run check
npm test
```
