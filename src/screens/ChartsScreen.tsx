import { CategoryBarChart } from '../components/finance/CategoryBarChart';
import { MonthlyBarChart } from '../components/finance/MonthlyBarChart';
import {
  buildCurrentMonthCategoryChartData,
  buildMonthlyExpenseChartData,
  buildSurplusShortfallChartData,
} from '../lib/chartData';
import { ProjectionMonth } from '../lib/financeCalculations';
import { FinanceState } from '../types/finance';

type ChartsScreenProps = {
  financeState: FinanceState;
  projectionMonths: ProjectionMonth[];
};

export function ChartsScreen({
  financeState,
  projectionMonths,
}: ChartsScreenProps) {
  const currentProjectionMonth =
    projectionMonths.find((projectionMonth) => projectionMonth.isCurrentMonth) ??
    projectionMonths[0];

  return (
    <>
      <MonthlyBarChart
        data={buildSurplusShortfallChartData(financeState, projectionMonths)}
        emptyText="Configure meses e valores para visualizar sobra ou falta."
        mode="balance"
        title="Sobra ou falta por mês"
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
          totalLabel="Total do mês atual"
        />
      ) : null}
    </>
  );
}
