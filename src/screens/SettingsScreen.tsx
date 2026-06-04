import { StyleSheet, Text, View } from 'react-native';

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
      </View>
    </View>
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
});
