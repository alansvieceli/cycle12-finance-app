import { MonthlyValueEditor } from '../components/finance/MonthlyValueEditor';
import { useFinanceState } from '../hooks/useFinanceState';
import { ProjectionMonth } from '../lib/financeCalculations';

type PlanningScreenProps = {
  finance: ReturnType<typeof useFinanceState>;
  projectionMonths: ProjectionMonth[];
  valuesHidden: boolean;
};

export function PlanningScreen({
  finance,
  projectionMonths,
  valuesHidden,
}: PlanningScreenProps) {
  const { actions, financeState, selectedAccountItem } = finance;

  return (
    <MonthlyValueEditor
      accountItems={financeState.accountItems}
      categories={financeState.categories}
      monthlyValues={financeState.monthlyValues}
      onAdjustMonthlyValue={actions.adjustMonthlyValue}
      onChangeMonthlyValue={actions.updateMonthlyValue}
      onSelectAccountItem={actions.setSelectedAccountItemId}
      projectionMonths={projectionMonths}
      selectedAccountItem={selectedAccountItem}
      valuesHidden={valuesHidden}
    />
  );
}
