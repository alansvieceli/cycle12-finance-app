import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getCategoryColor } from '../../lib/categoryColors';
import { sortAccountItems, sortCategories } from '../../lib/sorting';
import { colors } from '../../theme/colors';
import { editorStyles, panelStyles } from '../../theme/sharedStyles';
import { typography } from '../../theme/typography';
import { AccountItem, Category } from '../../types/finance';
import { ActionButton } from '../common/ActionButton';
import { ModalShell } from '../common/ModalShell';

type AccountEditorProps = {
  accountItems: AccountItem[];
  categories: Category[];
  newAccountCategoryId: string;
  newAccountDueDay: string;
  newAccountName: string;
  onChangeAccountDueDay: (accountItemId: string, dueDay: string) => void;
  onChangeAccountName: (accountItemId: string, name: string) => void;
  onChangeNewAccountCategoryId: (categoryId: string) => void;
  onChangeNewAccountDueDay: (dueDay: string) => void;
  onChangeNewAccountName: (name: string) => void;
  onClose?: () => void;
  onCreateAccountItem: () => void;
  onCycleAccountCategory: (accountItemId: string) => void;
  onDeleteAccountItem: (accountItemId: string) => void;
};

export function AccountEditor({
  accountItems,
  categories,
  newAccountCategoryId,
  newAccountDueDay,
  newAccountName,
  onChangeAccountDueDay,
  onChangeAccountName,
  onChangeNewAccountCategoryId,
  onChangeNewAccountDueDay,
  onChangeNewAccountName,
  onClose,
  onCreateAccountItem,
  onCycleAccountCategory,
  onDeleteAccountItem,
}: AccountEditorProps) {
  const [expandedAccountId, setExpandedAccountId] = useState<string>();
  const [isCreateOpen, setIsCreateOpen] = useState(accountItems.length === 0);
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [activeDueDayId, setActiveDueDayId] = useState<string>();
  const sortedCategories = sortCategories(categories);
  const selectedNewAccountCategoryId =
    newAccountCategoryId || sortedCategories[0]?.id || '';
  const selectedNewAccountCategoryName =
    sortedCategories.find((category) => category.id === selectedNewAccountCategoryId)
      ?.name ?? 'Categoria';

  function toggleExpand(accountId: string) {
    setExpandedAccountId((prev) => (prev === accountId ? undefined : accountId));
  }

  function confirmDeleteAccount(accountItem: AccountItem) {
    Alert.alert(
      'Excluir conta',
      `Deseja excluir "${accountItem.name}"? Os valores e pagamentos dessa conta também serão removidos.`,
      [
        { style: 'cancel', text: 'Cancelar' },
        {
          onPress: () => onDeleteAccountItem(accountItem.id),
          style: 'destructive',
          text: 'Excluir',
        },
      ],
    );
  }

  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <Text style={styles.sectionTitle}>Contas</Text>
        {onClose ? (
          <ActionButton icon="arrow-back" label="Voltar" onPress={onClose} />
        ) : null}
      </View>

      {sortedCategories.length === 0 ? (
        <Text style={styles.emptyText}>
          Crie uma categoria antes de cadastrar contas.
        </Text>
      ) : (
        <>
          <Pressable
            onPress={() => setIsCreateOpen((p) => !p)}
            style={[styles.createToggle, isCreateOpen && styles.createToggleOpen]}
          >
            <Text style={styles.createToggleText}>Nova conta</Text>
            <Ionicons
              color={colors.textSecondary}
              name={isCreateOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
            />
          </Pressable>

          {isCreateOpen && (
            <View style={styles.createForm}>
              <View style={styles.createRow}>
                <TextInput
                  onChangeText={onChangeNewAccountName}
                  placeholder="Nome da conta"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, styles.createInput]}
                  value={newAccountName}
                />
                <DueDayButton
                  isActive={activeDueDayId === 'new'}
                  onPress={() => setActiveDueDayId('new')}
                  value={newAccountDueDay}
                />
              </View>
              <Pressable
                onPress={() => setIsCategoryPickerOpen(true)}
                style={styles.categoryPickerButton}
              >
                <Text style={styles.categoryPickerText}>
                  {selectedNewAccountCategoryName}
                </Text>
                <Ionicons color={colors.textSecondary} name="chevron-down" size={20} />
              </Pressable>
              <ActionButton label="Adicionar" onPress={onCreateAccountItem} />
            </View>
          )}

          {sortAccountItems(accountItems, categories).length > 0 && (
            <View style={styles.listSection}>
              {sortAccountItems(accountItems, categories).map((accountItem) => {
                const isExpanded = expandedAccountId === accountItem.id;
                const categoryName = getCategoryName(
                  categories,
                  accountItem.categoryId,
                );

                return (
                  <View key={accountItem.id} style={styles.listItem}>
                    <Pressable
                      onPress={() => toggleExpand(accountItem.id)}
                      style={styles.compactRow}
                    >
                      <Text numberOfLines={1} style={styles.itemName}>
                        {accountItem.name}
                      </Text>
                      <View style={styles.badgesRow}>
                        <View style={styles.badge}>
                          <View
                            style={[
                              styles.categoryDot,
                              {
                                backgroundColor: getCategoryColor(
                                  accountItem.categoryId,
                                  categories,
                                ),
                              },
                            ]}
                          />
                          <Text style={styles.badgeText}>{categoryName}</Text>
                        </View>
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>dia {accountItem.dueDay}</Text>
                        </View>
                      </View>
                      <Ionicons
                        color={colors.textSecondary}
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                      />
                    </Pressable>

                    {isExpanded && (
                      <View style={styles.expandedContent}>
                        <TextInput
                          onChangeText={(name) =>
                            onChangeAccountName(accountItem.id, name)
                          }
                          style={[styles.input, styles.nameInput]}
                          value={accountItem.name}
                        />
                        <View style={styles.editMetaRow}>
                          <Pressable
                            onPress={() => onCycleAccountCategory(accountItem.id)}
                            style={styles.categoryButton}
                          >
                            <Text style={styles.categoryButtonText}>
                              ← {categoryName} →
                            </Text>
                          </Pressable>
                          <DueDayButton
                            isActive={activeDueDayId === accountItem.id}
                            onPress={() => setActiveDueDayId(accountItem.id)}
                            value={String(accountItem.dueDay)}
                          />
                        </View>
                        <ActionButton
                          label="Excluir conta"
                          onPress={() => confirmDeleteAccount(accountItem)}
                          variant="ghost-danger"
                        />
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </>
      )}

      <DueDayModal
        currentValue={
          activeDueDayId === 'new'
            ? newAccountDueDay
            : String(accountItems.find((a) => a.id === activeDueDayId)?.dueDay ?? '')
        }
        onClose={() => setActiveDueDayId(undefined)}
        onSelectDay={(day) => {
          if (!activeDueDayId) return;
          if (activeDueDayId === 'new') {
            onChangeNewAccountDueDay(day);
          } else {
            onChangeAccountDueDay(activeDueDayId, day);
          }
          setActiveDueDayId(undefined);
        }}
        visible={Boolean(activeDueDayId)}
      />
      <Modal
        animationType="slide"
        onRequestClose={() => setIsCategoryPickerOpen(false)}
        transparent
        visible={isCategoryPickerOpen}
      >
        <Pressable
          onPress={() => setIsCategoryPickerOpen(false)}
          style={styles.bottomSheetOverlay}
        >
          <Pressable style={styles.bottomSheet}>
            <Text style={styles.bottomSheetTitle}>Categoria</Text>
            {sortedCategories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => {
                  onChangeNewAccountCategoryId(category.id);
                  setIsCategoryPickerOpen(false);
                }}
                style={[
                  styles.bottomSheetOption,
                  selectedNewAccountCategoryId === category.id
                    ? styles.bottomSheetOptionActive
                    : null,
                ]}
              >
                <View
                  style={[
                    styles.categoryDot,
                    { backgroundColor: getCategoryColor(category.id, categories) },
                  ]}
                />
                <Text
                  style={[
                    styles.bottomSheetOptionText,
                    selectedNewAccountCategoryId === category.id
                      ? styles.bottomSheetOptionTextActive
                      : null,
                  ]}
                >
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const ALL_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

function DueDayButton({
  isActive,
  onPress,
  value,
}: {
  isActive: boolean;
  onPress: () => void;
  value: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.dueDayButton, isActive && styles.dueDayButtonActive]}
    >
      <Text style={styles.dueDayButtonLabel}>Dia</Text>
      <View style={styles.dueDayButtonRow}>
        <Text style={styles.dueDayButtonValue}>{value || '—'}</Text>
        <Ionicons color={colors.textSecondary} name="chevron-down" size={14} />
      </View>
    </Pressable>
  );
}

function DueDayModal({
  currentValue,
  onClose,
  onSelectDay,
  visible,
}: {
  currentValue: string;
  onClose: () => void;
  onSelectDay: (day: string) => void;
  visible: boolean;
}) {
  return (
    <ModalShell
      cardStyle={styles.dueDayModalCard}
      onRequestClose={onClose}
      title="Dia do vencimento"
      visible={visible}
    >
      <View style={styles.dayGrid}>
        {ALL_DAYS.map((day) => {
          const isSelected = String(day) === currentValue;
          return (
            <Pressable
              key={day}
              onPress={() => onSelectDay(String(day))}
              style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  isSelected && styles.dayButtonTextSelected,
                ]}
              >
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <ActionButton label="Cancelar" onPress={onClose} />
    </ModalShell>
  );
}

function getCategoryName(categories: Category[], categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.name ?? '-';
}

const styles = StyleSheet.create({
  ...panelStyles,
  ...editorStyles,
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgesRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  badgeText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.caption,
  },
  dueDayButtonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  editMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  nameInput: {
    flex: 1,
  },
  dueDayButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
    minWidth: 78,
  },
  dueDayButtonActive: {
    borderColor: colors.accent,
  },
  dueDayButtonLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.caption,
  },
  dueDayButtonValue: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.button,
  },
  dueDayModalCard: {
    maxWidth: 380,
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 10,
    borderWidth: 1,
    flexBasis: '12%',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 40,
  },
  dayButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dayButtonText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.button,
  },
  dayButtonTextSelected: {
    color: colors.accentText,
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 10,
  },
  categoryButtonText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    textAlign: 'center',
    ...typography.button,
  },
  createRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  categoryPickerButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  categoryPickerText: {
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: 0,
    ...typography.body,
  },
  bottomSheetOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    gap: 4,
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  bottomSheetTitle: {
    color: colors.textSecondary,
    letterSpacing: 0,
    marginBottom: 8,
    ...typography.bodySmall,
  },
  bottomSheetOption: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  bottomSheetOptionActive: {
    backgroundColor: colors.accent,
  },
  bottomSheetOptionText: {
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: 0,
    ...typography.body,
  },
  bottomSheetOptionTextActive: {
    color: colors.accentText,
  },
});
