import { colors } from '../theme/colors';

export type GoalStatus = 'within' | 'near' | 'over';

const NEAR_LOWER_BOUND = 0.9;

export function resolveGoalStatus(
  commitmentRatio: number | null,
  goalFraction: number,
): GoalStatus | null {
  if (commitmentRatio === null) {
    return null;
  }

  if (goalFraction <= 0) {
    return null;
  }

  const ratio = commitmentRatio / goalFraction;

  if (ratio < NEAR_LOWER_BOUND) {
    return 'within';
  }

  if (ratio <= 1) {
    return 'near';
  }

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
