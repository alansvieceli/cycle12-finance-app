# Task 036-03 - Add Goal Tag Component

Status: Done

## Spec

`docs/specs/036-commitment-goal.md`

## Plan

`docs/plans/036-commitment-goal-plan.md`

## Goal

Add a reusable, fixed-width `GoalTag` component that renders the colored status label (`dentro da meta` / `quase na meta` / `acima da meta`) for a given `GoalStatus`, or renders nothing when status is `null`.

## Files

- Create: `src/components/finance/GoalTag.tsx`

## Steps

1. Create `src/components/finance/GoalTag.tsx`:

```tsx
import { StyleSheet, Text, View } from 'react-native';
import {
  GOAL_STATUS_LABELS,
  GoalStatus,
  resolveGoalStatusColor,
} from '../../lib/commitmentGoal';
import { typography } from '../../theme/typography';

type GoalTagProps = {
  status: GoalStatus | null;
};

export function GoalTag({ status }: GoalTagProps) {
  if (status === null) return null;

  const color = resolveGoalStatusColor(status);

  return (
    <View style={[styles.tag, { borderColor: color }]}>
      <Text style={[styles.label, { color }]}>{GOAL_STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    width: 110,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
  },
  label: {
    ...typography.label,
    fontSize: 11,
    textAlign: 'center',
  },
});
```

Adjust the import paths for `typography`/`colors` to match actual module locations used by sibling components (`MonthSummaryCard.tsx`, `HistoryCard.tsx`). Tune the fixed `width` so all three labels (`dentro da meta`, `quase na meta`, `acima da meta`) fit without wrapping at the project's default font size — verify by rendering all three in a quick manual check (e.g. temporarily mount in `SummaryScreen` or a snapshot test) and adjust the width constant if needed.

2. No dedicated unit test is required (presentational component), but ensure `npx tsc --noEmit` passes.

## Acceptance Criteria

- `GoalTag` renders `null` when `status` is `null`.
- `GoalTag` renders a fixed-width, pill-shaped tag with the correct label and color for `within`/`near`/`over`, all rendering at the same size.
- TypeScript compilation passes.
