import {
  calculateCategoryTotals,
  calculateMonthlyTotalExpenses,
  calculateSalaryCommitmentPercentage,
  calculateSurplusOrShortfall,
  ProjectionMonth,
} from '../lib/financeCalculations';
import { FinanceState } from '../types/finance';
import { MonthSummaryCard } from '../components/finance/MonthSummaryCard';

type SummaryScreenProps = {
  financeState: FinanceState;
  projectionMonths: ProjectionMonth[];
};

export function SummaryScreen({
  financeState,
  projectionMonths,
}: SummaryScreenProps) {
  const categoryNamesById = Object.fromEntries(
    financeState.categories.map((category) => [category.id, category.name]),
  );

  return (
    <>
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
