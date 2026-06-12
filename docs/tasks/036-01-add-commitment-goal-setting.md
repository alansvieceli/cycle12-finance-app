# Task 036-01 - Add Commitment Goal Setting

Status: Done

## Spec

`docs/specs/036-commitment-goal.md`

## Plan

`docs/plans/036-commitment-goal-plan.md`

## Goal

Add `commitmentGoal` (0-100, default 70) to `FinanceSettings`, defaults, backup/restore validation, and ensure existing installs migrate to 70.

## Files

- Modify: `src/types/finance.ts`
- Modify: `src/lib/financeBackup.ts`
- Modify (tests): `src/lib/financeBackup.test.ts`

## Steps

1. In `src/types/finance.ts`, add `commitmentGoal: number;` to the `FinanceSettings` type, near `commitmentWarningThreshold`/`commitmentDangerThreshold`.
2. In `createDefaultFinanceSettings`, add `commitmentGoal: 70,`.
3. In `src/lib/financeBackup.ts`:
   - `normalizeSettings` already spreads `defaultSettings` first then `currentSettings`, so missing `commitmentGoal` on existing installs automatically migrates to `70` — no extra code needed there, but verify by reading the function.
   - In `validateSettings`, add `commitmentGoal: validatePercent(value.commitmentGoal, 'Meta de comprometimento inválida.'),` alongside the existing `commitmentWarningThreshold`/`commitmentDangerThreshold` entries.
4. In `src/lib/financeBackup.test.ts`, add/extend tests:
   - A backup containing `commitmentGoal` round-trips correctly through validate/normalize.
   - A backup missing `commitmentGoal` (simulating a pre-036 install) normalizes to `70`.
   - `validateSettings` rejects an out-of-range `commitmentGoal` (e.g. `-1` or `101`) the same way it rejects invalid thresholds.
5. Run `npx tsc --noEmit` and `npm test -- financeBackup`.

## Acceptance Criteria

- `FinanceSettings.commitmentGoal` exists, defaulting to `70` via `createDefaultFinanceSettings` and `emptyFinanceState`.
- Backups missing `commitmentGoal` normalize to `70`; out-of-range values are rejected by `validateSettings`.
- TypeScript compilation passes.
- `financeBackup.test.ts` passes including new cases.
