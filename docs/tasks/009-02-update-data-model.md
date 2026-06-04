# Task 009-02 - Update Data Model

## Plan Reference

`docs/plans/009-commitment-color-thresholds-plan.md`

## Spec Reference

`docs/specs/009-commitment-color-thresholds.md`

## Objective

Add `commitmentWarningThreshold` and `commitmentDangerThreshold` to the finance data model, persistence defaults, and state hook actions.

## Steps

1. In `src/types/finance.ts`, add two fields to `FinanceSettings`:
   - `commitmentWarningThreshold: number`
   - `commitmentDangerThreshold: number`

2. In `src/types/finance.ts`, update `emptyFinanceState.settings` to include:
   - `commitmentWarningThreshold: 80`
   - `commitmentDangerThreshold: 90`

3. In `src/storage/financeStorage.ts`, the `normalizeFinanceState` function already spreads `emptyFinanceState.settings` first — no extra changes needed there, since the new fields will be included via the defaults. Verify the spread pattern still covers the new fields correctly.

4. In `src/hooks/useFinanceState.ts`, add two actions:
   - `updateCommitmentWarningThreshold(value: string): void`
   - `updateCommitmentDangerThreshold(value: string): void`

   Each action should parse the input as an integer, clamp to 0–100, and update the corresponding settings field. If the parsed value is NaN, leave the field unchanged or default to 0.

## Acceptance Criteria

- `FinanceSettings` type has both new fields.
- `emptyFinanceState.settings` includes `commitmentWarningThreshold: 80` and `commitmentDangerThreshold: 90`.
- `normalizeFinanceState` correctly applies defaults for old persisted data missing these fields.
- `useFinanceState` exposes `updateCommitmentWarningThreshold` and `updateCommitmentDangerThreshold` actions.

## Validation

- `npx tsc --noEmit` passes with no errors.
- `npm test` passes.
