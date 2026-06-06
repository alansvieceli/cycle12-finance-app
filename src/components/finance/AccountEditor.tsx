import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { sortAccountItems, sortCategories } from '../../lib/sorting';
import { colors } from '../../theme/colors';
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
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const sortedCategories = sortCategories(categories);
  const selectedNewAccountCategoryId =
    newAccountCategoryId || sortedCategories[0]?.id || '';
  const selectedNewAccountCategoryName =
    sortedCategories.find((category) => category.id === selectedNewAccountCategoryId)
      ?.name ?? 'Categoria';

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
        <Text style={styles.sectionTitle}>Gerenciar contas</Text>
        {onClose ? <ActionButton label="Voltar" onPress={onClose} /> : null}
      </View>

      {sortedCategories.length > 0 ? (
        <View style={styles.createAccountRow}>
          <TextInput
            onChangeText={onChangeNewAccountName}
            placeholder="Nova conta"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            value={newAccountName}
          />
          <View style={styles.categoryPicker}>
            <Pressable
              onPress={() => setIsCategoryPickerOpen((currentValue) => !currentValue)}
              style={styles.categoryPickerButton}
            >
              <Text style={styles.categoryPickerText}>
                {selectedNewAccountCategoryName}
              </Text>
              <Text style={styles.categoryPickerIcon}>
                {isCategoryPickerOpen ? '^' : 'v'}
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
          <TextInput
            keyboardType="number-pad"
            onChangeText={onChangeNewAccountDueDay}
            placeholder="Dia"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, styles.dueDayInput]}
            value={newAccountDueDay}
          />
          <ActionButton label="Adicionar" onPress={onCreateAccountItem} />
        </View>
      ) : (
        <Text style={styles.emptyText}>
          Crie uma categoria antes de cadastrar contas.
        </Text>
      )}

      {sortAccountItems(accountItems, categories).map((accountItem) => (
        <View key={accountItem.id} style={styles.accountEditorRow}>
          <TextInput
            onChangeText={(name) => onChangeAccountName(accountItem.id, name)}
            style={styles.input}
            value={accountItem.name}
          />
          <View style={styles.accountMetaRow}>
            <Pressable
              onPress={() => onCycleAccountCategory(accountItem.id)}
              style={styles.categoryButton}
            >
              <Text style={styles.categoryButtonText}>
                {getCategoryName(categories, accountItem.categoryId)}
              </Text>
            </Pressable>
            <TextInput
              keyboardType="number-pad"
              onChangeText={(dueDay) => onChangeAccountDueDay(accountItem.id, dueDay)}
              style={[styles.input, styles.dueDayInput]}
              value={String(accountItem.dueDay)}
            />
            <ActionButton
              label="Excluir"
              onPress={() => confirmDeleteAccount(accountItem)}
              variant="danger"
            />
          </View>
        </View>
      ))}
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
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  createAccountRow: {
    gap: 10,
    marginTop: 10,
  },
  categoryPicker: {
    gap: 6,
  },
  categoryPickerButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  categoryPickerText: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  categoryPickerIcon: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
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
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  },
  categoryPickerOptionTextActive: {
    color: colors.accentText,
  },
  accountEditorRow: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
  },
  accountMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
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
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
});
