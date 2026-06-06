import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost-danger';
};

export function ActionButton({
  label,
  onPress,
  variant = 'primary',
}: ActionButtonProps) {
  const isDanger = variant === 'danger';
  const isSecondary = variant === 'secondary';
  const isGhostDanger = variant === 'ghost-danger';

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
      <Text
        style={[
          styles.buttonText,
          isDanger
            ? styles.dangerButtonText
            : isSecondary
              ? styles.secondaryButtonText
              : isGhostDanger
                ? styles.ghostDangerButtonText
                : styles.primaryButtonText,
        ]}
      >
        {label}
      </Text>
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
