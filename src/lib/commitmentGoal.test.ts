import { colors } from '../theme/colors';
import { resolveGoalStatus, resolveGoalStatusColor } from './commitmentGoal';

describe('resolveGoalStatus', () => {
  it('returns "within" when commitment is comfortably below the goal', () => {
    expect(resolveGoalStatus(0.5, 0.7)).toBe('within');
  });

  it('returns "near" at the lower bound (90% of goal)', () => {
    expect(resolveGoalStatus(0.63, 0.7)).toBe('near');
  });

  it('returns "near" at the upper bound (100% of goal)', () => {
    expect(resolveGoalStatus(0.7, 0.7)).toBe('near');
  });

  it('returns "over" when commitment exceeds the goal', () => {
    expect(resolveGoalStatus(0.8, 0.7)).toBe('over');
  });

  it('returns null when the goal is unset (0)', () => {
    expect(resolveGoalStatus(0.5, 0)).toBeNull();
  });

  it('returns null when commitment cannot be computed (no income)', () => {
    expect(resolveGoalStatus(null, 0.7)).toBeNull();
  });
});

describe('resolveGoalStatusColor', () => {
  it('maps each status to the expected color', () => {
    expect(resolveGoalStatusColor('within')).toBe(colors.commitmentLow);
    expect(resolveGoalStatusColor('near')).toBe(colors.commitmentMedium);
    expect(resolveGoalStatusColor('over')).toBe(colors.commitmentHigh);
  });
});
