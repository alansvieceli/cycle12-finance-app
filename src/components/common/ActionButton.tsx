import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../../theme/colors';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'danger';
};

export function ActionButton({
  label,
  onPress,
  variant = 'primary',
}: ActionButtonProps) {
  const isDanger = variant === 'danger';

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, isDanger ? styles.dangerButton : styles.primaryButton]}
    >
      <Text
        style={[
          styles.buttonText,
          isDanger ? styles.dangerButtonText : styles.primaryButtonText,
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
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  primaryButton: {
    backgroundColor: colors.accent,
  },
  dangerButton: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.negative,
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
    color: colors.negativeText,
    fontSize: 12,
  },
});
