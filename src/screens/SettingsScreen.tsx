import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { CurrencyInput } from '../components/common/CurrencyInput';
import { useFinanceState } from '../hooks/useFinanceState';

type SettingsScreenProps = {
  finance: ReturnType<typeof useFinanceState>;
};

export function SettingsScreen({ finance }: SettingsScreenProps) {
  const { actions, financeState, storageMessage } = finance;

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Ajustes</Text>
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
      </View>
    </View>
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
      style={styles.input}
      value={draftValue}
    />
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#ffffff',
    borderColor: '#dfe7e4',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    color: '#17211f',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  storageMessage: {
    color: '#60716d',
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
  inputHint: {
    color: '#60716d',
    fontSize: 12,
    letterSpacing: 0,
  },
});
