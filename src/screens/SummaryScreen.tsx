import {
  calculateCategoryTotals,
  calculateMonthlyTotalExpenses,
  calculateSalaryCommitmentPercentage,
  calculateSurplusOrShortfall,
  ProjectionMonth,
} from '../lib/financeCalculations';
import { FinanceState } from '../types/finance';
import { CurrentMonthPaymentChecklist } from '../components/finance/CurrentMonthPaymentChecklist';
import { MonthSummaryCard } from '../components/finance/MonthSummaryCard';

type SummaryScreenProps = {
  financeState: FinanceState;
  onTogglePaymentStatus: (
    accountItemId: string,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
  ) => void;
  projectionMonths: ProjectionMonth[];
};

export function SummaryScreen({
  financeState,
  onTogglePaymentStatus,
  projectionMonths,
}: SummaryScreenProps) {
  const categoryNamesById = Object.fromEntries(
    financeState.categories.map((category) => [category.id, category.name]),
  );
  const currentProjectionMonth = projectionMonths.find(
    (projectionMonth) => projectionMonth.isCurrentMonth,
  );

  return (
    <>
      {currentProjectionMonth ? (
        <CurrentMonthPaymentChecklist
          accountItems={financeState.accountItems}
          categories={financeState.categories}
          monthlyValues={financeState.monthlyValues}
          onTogglePaymentStatus={onTogglePaymentStatus}
          paymentStatuses={financeState.paymentStatuses}
          projectionMonth={currentProjectionMonth}
        />
      ) : null}

      {projectionMonths.map((projectionMonth) => {
        const monthlyTotalExpenses = calculateMonthlyTotalExpenses(
          financeState.categories,
          financeState.accountItems,
          financeState.monthlyValues,
          projectionMonth,
        );
        const salaryCommitmentPercentage = calculateSalaryCommitmentPercentage(
          monthlyTotalExpenses,
          financeState.settings.monthlySalary,
        );
        const surplusOrShortfall = calculateSurplusOrShortfall(
          financeState.settings,
          monthlyTotalExpenses,
          projectionMonth,
        );
        const categoryTotals = calculateCategoryTotals(
          financeState.categories,
          financeState.accountItems,
          financeState.monthlyValues,
          projectionMonth,
        );

        return (
          <MonthSummaryCard
            key={projectionMonth.key}
            categoryNamesById={categoryNamesById}
            categoryTotals={categoryTotals}
            monthlyTotalExpenses={monthlyTotalExpenses}
            projectionMonth={projectionMonth}
            salaryCommitmentPercentage={salaryCommitmentPercentage}
            surplusOrShortfall={surplusOrShortfall}
          />
        );
      })}
    </>
  );
}
