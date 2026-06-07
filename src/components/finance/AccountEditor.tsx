import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { getCategoryColor } from '../../lib/categoryColors';
import { sortAccountItems, sortCategories } from '../../lib/sorting';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { AccountItem, Category } from '../../types/finance';
import { ActionButton } from '../common/ActionButton';

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
        {onClose ? <ActionButton label="Voltar" onPress={onClose} /> : null}
      </View>

      {sortedCategories.length === 0 ? (
        <Text style={styles.emptyText}>
          Crie uma categoria antes de cadastrar contas.
        </Text>
      ) : (
        <>
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
                      <Text style={styles.expandChevron}>{isExpanded ? '▴' : '▾'}</Text>
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
                          <TextInput
                            keyboardType="number-pad"
                            onChangeText={(dueDay) =>
                              onChangeAccountDueDay(accountItem.id, dueDay)
                            }
                            style={[styles.input, styles.dueDayInput]}
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

          <Pressable
            onPress={() => setIsCreateOpen((p) => !p)}
            style={[styles.createToggle, isCreateOpen && styles.createToggleOpen]}
          >
            <Text style={styles.createToggleText}>Nova conta</Text>
            <Text style={styles.createToggleIcon}>{isCreateOpen ? '−' : '+'}</Text>
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
                <TextInput
                  keyboardType="number-pad"
                  onChangeText={onChangeNewAccountDueDay}
                  placeholder="Dia"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, styles.dueDayInput]}
                  value={newAccountDueDay}
                />
              </View>
              <View style={styles.categoryPicker}>
                <Pressable
                  onPress={() => setIsCategoryPickerOpen((v) => !v)}
                  style={styles.categoryPickerButton}
                >
                  <Text style={styles.categoryPickerText}>
                    {selectedNewAccountCategoryName}
                  </Text>
                  <Text style={styles.categoryPickerIcon}>
                    {isCategoryPickerOpen ? '▴' : '▾'}
                  </Text>
                </Pressable>

                {isCategoryPickerOpen ? (
                  <View style={styles.categoryPickerOptions}>
                    {sortedCategories.map((category) => (
                      <Pressable
                        key={category.id}
                        onPress={() => {
                          onChangeNewAccountCategoryId(category.id);
                          setIsCategoryPickerOpen(false);
                        }}
                        style={[
                          styles.categoryPickerOption,
                          selectedNewAccountCategoryId === category.id
                            ? styles.categoryPickerOptionActive
                            : null,
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryPickerOptionText,
                            selectedNewAccountCategoryId === category.id
                              ? styles.categoryPickerOptionTextActive
                              : null,
                          ]}
                        >
                          {category.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>
              <ActionButton label="Adicionar" onPress={onCreateAccountItem} />
            </View>
          )}
        </>
      )}
    </View>
  );
}

function getCategoryName(categories: Category[], categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.name ?? '-';
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.sectionTitle,
  },
  emptyText: {
    color: colors.textSecondary,
    marginTop: 10,
    ...typography.body,
  },
  listSection: {
    marginBottom: 10,
  },
  listItem: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  compactRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    paddingVertical: 8,
  },
  itemName: {
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: 0,
    ...typography.body,
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
  expandChevron: {
    color: colors.textSecondary,
    fontSize: 22,
    lineHeight: 26,
  },
  expandedContent: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: 8,
    paddingBottom: 10,
    paddingTop: 10,
  },
  editMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.textPrimary,
    letterSpacing: 0,
    minHeight: 44,
    paddingHorizontal: 12,
    ...typography.inputCompact,
  },
  nameInput: {
    flex: 1,
  },
  dueDayInput: {
    maxWidth: 78,
    textAlign: 'center',
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
  createToggle: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: 14,
  },
  createToggleOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  createToggleText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.body,
  },
  createToggleIcon: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.cardTitle,
  },
  createForm: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  createRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  createInput: {
    flex: 1,
  },
  categoryPicker: {
    gap: 6,
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
  categoryPickerIcon: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.caption,
  },
  categoryPickerOptions: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  categoryPickerOption: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  categoryPickerOptionActive: {
    backgroundColor: colors.accent,
  },
  categoryPickerOptionText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.button,
  },
  categoryPickerOptionTextActive: {
    color: colors.accentText,
  },
});
