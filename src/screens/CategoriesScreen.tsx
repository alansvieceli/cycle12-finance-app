import { CategoryEditor } from '../components/finance/CategoryEditor';
import { useFinanceState } from '../hooks/useFinanceState';

type CategoriesScreenProps = {
  finance: ReturnType<typeof useFinanceState>;
};

export function CategoriesScreen({ finance }: CategoriesScreenProps) {
  const { actions, financeState, formState } = finance;

  return (
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
  );
}
