import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export type SelectOption = {
  id: string;
  label: string;
  sublabel?: string;
  color?: string;
};

type SelectFieldProps = {
  fieldLabel: string;
  onChange: (id: string) => void;
  options: SelectOption[];
  value: string;
};

export function SelectField({
  fieldLabel,
  onChange,
  options,
  value,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selected = options.find((o) => o.id === value);

  function handleSelect(id: string) {
    onChange(id);
    setIsOpen(false);
  }

  return (
    <>
      <Pressable onPress={() => setIsOpen(true)} style={styles.trigger}>
        <View style={styles.triggerContent}>
          <Text style={styles.triggerLabel}>{fieldLabel}</Text>
          {selected?.sublabel ? (
            <View style={styles.triggerRow}>
              <Text style={styles.triggerValue} numberOfLines={1}>
                {selected.label}
              </Text>
              {selected.color ? (
                <View style={[styles.dot, { backgroundColor: selected.color }]} />
              ) : null}
              <Text style={styles.triggerSublabel} numberOfLines={1}>
                {selected.sublabel}
              </Text>
            </View>
          ) : (
            <View style={styles.triggerRow}>
              {selected?.color ? (
                <View style={[styles.dot, { backgroundColor: selected.color }]} />
              ) : null}
              <Text style={styles.triggerValue} numberOfLines={1}>
                {selected?.label ?? '—'}
              </Text>
            </View>
          )}
        </View>
        <Ionicons color={colors.textSecondary} name="chevron-down" size={20} />
      </Pressable>

      <Modal
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
        transparent
        visible={isOpen}
      >
        <Pressable onPress={() => setIsOpen(false)} style={styles.overlay}>
          <Pressable style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Selecionar {fieldLabel}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((option) => {
                const isActive = option.id === value;

                return (
                  <Pressable
                    key={option.id}
                    onPress={() => handleSelect(option.id)}
                    style={[styles.item, isActive ? styles.itemActive : null]}
                  >
                    <View style={styles.itemLeft}>
                      {option.sublabel ? (
                        <View style={styles.itemLabelGroup}>
                          <Text
                            style={[
                              styles.itemLabel,
                              isActive ? styles.itemLabelActive : null,
                            ]}
                          >
                            {option.label}
                          </Text>
                          <View style={styles.itemSublabelRow}>
                            {option.color ? (
                              <View
                                style={[styles.dot, { backgroundColor: option.color }]}
                              />
                            ) : null}
                            <Text style={styles.itemSublabel}>{option.sublabel}</Text>
                          </View>
                        </View>
                      ) : (
                        <>
                          {option.color ? (
                            <View
                              style={[styles.dot, { backgroundColor: option.color }]}
                            />
                          ) : null}
                          <Text
                            style={[
                              styles.itemLabel,
                              isActive ? styles.itemLabelActive : null,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </>
                      )}
                    </View>
                    {isActive ? (
                      <Ionicons color={colors.accent} name="checkmark" size={18} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  triggerContent: {
    flex: 1,
    gap: 2,
  },
  triggerLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    textTransform: 'uppercase',
    ...typography.label,
  },
  triggerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  triggerValue: {
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: 0,
    ...typography.button,
  },
  triggerSublabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.caption,
  },
  chevron: {
    marginLeft: 8,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: '60%',
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: colors.borderStrong,
    borderRadius: 99,
    height: 4,
    marginBottom: 14,
    width: 36,
  },
  sheetTitle: {
    color: colors.textSecondary,
    letterSpacing: 0,
    marginBottom: 10,
    textTransform: 'uppercase',
    ...typography.label,
  },
  item: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  itemActive: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 10,
  },
  itemLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: 10,
  },
  dot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  itemLabel: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.body,
  },
  itemLabelActive: {
    color: colors.textPrimary,
  },
  itemLabelGroup: {
    flex: 1,
  },
  itemSublabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: 2,
  },
  itemSublabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.caption,
  },
  check: {
    marginLeft: 8,
  },
});
