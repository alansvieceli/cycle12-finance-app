import { StyleSheet, Text, View } from 'react-native';

import { EditableAmountInput } from './EditableAmountInput';

type CurrencyInputProps = {
  label: string;
  onChangeValue: (value: string) => void;
  value: number;
};

export function CurrencyInput({
  label,
  onChangeValue,
  value,
}: CurrencyInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <EditableAmountInput
        onChangeValue={onChangeValue}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    color: '#60716d',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#f7faf9',
    borderColor: '#c9d6d2',
    borderRadius: 8,
    borderWidth: 1,
    color: '#17211f',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
    minHeight: 48,
    paddingHorizontal: 12,
  },
});
