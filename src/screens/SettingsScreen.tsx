import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { CurrencyInput } from '../components/common/CurrencyInput';
import { useFinanceState } from '../hooks/useFinanceState';
import { colors } from '../theme/colors';

type SettingsScreenProps = {
  finance: ReturnType<typeof useFinanceState>;
};

export function SettingsScreen({ finance }: SettingsScreenProps) {
  const { actions, financeState, storageMessage } = finance;

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Configurações</Text>
      {storageMessage ? (
        <Text style={styles.storageMessage}>{storageMessage}</Text>
      ) : (
        <Text style={styles.storageMessage}>
          Dados salvos localmente neste dispositivo.
        </Text>
      )}
      <View style={styles.inputGrid}>
        <CurrencyInput
          label="Salário mensal"
          value={financeState.settings.monthlySalary}
          onChangeValue={actions.updateMonthlySalary}
        />
        <CurrencyInput
          label="Extra do mês atual"
          value={financeState.settings.currentMonthExtraBalance}
          onChangeValue={actions.updateCurrentMonthExtraBalance}
        />
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Meses no resumo</Text>
          <VisibleMonthCountInput
            onChangeValue={actions.updateVisibleMonthCount}
            value={financeState.settings.visibleMonthCount}
          />
          <Text style={styles.inputHint}>Escolha de 1 a 12 meses.</Text>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Alerta de comprometimento</Text>
          <ThresholdInput
            onChangeValue={actions.updateCommitmentWarningThreshold}
            placeholder="80"
            value={financeState.settings.commitmentWarningThreshold}
          />
          <Text style={styles.inputHint}>0 a 100. Deixe 0 para desativar.</Text>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Perigo de comprometimento</Text>
          <ThresholdInput
            onChangeValue={actions.updateCommitmentDangerThreshold}
            placeholder="90"
            value={financeState.settings.commitmentDangerThreshold}
          />
          <Text style={styles.inputHint}>0 a 100. Deixe 0 para desativar.</Text>
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
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  storageMessage: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
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
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  inputHint: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 0,
  },
});
