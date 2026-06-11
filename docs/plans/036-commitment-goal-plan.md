# Plan 036 - Commitment Goal

Status: Pending

## Spec

`docs/specs/036-commitment-goal.md`

## Objective

Let the user set a personal commitment goal (target % of income to stay under). Surface whether the current month is within, near, or over the goal via a neutral meta marker on the commitment bar and a fixed-width colored status tag in `Resumo`, Projeção, Histórico, and the `Gráficos` "Comprometimento por mês" chart — **without changing the existing commitment color semaphore or thresholds**.

## Tasks

| Task   | File                                                  | Purpose                                                                                                    |
| ------ | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 036-01 | `docs/tasks/036-01-add-commitment-goal-setting.md`    | Add `commitmentGoal` to `FinanceSettings`, defaults, migration, and backup/restore validation, with tests. |
| 036-02 | `docs/tasks/036-02-add-goal-status-helper.md`         | Add pure `resolveGoalStatus` + status→color/label presentation helper, with unit tests.                    |
| 036-03 | `docs/tasks/036-03-add-goal-tag-component.md`         | Add reusable fixed-width `GoalTag` component.                                                              |
| 036-04 | `docs/tasks/036-04-wire-resumo-projecao-historico.md` | Add the meta marker + `GoalTag` to the balance panel; add `GoalTag` to Projeção and Histórico.             |
| 036-05 | `docs/tasks/036-05-wire-charts-meta-line.md`          | Add the vertical meta line + bottom `meta NN%` legend to `MonthlyCommitmentList` / `ChartsScreen`.         |
| 036-06 | `docs/tasks/036-06-add-ajustes-goal-field.md`         | Add the `Meta de comprometimento` (0–100%) field in `Ajustes` and an `updateCommitmentGoal` action.        |
| 036-07 | `docs/tasks/036-07-update-docs-and-validate.md`       | Update `docs/app-context.md` and `README.md`, run full validation.                                         |

## Data Model (036-01)

Add to `FinanceSettings`:

```ts
commitmentGoal: number; // target commitment percentage, e.g. 70; default 70
```

- Range 0–100; `0` means unset (all goal visuals hidden).
- `createDefaultFinanceSettings` (default 70), `emptyFinanceState`, and the settings normalizer in `src/lib/financeBackup.ts` (`normalizeSettings` already spreads `defaultSettings` first, so existing installs without the field migrate to 70).
- Add `commitmentGoal` to `validateSettings` in `financeBackup.ts` via `validatePercent`.

## Status Rule (036-02)

Given commitment ratio `c` (fraction) and goal `g` (fraction), derive from `c / g`:

- `c / g < 0.90` → `within` → green, `dentro da meta`
- `0.90 ≤ c / g ≤ 1.00` → `near` → yellow, `quase na meta`
- `c / g > 1.00` → `over` → red, `acima da meta`

`resolveGoalStatus(commitmentRatio, goalFraction)` returns `'within' | 'near' | 'over' | null`; returns `null` when goal is 0 (unset) or commitment is `null` (no income). A separate presentation helper maps status → color + label.

## Notes

- `Resumo` balance panel (current month): a thin neutral (light gray) vertical "risco" marker crossing the existing commitment bar at `goal%` of the track width (hidden when unset); bar fill color unchanged. The `GoalTag` renders **below** the existing status hint text, on its own line.
- Projeção (other months) and Histórico show **only** the status tag for their month — no bar marker, no extra text. Projeção uses the selected month's commitment; Histórico uses each entry's `totalExpenses ÷ totalIncome`. Wire `GoalTag` into `MonthSummaryCard` (Projeção) and `HistoryCard` (Histórico).
- `Gráficos` "Comprometimento por mês": reuse `MonthlyCommitmentList`; add one vertical meta line across the bar track at `goal%` and a discreet bottom legend (short line swatch + `meta 70%` using the configured goal). Title and per-bar colors unchanged; legend not above/under the title; hidden when unset.
- `GoalTag` is fixed-width so all three states render identically in size; the three labels share a parallel structure.
- Do NOT touch `resolveCommitmentColor` or the `commitmentWarningThreshold` / `commitmentDangerThreshold` settings or the bar coloring. Do not show a "how much I can still commit" amount; no per-category budgets; no new dependencies or charts.
- `Ajustes` field sits near the existing salary / threshold settings; editing updates the marker, tag, and chart line everywhere via the new `updateCommitmentGoal` action in `useFinanceState` (clamp 0–100, same pattern as `updateCommitmentThreshold`).

## Tests (036-02 / 036-01)

- Ratio below 90% of goal → `within`.
- Ratio between 90% and 100% of goal (inclusive) → `near`.
- Ratio above 100% of goal → `over`.
- Goal of 0 (unset) → `null`; null commitment (no income) → `null`.
- Backup round-trip preserves `commitmentGoal`; missing field migrates to 70.

## Validation

- `npm run check`
- `npm test`
