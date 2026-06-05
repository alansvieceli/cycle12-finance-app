import { StyleSheet, View } from 'react-native';

import { CategoryEditor } from '../components/finance/CategoryEditor';
import { useFinanceState } from '../hooks/useFinanceState';
import { SettingsScreen } from './SettingsScreen';

type AdjustmentsScreenProps = {
  finance: ReturnType<typeof useFinanceState>;
};

export function AdjustmentsScreen({ finance }: AdjustmentsScreenProps) {
  const { actions, financeState, formState } = finance;

  return (
    <View style={styles.container}>
      <CategoryEditor
        categories={financeState.categories}
        newCategoryInstallmentEndDate={formState.newCategoryInstallmentEndDate}
        newCategoryName={formState.newCategoryName}
        newCategoryPropagation={formState.newCategoryPropagation}
        newCategorySortOrder={formState.newCategorySortOrder}
        onChangeCategoryInstallmentEndDate={actions.updateCategoryInstallmentEndDate}
        onChangeCategoryName={actions.updateCategoryName}
        onChangeCategoryPropagation={actions.updateCategoryPropagation}
        onChangeCategorySortOrder={actions.updateCategorySortOrder}
        onChangeNewCategoryInstallmentEndDate={actions.setNewCategoryInstallmentEndDate}
        onChangeNewCategoryName={actions.setNewCategoryName}
        onChangeNewCategoryPropagation={actions.setNewCategoryPropagation}
        onChangeNewCategorySortOrder={actions.setNewCategorySortOrder}
        onCreateCategory={actions.createCategory}
        onDeleteCategory={actions.deleteCategory}
      />
      <SettingsScreen finance={finance} title="Ajustes" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});
