import { useState } from 'react';

import { ActionButton } from '../components/common/ActionButton';
import { AccountEditor } from '../components/finance/AccountEditor';
import { MonthlyValueEditor } from '../components/finance/MonthlyValueEditor';
import { ProjectionMonth } from '../lib/financeCalculations';
import { useFinanceState } from '../hooks/useFinanceState';

type PlanningScreenProps = {
  finance: ReturnType<typeof useFinanceState>;
  projectionMonths: ProjectionMonth[];
};

export function PlanningScreen({
  finance,
  projectionMonths,
}: PlanningScreenProps) {
  const { actions, financeState, formState, selectedAccountItem } = finance;
  const [isManagingAccounts, setIsManagingAccounts] = useState(false);

  return (
    <>
      {isManagingAccounts ? (
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
          onClose={() => setIsManagingAccounts(false)}
          onCreateAccountItem={actions.createAccountItem}
          onCycleAccountCategory={actions.cycleAccountCategory}
          onDeleteAccountItem={actions.deleteAccountItem}
        />
      ) : (
        <>
          <ActionButton
            label="Gerenciar contas"
            onPress={() => setIsManagingAccounts(true)}
          />
          <MonthlyValueEditor
            accountItems={financeState.accountItems}
            categories={financeState.categories}
            monthlyValues={financeState.monthlyValues}
            onChangeMonthlyValue={actions.updateMonthlyValue}
            onSelectAccountItem={actions.setSelectedAccountItemId}
            projectionMonths={projectionMonths}
            selectedAccountItem={selectedAccountItem}
          />
        </>
      )}
    </>
  );
}
