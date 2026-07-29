import { CategoryBarChart } from '../components/finance/CategoryBarChart';
import { MonthlyBarChart } from '../components/finance/MonthlyBarChart';
import { MonthlyCommitmentList } from '../components/finance/MonthlyCommitmentList';
import {
  buildCurrentMonthCategoryChartData,
  buildMonthlyCommitmentChartData,
  buildSurplusShortfallChartData,
} from '../lib/chartData';
import { resolveCommitmentColor } from '../lib/commitmentColor';
import {
  calculateIncomeCommitmentPercentage,
  calculateMonthlyTotalExpenses,
  type ProjectionMonth,
} from '../lib/financeCalculations';
import { maskCurrency, percentageFormatter } from '../lib/formatters';
import {
  calculateSubscriptionsMonthlyTotal,
  calculateSubscriptionsSalaryShare,
  calculateSubscriptionsYearlyTotal,
  toSubscriptionChartPoints,
} from '../lib/subscriptions';
import { colors } from '../theme/colors';
import type { FinanceState } from '../types/finance';

type ChartsScreenProps = {
  financeState: FinanceState;
  projectionMonths: ProjectionMonth[];
  valuesHidden: boolean;
};

export function ChartsScreen({
  financeState,
  projectionMonths,
  valuesHidden,
}: ChartsScreenProps) {
  const currentProjectionMonth =
    projectionMonths.find((projectionMonth) => projectionMonth.isCurrentMonth) ??
    projectionMonths[0];

  const currentMonthTotalExpenses = currentProjectionMonth
    ? calculateMonthlyTotalExpenses(
        financeState.categories,
        financeState.accountItems,
        financeState.monthlyValues,
        currentProjectionMonth,
      )
    : 0;

  const currentMonthCommitment = currentProjectionMonth
    ? calculateIncomeCommitmentPercentage(
        currentMonthTotalExpenses,
        financeState.settings,
        currentProjectionMonth,
      )
    : null;

  const currentMonthCommitmentColor =
    resolveCommitmentColor(
      currentMonthCommitment,
      financeState.settings.commitmentWarningThreshold,
      financeState.settings.commitmentDangerThreshold,
    ) ?? colors.positive;

  const subscriptionsMonthlyTotal = calculateSubscriptionsMonthlyTotal(
    financeState.subscriptions,
  );
  const subscriptionsSalaryShare = calculateSubscriptionsSalaryShare(
    subscriptionsMonthlyTotal,
    financeState.settings.monthlySalary,
  );

  return (
    <>
      <MonthlyCommitmentList
        data={buildMonthlyCommitmentChartData(financeState, projectionMonths)}
        emptyText="Configure salário e valores mensais para visualizar comprometimento."
        goal={financeState.settings.commitmentGoal}
        title="Comprometimento por mês"
      />

      {currentProjectionMonth ? (
        <CategoryBarChart
          data={buildCurrentMonthCategoryChartData(
            financeState,
            currentProjectionMonth,
          )}
          emptyText="Preencha valores do mês atual para visualizar categorias."
          title="Categorias no mês atual"
          totalAmountColor={currentMonthCommitmentColor}
          totalLabel="Total do mês atual"
          valuesHidden={valuesHidden}
        />
      ) : null}

      <MonthlyBarChart
        data={buildSurplusShortfallChartData(financeState, projectionMonths)}
        emptyText="Configure meses e valores para visualizar sobra ou falta."
        title="Saldo por mês"
        totalLabel="Total do período"
        valuesHidden={valuesHidden}
      />

      <CategoryBarChart
        data={toSubscriptionChartPoints(financeState.subscriptions)}
        emptyText="Cadastre assinaturas em Cadastros para visualizar o gasto mensal."
        footnote={
          subscriptionsSalaryShare === null
            ? 'Informe o salário em Ajustes para ver o quanto as assinaturas consomem.'
            : `Consome ${percentageFormatter.format(subscriptionsSalaryShare)} do salário.`
        }
        secondaryTotalLabel="Total por ano"
        secondaryTotalText={maskCurrency(
          calculateSubscriptionsYearlyTotal(financeState.subscriptions),
          valuesHidden,
        )}
        title="Assinaturas"
        totalLabel="Total por mês"
        valuesHidden={valuesHidden}
      />
    </>
  );
}
