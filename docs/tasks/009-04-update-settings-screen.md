# Task 009-04 - Update Settings Screen

## Plan Reference

`docs/plans/009-commitment-color-thresholds-plan.md`

## Spec Reference

`docs/specs/009-commitment-color-thresholds.md`

## Objective

Add two threshold input fields to `SettingsScreen` so the user can configure the warning and danger commitment percentages.

## Steps

1. In `src/screens/SettingsScreen.tsx`, add two new inputs after the existing `Meses no resumo` field.

   Each input should follow the same pattern as `VisibleMonthCountInput`:
   - Local draft state for in-progress editing.
   - On blur: parse as integer, clamp 0–100, call the corresponding action.
   - `keyboardType="numeric"`.
   - `placeholder` showing the default value (`"80"` and `"90"`).

2. Labels and hints:
   - Warning: label `ALERTA DE COMPROMETIMENTO`, hint `0 a 100. Deixe 0 para desativar.`
   - Danger: label `PERIGO DE COMPROMETIMENTO`, hint `0 a 100. Deixe 0 para desativar.`

3. Wire inputs to `actions.updateCommitmentWarningThreshold` and `actions.updateCommitmentDangerThreshold`.

4. Display current values from `financeState.settings.commitmentWarningThreshold` and `financeState.settings.commitmentDangerThreshold`.

## Acceptance Criteria

- Both inputs are visible in the Settings tab.
- Changing a value and blurring the field updates the stored setting.
- Values are clamped to 0–100.
- Labels and hints match the spec.

## Validation

- `npx tsc --noEmit` passes with no errors.
- `npm test` passes.
