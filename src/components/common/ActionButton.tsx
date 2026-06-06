import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../../theme/colors';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
};

export function ActionButton({
  label,
  onPress,
  variant = 'primary',
}: ActionButtonProps) {
  const isDanger = variant === 'danger';
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        isDanger
          ? styles.dangerButton
          : isSecondary
            ? styles.secondaryButton
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
  buttonText: {
    fontWeight: '800',
    letterSpacing: 0,
  },
  primaryButtonText: {
    color: colors.accentText,
    fontSize: 13,
  },
  dangerButtonText: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 13,
  },
});
