import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

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

export function SettingsScreen({
  finance,
  title = 'Configuração financeira',
}: SettingsScreenProps) {
  const { actions, financeState, storageMessage } = finance;
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
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
      {storageMessage ? (
        <Text style={styles.storageMessage}>{storageMessage}</Text>
      ) : (
        <Text style={styles.storageMessage}>
          Dados salvos localmente neste dispositivo.
        </Text>
      )}
      <View style={styles.inputGrid}>
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
        <View style={styles.inputGroup}>
          <View style={styles.settingRow}>
            <Text style={styles.inputLabel}>Meses no Resumo e Gráficos:</Text>
            <VisibleMonthCountInput
              onChangeValue={actions.updateSummaryVisibleMonthCount}
              value={financeState.settings.summaryVisibleMonthCount}
            />
          </View>
          <Text style={[styles.inputHint, styles.summaryMonthHint]}>
            1 a 12 meses. Planejamento mantém 12.
          </Text>
        </View>
        <View style={styles.windowBox}>
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
          <Text style={styles.inputHint}>
            A janela mostrará 12 meses a partir do mês atual.
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
        <View style={styles.commitmentBox}>
          <Text style={styles.groupTitle}>Comprometimento</Text>
          <Text style={styles.commitmentHint}>
            Use 0 a 100. Deixe 0 para desativar.
          </Text>
          <View style={styles.settingRow}>
            <Text style={styles.inputLabel}>Alerta:</Text>
            <ThresholdInput
              onChangeValue={actions.updateCommitmentWarningThreshold}
              placeholder="80"
              value={financeState.settings.commitmentWarningThreshold}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.inputLabel}>Perigo:</Text>
            <ThresholdInput
              onChangeValue={actions.updateCommitmentDangerThreshold}
              placeholder="90"
              value={financeState.settings.commitmentDangerThreshold}
            />
          </View>
        </View>
        <View style={styles.dataActions}>
          <ActionButton
            label="Backup e restauração"
            onPress={() => setIsDataManagementOpen(true)}
          />
        </View>
      </View>
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
      style={styles.input}
      value={draftValue}
    />
  );
}

function VisibleMonthCountInput({
  onChangeValue,
  value,
}: {
  onChangeValue: (value: string) => void;
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

    if (numericValue) {
      onChangeValue(numericValue);
    }
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
      placeholder="12"
      placeholderTextColor={colors.textSecondary}
      style={styles.input}
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
  storageMessage: {
    color: colors.textSecondary,
    marginTop: 8,
    ...typography.bodySmall,
  },
  inputGrid: {
    gap: 12,
    marginTop: 14,
  },
  inputGroup: {
    gap: 6,
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
    minHeight: 48,
    minWidth: 128,
    paddingHorizontal: 12,
    textAlign: 'left',
    ...typography.inputCompact,
  },
  inputHint: {
    color: colors.textSecondary,
    letterSpacing: 0,
    textAlign: 'left',
    ...typography.bodySmall,
  },
  commitmentBox: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    padding: 12,
  },
  commitmentHint: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.caption,
  },
  groupTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.cardTitle,
  },
  summaryMonthHint: {
    textAlign: 'right',
  },
  windowBox: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    padding: 12,
  },
  windowRangeHighlight: {
    color: colors.textPrimary,
    letterSpacing: 0,
    textAlign: 'center',
    ...typography.amountSmall,
  },
  settingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  dataActions: {
    marginTop: 4,
  },
});
