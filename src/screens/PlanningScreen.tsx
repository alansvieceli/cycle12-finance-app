import { MonthlyValueEditor } from '../components/finance/MonthlyValueEditor';
import type { useFinanceState } from '../hooks/useFinanceState';
import type { ProjectionMonth } from '../lib/financeCalculations';

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
      onReplaceMonthlyValues={actions.replaceMonthlyValues}
      onSelectAccountItem={actions.setSelectedAccountItemId}
      onToggleReview={actions.toggleMonthlyReviewStatus}
      paymentStatuses={financeState.paymentStatuses}
      projectionMonths={projectionMonths}
      selectedAccountItem={selectedAccountItem}
      valuesHidden={valuesHidden}
    />
  );
}
