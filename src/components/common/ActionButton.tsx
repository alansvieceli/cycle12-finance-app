import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

type ActionButtonProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost-danger';
};

export function ActionButton({
  icon,
  label,
  onPress,
  variant = 'primary',
}: ActionButtonProps) {
  const isDanger = variant === 'danger';
  const isSecondary = variant === 'secondary';
  const isGhostDanger = variant === 'ghost-danger';

  const textStyle = isDanger
    ? styles.dangerButtonText
    : isSecondary
      ? styles.secondaryButtonText
      : isGhostDanger
        ? styles.ghostDangerButtonText
        : styles.primaryButtonText;

  const iconColor =
    isDanger || isGhostDanger
      ? colors.negativeText
      : isSecondary
        ? colors.textPrimary
        : colors.accentText;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        isDanger
          ? styles.dangerButton
          : isSecondary
            ? styles.secondaryButton
            : isGhostDanger
              ? styles.ghostDangerButton
              : styles.primaryButton,
      ]}
    >
      {icon ? (
        <View style={styles.buttonContent}>
          <Ionicons color={iconColor} name={icon} size={16} />
          <Text style={[styles.buttonText, textStyle]}>{label}</Text>
        </View>
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  primaryButton: {
    backgroundColor: colors.accent,
  },
  dangerButton: {
    backgroundColor: colors.negative,
  },
  secondaryButton: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderWidth: 1,
  },
  ghostDangerButton: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
    borderWidth: 1,
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  buttonText: {
    letterSpacing: 0,
    ...typography.button,
  },
  primaryButtonText: {
    color: colors.accentText,
  },
  dangerButtonText: {
    color: colors.textPrimary,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
  },
  ghostDangerButtonText: {
    color: colors.negativeText,
  },
});
