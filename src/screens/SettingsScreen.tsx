import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ActionButton } from '../components/common/ActionButton';
import { CurrencyInput } from '../components/common/CurrencyInput';
import { DataManagementPanel } from '../components/finance/DataManagementPanel';
import { useFinanceState } from '../hooks/useFinanceState';
import { createProjectionMonths } from '../lib/financeCalculations';
import { formatMonthLabel } from '../lib/formatters';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type SettingsScreenProps = {
  finance: ReturnType<typeof useFinanceState>;
  title?: string;
};

const MONTH_COUNT_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function SettingsScreen({
  finance,
  title = 'Preferências',
}: SettingsScreenProps) {
  const { actions, financeState } = finance;
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [isMonthCountPickerOpen, setIsMonthCountPickerOpen] = useState(false);
  const projectionMonths = createProjectionMonths(
    new Date(
      financeState.settings.windowStartYear,
      financeState.settings.windowStartMonth - 1,
      1,
    ),
  );
  const lastProjectionMonth = projectionMonths[projectionMonths.length - 1];
  const nextProjectionMonth = createProjectionMonths(
    new Date(
      financeState.settings.windowStartYear,
      financeState.settings.windowStartMonth,
      1,
    ),
    1,
  )[0];

  if (isDataManagementOpen) {
    return (
      <DataManagementPanel
        financeState={financeState}
        onClose={() => setIsDataManagementOpen(false)}
        onReplaceFinanceState={actions.replaceFinanceState}
      />
    );
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.inputGrid}>
        <View style={styles.box}>
          <Text style={styles.groupTitle}>Valores e visualização</Text>
          <CurrencyInput
            label="Salário Mensal"
            value={financeState.settings.monthlySalary}
            onChangeValue={actions.updateMonthlySalary}
          />
          <CurrencyInput
            label="Extra do Mês Atual"
            value={financeState.settings.currentMonthExtraBalance}
            onChangeValue={actions.updateCurrentMonthExtraBalance}
          />
          <View style={styles.settingRow}>
            <Text style={styles.inputLabel}>Meses no Resumo e Gráficos:</Text>
            <Pressable
              onPress={() => setIsMonthCountPickerOpen(true)}
              style={styles.comboButton}
            >
              <Text style={styles.comboButtonText}>
                {financeState.settings.summaryVisibleMonthCount} ▾
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.box}>
          <Text style={styles.groupTitle}>Janela Atual</Text>
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.82}
            numberOfLines={1}
            style={styles.windowRangeHighlight}
          >
            {formatMonthLabel(
              financeState.settings.windowStartYear,
              financeState.settings.windowStartMonth,
            )}{' '}
            - {formatMonthLabel(lastProjectionMonth.year, lastProjectionMonth.month)}
          </Text>
          <ActionButton
            label="Avançar mês"
            onPress={() =>
              Alert.alert(
                `Avançar para ${formatMonthLabel(
                  nextProjectionMonth.year,
                  nextProjectionMonth.month,
                )}?`,
                `Os valores de ${formatMonthLabel(
                  financeState.settings.windowStartYear,
                  financeState.settings.windowStartMonth,
                )} serão removidos e um novo mês será gerado com base nas regras de propagação.`,
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Confirmar', onPress: actions.advanceWindowMonth },
                ],
              )
            }
          />
        </View>

        <View style={styles.box}>
          <Text style={styles.groupTitle}>Comprometimento</Text>
          <Text style={styles.hint}>Use 0 a 100. Deixe 0 para desativar.</Text>
          <View style={styles.thresholdPair}>
            <View style={styles.thresholdItem}>
              <Text style={styles.inputLabel}>Alerta:</Text>
              <ThresholdInput
                onChangeValue={actions.updateCommitmentWarningThreshold}
                placeholder="80"
                value={financeState.settings.commitmentWarningThreshold}
              />
            </View>
            <View style={styles.thresholdItem}>
              <Text style={styles.inputLabel}>Perigo:</Text>
              <ThresholdInput
                onChangeValue={actions.updateCommitmentDangerThreshold}
                placeholder="90"
                value={financeState.settings.commitmentDangerThreshold}
              />
            </View>
          </View>
        </View>

        <ActionButton
          label="Backup e restauração"
          onPress={() => setIsDataManagementOpen(true)}
        />
      </View>

      <Modal
        animationType="fade"
        onRequestClose={() => setIsMonthCountPickerOpen(false)}
        transparent
        visible={isMonthCountPickerOpen}
      >
        <Pressable
          onPress={() => setIsMonthCountPickerOpen(false)}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Meses no Resumo e Gráficos</Text>
            <View style={styles.monthCountGrid}>
              {MONTH_COUNT_OPTIONS.map((n) => {
                const isSelected = financeState.settings.summaryVisibleMonthCount === n;
                return (
                  <Pressable
                    key={n}
                    onPress={() => {
                      actions.updateSummaryVisibleMonthCount(String(n));
                      setIsMonthCountPickerOpen(false);
                    }}
                    style={[
                      styles.monthCountOption,
                      isSelected && styles.monthCountOptionActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.monthCountOptionText,
                        isSelected && styles.monthCountOptionTextActive,
                      ]}
                    >
                      {n}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function ThresholdInput({
  onChangeValue,
  placeholder,
  value,
}: {
  onChangeValue: (value: string) => void;
  placeholder: string;
  value: number;
}) {
  const [draftValue, setDraftValue] = useState(String(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDraftValue(String(value));
    }
  }, [isFocused, value]);

  function handleChangeText(nextValue: string) {
    const numericValue = nextValue.replace(/\D/g, '');
    setDraftValue(numericValue);
    onChangeValue(numericValue || '0');
  }

  function handleBlur() {
    setIsFocused(false);
    setDraftValue(String(value));
  }

  return (
    <TextInput
      keyboardType="number-pad"
      onBlur={handleBlur}
      onChangeText={handleChangeText}
      onFocus={() => setIsFocused(true)}
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      style={styles.smallInput}
      value={draftValue}
    />
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.sectionTitle,
  },
  inputGrid: {
    gap: 10,
    marginTop: 10,
  },
  box: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  groupTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.cardTitle,
  },
  settingRow: {
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
  smallInput: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.textPrimary,
    letterSpacing: 0,
    minHeight: 44,
    minWidth: 72,
    maxWidth: 88,
    paddingHorizontal: 12,
    textAlign: 'center',
    ...typography.inputCompact,
  },
  comboButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 72,
    paddingHorizontal: 14,
  },
  comboButtonText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.button,
  },
  hint: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.caption,
  },
  windowRangeHighlight: {
    color: colors.textPrimary,
    letterSpacing: 0,
    textAlign: 'center',
    ...typography.amountSmall,
  },
  thresholdPair: {
    flexDirection: 'row',
    gap: 12,
  },
  thresholdItem: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    maxWidth: 320,
    padding: 16,
    width: '100%',
  },
  modalTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.cardTitle,
  },
  monthCountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthCountOption: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    flexBasis: '17%',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  monthCountOptionActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  monthCountOptionText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.button,
  },
  monthCountOptionTextActive: {
    color: colors.accentText,
  },
});
