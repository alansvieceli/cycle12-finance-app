import { useEffect, useState } from 'react';
import { StyleProp, TextInput, TextStyle } from 'react-native';

import { formatEditableAmount } from '../../lib/formatters';
import { parseCurrencyInput } from '../../lib/inputParsers';
import { colors } from '../../theme/colors';

type EditableAmountInputProps = {
  onChangeValue: (value: string) => void;
  placeholder?: string;
  style?: StyleProp<TextStyle>;
  value: number;
  valuesHidden?: boolean;
};

export function EditableAmountInput({
  onChangeValue,
  placeholder = '0,00',
  style,
  value,
  valuesHidden = false,
}: EditableAmountInputProps) {
  const [draftValue, setDraftValue] = useState(formatEditableAmount(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDraftValue(formatEditableAmount(value));
    }
  }, [isFocused, value]);

  function handleChangeText(nextValue: string) {
    setDraftValue(nextValue);
    onChangeValue(nextValue);
  }

  function handleBlur() {
    setIsFocused(false);
    setDraftValue(formatEditableAmount(parseCurrencyInput(draftValue)));
  }

  return (
    <TextInput
      keyboardType="decimal-pad"
      onBlur={handleBlur}
      onChangeText={handleChangeText}
      onFocus={() => setIsFocused(true)}
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      style={style}
      value={valuesHidden && !isFocused ? '• • •' : draftValue}
    />
  );
}
