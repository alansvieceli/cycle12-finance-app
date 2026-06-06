import { CategoryBarChart } from '../components/finance/CategoryBarChart';
import { MonthlyBarChart } from '../components/finance/MonthlyBarChart';
import {
  buildCurrentMonthCategoryChartData,
  buildMonthlyExpenseChartData,
  buildSurplusShortfallChartData,
} from '../lib/chartData';
import { resolveCommitmentColor } from '../lib/commitmentColor';
import {
  calculateIncomeCommitmentPercentage,
  calculateMonthlyTotalExpenses,
  ProjectionMonth,
} from '../lib/financeCalculations';
import { colors } from '../theme/colors';
import { FinanceState } from '../types/finance';

type ChartsScreenProps = {
  financeState: FinanceState;
  projectionMonths: ProjectionMonth[];
};

export function ChartsScreen({ financeState, projectionMonths }: ChartsScreenProps) {
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

  return (
    <>
      <MonthlyBarChart
        data={buildSurplusShortfallChartData(financeState, projectionMonths)}
        emptyText="Configure meses e valores para visualizar sobra ou falta."
        mode="balance"
        title="Saldo por mês"
        totalLabel="Total no período"
      />

      <MonthlyBarChart
        data={buildMonthlyExpenseChartData(financeState, projectionMonths)}
        emptyText="Configure valores mensais para visualizar despesas."
        title="Despesas por mês"
        totalLabel="Total no período"
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
        />
      ) : null}
    </>
  );
}
