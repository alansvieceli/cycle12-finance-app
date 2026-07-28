import { useCallback, useEffect, useRef, useState } from 'react';
import { type StyleProp, TextInput, type TextStyle } from 'react-native';
import CurrencyInput from 'react-native-currency-input';

import { MAX_CURRENCY_AMOUNT } from '../../lib/inputParsers';
import { colors } from '../../theme/colors';

const CHANGE_DEBOUNCE_MS = 250;

type EditableAmountInputProps = {
  autoFocus?: boolean;
  /** Emit on every keystroke instead of debounced. Use when a confirm button reads the value right away. */
  immediate?: boolean;
  onChangeValue: (value: number) => void;
  placeholder?: string;
  style?: StyleProp<TextStyle>;
  value: number;
  valuesHidden?: boolean;
};

// zero maps to null so the field renders empty and the gray "0,00"
// placeholder shows through; the first typed digit starts the mask fresh
function draftFromAmount(amount: number) {
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

export function EditableAmountInput({
  autoFocus,
  immediate = false,
  onChangeValue,
  placeholder = '0,00',
  style,
  value,
  valuesHidden = false,
}: EditableAmountInputProps) {
  const [draftValue, setDraftValue] = useState<number | null>(draftFromAmount(value));
  const [isFocused, setIsFocused] = useState(false);
  const pendingEmitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAmount = useRef<number | null>(null);
  const emitValue = useRef(onChangeValue);

  useEffect(() => {
    emitValue.current = onChangeValue;
  }, [onChangeValue]);

  const flushPendingEmit = useCallback(() => {
    if (pendingEmitTimer.current) {
      clearTimeout(pendingEmitTimer.current);
      pendingEmitTimer.current = null;
    }

    if (pendingAmount.current !== null) {
      const amount = pendingAmount.current;
      pendingAmount.current = null;
      emitValue.current(amount);
    }
  }, []);

  // flush on unmount so a value typed right before navigating away is not lost
  useEffect(() => flushPendingEmit, [flushPendingEmit]);

  useEffect(() => {
    if (!isFocused && pendingAmount.current === null) {
      setDraftValue(draftFromAmount(value));
    }
  }, [isFocused, value]);

  function handleChangeValue(nextValue: number | null) {
    setDraftValue(nextValue);
    pendingAmount.current = nextValue ?? 0;

    if (immediate) {
      flushPendingEmit();
      return;
    }

    if (pendingEmitTimer.current) {
      clearTimeout(pendingEmitTimer.current);
    }

    pendingEmitTimer.current = setTimeout(flushPendingEmit, CHANGE_DEBOUNCE_MS);
  }

  if (valuesHidden && !isFocused) {
    return (
      <TextInput
        caretHidden
        keyboardType="number-pad"
        onFocus={() => setIsFocused(true)}
        style={style}
        value="• • •"
      />
    );
  }

  return (
    <CurrencyInput
      autoFocus={autoFocus || (valuesHidden && isFocused)}
      delimiter="."
      keyboardType="number-pad"
      maxValue={MAX_CURRENCY_AMOUNT}
      minValue={0}
      onBlur={() => {
        setIsFocused(false);
        flushPendingEmit();
      }}
      onChangeValue={handleChangeValue}
      onFocus={() => setIsFocused(true)}
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      precision={2}
      separator=","
      style={style}
      value={draftValue}
    />
  );
}
