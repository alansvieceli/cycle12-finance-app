import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

type SummaryValueProps = {
  amountStyle?: StyleProp<TextStyle>;
  color?: string | null;
  label: string;
  tileStyle?: StyleProp<ViewStyle>;
  value: string;
};

export function SummaryValue({
  amountStyle,
  color,
  label,
  tileStyle,
  value,
}: SummaryValueProps) {
  return (
    <View style={[styles.tile, tileStyle]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.amount, amountStyle, color ? { color } : null]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    flex: 1,
    minHeight: 64,
    padding: 12,
  },
  label: {
    color: colors.textSecondary,
    letterSpacing: 0,
    textTransform: 'uppercase',
    ...typography.label,
  },
  amount: {
    color: colors.textPrimary,
    letterSpacing: 0,
    marginTop: 8,
    ...typography.cardTitle,
  },
});
