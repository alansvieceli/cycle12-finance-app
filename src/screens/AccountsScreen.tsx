import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AccountEditor } from '../components/finance/AccountEditor';
import { CategoryEditor } from '../components/finance/CategoryEditor';
import type { useFinanceState } from '../hooks/useFinanceState';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type AccountsScreenProps = {
  finance: ReturnType<typeof useFinanceState>;
};

type AccountsSection = 'categories' | 'accounts';

const accountSections: { id: AccountsSection; label: string }[] = [
  { id: 'categories', label: 'Categorias' },
  { id: 'accounts', label: 'Contas' },
];

export function AccountsScreen({ finance }: AccountsScreenProps) {
  const { actions, financeState, formState } = finance;
  const [activeSection, setActiveSection] = useState<AccountsSection>('categories');

  return (
    <View style={styles.container}>
      <View style={styles.segmentedControl}>
        {accountSections.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <Pressable
              key={section.id}
              onPress={() => setActiveSection(section.id)}
              style={[
                styles.segmentButton,
                isActive ? styles.segmentButtonActive : null,
              ]}
            >
              <Text
                style={[
                  styles.segmentButtonText,
                  isActive ? styles.segmentButtonTextActive : null,
                ]}
              >
                {section.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeSection === 'categories' ? (
        <CategoryEditor
          categories={financeState.categories}
          newCategoryColor={formState.newCategoryColor}
          newCategoryInstallmentEndDate={formState.newCategoryInstallmentEndDate}
          newCategoryName={formState.newCategoryName}
          newCategoryPropagation={formState.newCategoryPropagation}
          newCategorySortOrder={formState.newCategorySortOrder}
          onChangeCategoryColor={actions.updateCategoryColor}
          onChangeCategoryInstallmentEndDate={actions.updateCategoryInstallmentEndDate}
          onChangeCategoryName={actions.updateCategoryName}
          onChangeCategoryPropagation={actions.updateCategoryPropagation}
          onChangeCategorySortOrder={actions.updateCategorySortOrder}
          onChangeNewCategoryColor={actions.setNewCategoryColor}
          onChangeNewCategoryInstallmentEndDate={
            actions.setNewCategoryInstallmentEndDate
          }
          onChangeNewCategoryName={actions.setNewCategoryName}
          onChangeNewCategoryPropagation={actions.setNewCategoryPropagation}
          onChangeNewCategorySortOrder={actions.setNewCategorySortOrder}
          onCreateCategory={actions.createCategory}
          onDeleteCategory={actions.deleteCategory}
        />
      ) : (
        <AccountEditor
          accountItems={financeState.accountItems}
          categories={financeState.categories}
          newAccountCategoryId={formState.newAccountCategoryId}
          newAccountDueDay={formState.newAccountDueDay}
          newAccountName={formState.newAccountName}
          onChangeAccountDueDay={actions.updateAccountDueDay}
          onChangeAccountName={actions.updateAccountName}
          onChangeNewAccountCategoryId={actions.setNewAccountCategoryId}
          onChangeNewAccountDueDay={actions.setNewAccountDueDay}
          onChangeNewAccountName={actions.setNewAccountName}
          onCreateAccountItem={actions.createAccountItem}
          onChangeAccountCategoryId={actions.setAccountCategory}
          onDeleteAccountItem={actions.deleteAccountItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  segmentButtonActive: {
    backgroundColor: colors.accent,
  },
  segmentButtonText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.button,
  },
  segmentButtonTextActive: {
    color: colors.accentText,
  },
  segmentedControl: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    padding: 6,
  },
});
