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

  return (
    <>
      <AccountEditor
        accountItems={financeState.accountItems}
        categories={financeState.categories}
        newAccountDueDay={formState.newAccountDueDay}
        newAccountName={formState.newAccountName}
        onChangeAccountDueDay={actions.updateAccountDueDay}
        onChangeAccountName={actions.updateAccountName}
        onChangeNewAccountDueDay={actions.setNewAccountDueDay}
        onChangeNewAccountName={actions.setNewAccountName}
        onCreateAccountItem={actions.createAccountItem}
        onCycleAccountCategory={actions.cycleAccountCategory}
        onDeleteAccountItem={actions.deleteAccountItem}
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
  );
}
