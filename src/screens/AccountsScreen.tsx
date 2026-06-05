import { AccountEditor } from '../components/finance/AccountEditor';
import { useFinanceState } from '../hooks/useFinanceState';

type AccountsScreenProps = {
  finance: ReturnType<typeof useFinanceState>;
};

export function AccountsScreen({ finance }: AccountsScreenProps) {
  const { actions, financeState, formState } = finance;

  return (
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
      onCycleAccountCategory={actions.cycleAccountCategory}
      onDeleteAccountItem={actions.deleteAccountItem}
    />
  );
}
