import { StyleSheet, View } from 'react-native';

import { useFinanceState } from '../hooks/useFinanceState';
import { SettingsScreen } from './SettingsScreen';

type AdjustmentsScreenProps = {
  finance: ReturnType<typeof useFinanceState>;
};

export function AdjustmentsScreen({ finance }: AdjustmentsScreenProps) {
  return (
    <View style={styles.container}>
      <SettingsScreen finance={finance} title="Preferências" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});
