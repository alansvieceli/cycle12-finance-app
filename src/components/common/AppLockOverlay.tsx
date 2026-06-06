import { BlurView } from 'expo-blur';
import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ActionButton } from './ActionButton';

type AppLockOverlayProps = {
  isInitializing: boolean;
  locked: boolean;
  enabled: boolean;
  onUnlock: () => void;
};

export function AppLockOverlay({
  enabled,
  isInitializing,
  locked,
  onUnlock,
}: AppLockOverlayProps) {
  const shouldShow = isInitializing || (enabled && locked);

  if (!shouldShow) {
    return null;
  }

  return (
    <BlurView intensity={80} style={styles.overlay} tint="dark">
      <View style={styles.content}>
        <Image
          accessibilityIgnoresInvertColors
          source={require('../../../assets/app-icon.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Cycle12 Finance</Text>
        {enabled && locked ? (
          <ActionButton label="Desbloquear" onPress={onUnlock} />
        ) : null}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(11, 13, 18, 0.72)',
    bottom: 0,
    elevation: 24,
    justifyContent: 'center',
    left: 0,
    padding: 28,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  logo: {
    borderRadius: 28,
    height: 96,
    resizeMode: 'contain',
    width: 96,
  },
  title: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.cardTitle,
  },
});
