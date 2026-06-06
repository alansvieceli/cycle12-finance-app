import { StyleSheet, View } from 'react-native';

import { AppLockState } from '../hooks/useAppLock';
import { useFinanceState } from '../hooks/useFinanceState';
import { SettingsScreen } from './SettingsScreen';

type AdjustmentsScreenProps = {
  appLock: AppLockState;
  finance: ReturnType<typeof useFinanceState>;
  valuesHidden: boolean;
};

export function AdjustmentsScreen({
  appLock,
  finance,
  valuesHidden,
}: AdjustmentsScreenProps) {
  return (
    <View style={styles.container}>
      <SettingsScreen appLock={appLock} finance={finance} valuesHidden={valuesHidden} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});
