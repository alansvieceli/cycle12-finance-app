# Task 036-07 - Update Docs and Validate

Status: Done

## Spec

`docs/specs/036-commitment-goal.md`

## Plan

`docs/plans/036-commitment-goal-plan.md`

## Goal

Update `docs/app-context.md` (and `README.md` if it documents settings/screens) to describe the commitment goal feature, then run full validation.

## Files

- Modify: `docs/app-context.md`
- Modify (if applicable): `README.md`

## Steps

1. Read `docs/app-context.md` and add/update sections describing:
   - The new `commitmentGoal` setting (0-100, default 70, 0 = unset) in `FinanceSettings`.
   - The `Resumo` balance panel's neutral meta marker on the commitment bar and the `GoalTag` status (`dentro da meta` / `quase na meta` / `acima da meta`), derived from `c/g` vs. the existing alert thresholds (unchanged).
   - `GoalTag` appearing in Projeção and Histórico.
   - The `Gráficos` "Comprometimento por mês" chart's meta line and bottom `meta NN%` legend.
   - The new `Meta de comprometimento` field in `Ajustes`.
2. If `README.md` documents settings fields or screens at a similar level of detail to other recent specs (035, 034, etc.), add a brief equivalent mention; otherwise skip.
3. Run full validation:
   ```bash
   npm run check
   npm test
   ```
4. Fix any failures surfaced by validation that relate to this spec's changes (036-01..036-06). Do not fix unrelated pre-existing failures — note them instead (see memory: pre-existing `expo-asset` test failure from spec 032).

## Acceptance Criteria

- `docs/app-context.md` accurately describes the commitment goal feature end-to-end (data model, Resumo, Projeção, Histórico, Gráficos, Ajustes).
- `npm run check` passes.
- `npm test` passes (aside from the known pre-existing `expo-asset` failure, if still present).
