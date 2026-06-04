import { Fragment, useState } from 'react';

import { ActionButton } from '../components/common/ActionButton';
import {
  calculateCategoryTotals,
  calculateIncomeCommitmentPercentage,
  calculateMonthlyTotalExpenses,
  calculateSurplusOrShortfall,
  ProjectionMonth,
} from '../lib/financeCalculations';
import { sortCategories } from '../lib/sorting';
import { FinanceState } from '../types/finance';
import { CurrentMonthPaymentChecklist } from '../components/finance/CurrentMonthPaymentChecklist';
import { MonthDetailsPanel } from '../components/finance/MonthDetailsPanel';
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
  const [selectedDetailsMonthKey, setSelectedDetailsMonthKey] = useState<
    string | null
  >(null);
  const [isManagingCurrentMonthPayments, setIsManagingCurrentMonthPayments] =
    useState(false);
  const sortedCategories = sortCategories(financeState.categories);
  const categoryNamesById = Object.fromEntries(
    sortedCategories.map((category) => [category.id, category.name]),
  );
  const currentProjectionMonth = projectionMonths.find(
    (projectionMonth) => projectionMonth.isCurrentMonth,
  );
  const selectedDetailsMonth = projectionMonths.find(
    (projectionMonth) => projectionMonth.key === selectedDetailsMonthKey,
  );

  return (
    <>
      {currentProjectionMonth && isManagingCurrentMonthPayments ? (
        <CurrentMonthPaymentChecklist
          accountItems={financeState.accountItems}
          categories={financeState.categories}
          monthlyValues={financeState.monthlyValues}
          onClose={() => setIsManagingCurrentMonthPayments(false)}
          onTogglePaymentStatus={onTogglePaymentStatus}
          paymentStatuses={financeState.paymentStatuses}
          projectionMonth={currentProjectionMonth}
        />
      ) : null}

      {currentProjectionMonth && !isManagingCurrentMonthPayments ? (
        <ActionButton
          label="Pagamentos do mês"
          onPress={() => setIsManagingCurrentMonthPayments(true)}
        />
      ) : null}

      {projectionMonths.map((projectionMonth) => {
        const monthlyTotalExpenses = calculateMonthlyTotalExpenses(
          sortedCategories,
          financeState.accountItems,
          financeState.monthlyValues,
          projectionMonth,
        );
        const salaryCommitmentPercentage = calculateIncomeCommitmentPercentage(
          monthlyTotalExpenses,
          financeState.settings,
          projectionMonth,
        );
        const surplusOrShortfall = calculateSurplusOrShortfall(
          financeState.settings,
          monthlyTotalExpenses,
          projectionMonth,
        );
        const isDetailsOpen = selectedDetailsMonth?.key === projectionMonth.key;

        return (
          <Fragment key={projectionMonth.key}>
            <MonthSummaryCard
              commitmentDangerThreshold={financeState.settings.commitmentDangerThreshold}
              commitmentWarningThreshold={financeState.settings.commitmentWarningThreshold}
              monthlyTotalExpenses={monthlyTotalExpenses}
              onOpenDetails={() => setSelectedDetailsMonthKey(projectionMonth.key)}
              projectionMonth={projectionMonth}
              salaryCommitmentPercentage={salaryCommitmentPercentage}
              surplusOrShortfall={surplusOrShortfall}
            />
            {isDetailsOpen ? (
              <MonthDetailsPanel
                categoryNamesById={categoryNamesById}
                categoryTotals={calculateCategoryTotals(
                  sortedCategories,
                  financeState.accountItems,
                  financeState.monthlyValues,
                  projectionMonth,
                )}
                monthlyTotalExpenses={monthlyTotalExpenses}
                onClose={() => setSelectedDetailsMonthKey(null)}
                projectionMonth={projectionMonth}
              />
            ) : null}
          </Fragment>
        );
      })}
    </>
  );
}
