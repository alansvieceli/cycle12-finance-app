import { ReactNode } from 'react';
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

type ModalShellProps = {
  /** Extra styles merged into the card, e.g. a different maxWidth or padding. */
  cardStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
  /** Close the modal when the dark overlay is tapped. */
  closeOnOverlayPress?: boolean;
  onRequestClose: () => void;
  title?: string;
  visible: boolean;
};

export function ModalShell({
  cardStyle,
  children,
  closeOnOverlayPress = false,
  onRequestClose,
  title,
  visible,
}: ModalShellProps) {
  const content = (
    <>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </>
  );

  return (
    <Modal
      animationType="fade"
      onRequestClose={onRequestClose}
      transparent
      visible={visible}
    >
      {closeOnOverlayPress ? (
        <Pressable onPress={onRequestClose} style={styles.overlay}>
          <Pressable style={[styles.card, cardStyle]}>{content}</Pressable>
        </Pressable>
      ) : (
        <View style={styles.overlay}>
          <View style={[styles.card, cardStyle]}>{content}</View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    maxWidth: 360,
    padding: 16,
    width: '100%',
  },
  title: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.cardTitle,
  },
});
