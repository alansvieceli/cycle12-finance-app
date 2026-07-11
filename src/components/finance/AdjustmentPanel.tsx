import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { maskCurrency } from '../../lib/formatters';
import {
  calculateAdjustedMonthlyValue,
  type MonthlyValueAdjustmentOperation,
} from '../../lib/monthlyValueAdjustments';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { EditableAmountInput } from '../common/EditableAmountInput';

type AdjustmentPanelProps = {
  adjustmentAmount: number;
  adjustmentMode: MonthlyValueAdjustmentOperation;
  /** Extra content rendered between the amount field and the action buttons. */
  children?: ReactNode;
  currentAmount: number;
  onCancel: () => void;
  onChangeAmount: (value: number) => void;
  onConfirm: () => void;
  onSwitchMode: (mode: MonthlyValueAdjustmentOperation) => void;
  valuesHidden: boolean;
};

export function adjustmentModeColor(mode: MonthlyValueAdjustmentOperation) {
  return mode === 'add' ? colors.accent : colors.negative;
}

export function AdjustmentPanel({
  adjustmentAmount,
  adjustmentMode,
  children,
  currentAmount,
  onCancel,
  onChangeAmount,
  onConfirm,
  onSwitchMode,
  valuesHidden,
}: AdjustmentPanelProps) {
  const activeColor = adjustmentModeColor(adjustmentMode);

  return (
    <>
      <View style={[styles.fieldRow, { borderColor: activeColor }]}>
        <ModeButton
          activeColor={colors.accent}
          adjustmentMode={adjustmentMode}
          label="+"
          mode="add"
          onSwitchMode={onSwitchMode}
        />

        <EditableAmountInput
          autoFocus
          immediate
          onChangeValue={onChangeAmount}
          style={styles.input}
          value={adjustmentAmount}
        />

        <ModeButton
          activeColor={colors.negative}
          adjustmentMode={adjustmentMode}
          label="−"
          mode="subtract"
          onSwitchMode={onSwitchMode}
        />
      </View>

      {children}

      <View style={styles.actions}>
        <Pressable onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={onConfirm}
          style={[styles.confirmButton, { backgroundColor: activeColor }]}
        >
          <Text style={styles.confirmText}>Novo total</Text>
          <Text style={styles.confirmText}>
            {maskCurrency(
              calculateAdjustedMonthlyValue(
                currentAmount,
                adjustmentAmount,
                adjustmentMode,
              ),
              valuesHidden,
            )}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

function ModeButton({
  activeColor,
  adjustmentMode,
  label,
  mode,
  onSwitchMode,
}: {
  activeColor: string;
  adjustmentMode: MonthlyValueAdjustmentOperation;
  label: string;
  mode: MonthlyValueAdjustmentOperation;
  onSwitchMode: (mode: MonthlyValueAdjustmentOperation) => void;
}) {
  const isActive = adjustmentMode === mode;

  return (
    <Pressable
      onPress={() => onSwitchMode(mode)}
      style={[
        styles.modeButton,
        isActive ? { backgroundColor: activeColor } : styles.modeButtonInactive,
      ]}
    >
      <Text
        style={[
          styles.modeButtonText,
          { color: isActive ? colors.accentText : colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fieldRow: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  modeButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  modeButtonInactive: {
    backgroundColor: colors.surfaceMuted,
  },
  modeButtonText: {
    letterSpacing: 0,
    ...typography.button,
  },
  input: {
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: 0,
    paddingHorizontal: 12,
    textAlign: 'center',
    ...typography.input,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.button,
  },
  confirmButton: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 2,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  confirmText: {
    color: colors.accentText,
    letterSpacing: 0,
    ...typography.button,
  },
});
