import { StyleSheet, Text, View } from 'react-native';

import {
  GOAL_STATUS_LABELS,
  type GoalStatus,
  resolveGoalStatusColor,
} from '../../lib/commitmentGoal';
import { typography } from '../../theme/typography';

type GoalTagProps = {
  status: GoalStatus | null;
};

export function GoalTag({ status }: GoalTagProps) {
  if (status === null) {
    return null;
  }

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
    width: 112,
    paddingVertical: 3,
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
