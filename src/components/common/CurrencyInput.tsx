import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { EditableAmountInput } from './EditableAmountInput';

type CurrencyInputProps = {
  label: string;
  onChangeValue: (value: string) => void;
  value: number;
  valuesHidden?: boolean;
};

export function CurrencyInput({
  label,
  onChangeValue,
  value,
  valuesHidden,
}: CurrencyInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}:</Text>
      <EditableAmountInput
        onChangeValue={onChangeValue}
        style={styles.input}
        value={value}
        valuesHidden={valuesHidden}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  inputLabel: {
    color: colors.textSecondary,
    flex: 1,
    letterSpacing: 0,
    ...typography.bodySmall,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.textPrimary,
    letterSpacing: 0,
    maxWidth: 150,
    minHeight: 38,
    minWidth: 128,
    paddingHorizontal: 12,
    paddingVertical: 6,
    textAlign: 'right',
    ...typography.input,
  },
});
