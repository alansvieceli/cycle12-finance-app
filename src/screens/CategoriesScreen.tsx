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
      newCategoryName={formState.newCategoryName}
      newCategorySortOrder={formState.newCategorySortOrder}
      onChangeCategoryName={actions.updateCategoryName}
      onChangeCategorySortOrder={actions.updateCategorySortOrder}
      onChangeNewCategoryName={actions.setNewCategoryName}
      onChangeNewCategorySortOrder={actions.setNewCategorySortOrder}
      onCreateCategory={actions.createCategory}
      onDeleteCategory={actions.deleteCategory}
    />
  );
}
