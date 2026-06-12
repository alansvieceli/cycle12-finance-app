# Task 036-02 - Add Goal Status Helper

Status: Done

## Spec

`docs/specs/036-commitment-goal.md`

## Plan

`docs/plans/036-commitment-goal-plan.md`

## Goal

Add a pure `resolveGoalStatus` helper plus a presentation helper mapping status to color/label, with unit tests. Do not touch `resolveCommitmentColor`.

## Files

- Create: `src/lib/commitmentGoal.ts`
- Create: `src/lib/commitmentGoal.test.ts`

## Steps

1. Create `src/lib/commitmentGoal.ts`:

```ts
import { colors } from '../theme/colors';

export type GoalStatus = 'within' | 'near' | 'over';

const NEAR_LOWER_BOUND = 0.9;

export function resolveGoalStatus(
  commitmentRatio: number | null,
  goalFraction: number,
): GoalStatus | null {
  if (commitmentRatio === null) return null;
  if (goalFraction <= 0) return null;

  const ratio = commitmentRatio / goalFraction;
  if (ratio < NEAR_LOWER_BOUND) return 'within';
  if (ratio <= 1) return 'near';
  return 'over';
}

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  within: 'dentro da meta',
  near: 'quase na meta',
  over: 'acima da meta',
};

export function resolveGoalStatusColor(status: GoalStatus): string {
  switch (status) {
    case 'within':
      return colors.commitmentLow;
    case 'near':
      return colors.commitmentMedium;
    case 'over':
      return colors.commitmentHigh;
  }
}
```

Adjust the import path/names for `colors` to match the actual theme module used by `resolveCommitmentColor` (`src/lib/commitmentColor.ts`) — reuse the same color constants (`commitmentLow`/`commitmentMedium`/`commitmentHigh`) so goal tag colors are visually consistent with the existing semaphore, without calling `resolveCommitmentColor` itself.

2. Create `src/lib/commitmentGoal.test.ts` covering:
   - `commitmentRatio / goalFraction < 0.90` → `'within'`.
   - Ratio between `0.90` and `1.00` inclusive → `'near'` (test both bounds: exactly `0.90` and exactly `1.00`).
   - Ratio `> 1.00` → `'over'`.
   - `goalFraction === 0` (unset goal) → `null`.
   - `commitmentRatio === null` (no income) → `null`.
   - `resolveGoalStatusColor` returns the correct color for each status.

3. Run `npx tsc --noEmit` and `npm test -- commitmentGoal`.

## Acceptance Criteria

- `src/lib/commitmentGoal.ts` exports `GoalStatus`, `resolveGoalStatus`, `GOAL_STATUS_LABELS`, `resolveGoalStatusColor`.
- `resolveGoalStatus` is pure and matches the `c/g` band rules exactly, including inclusive bounds for `near`.
- `resolveCommitmentColor` and `src/lib/commitmentColor.ts` are unchanged.
- Unit tests in `src/lib/commitmentGoal.test.ts` cover all listed cases and pass.
- TypeScript compilation passes.
