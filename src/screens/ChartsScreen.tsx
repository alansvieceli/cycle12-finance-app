import { CategoryBarChart } from '../components/finance/CategoryBarChart';
import { MonthlyBarChart } from '../components/finance/MonthlyBarChart';
import { MonthlyCommitmentList } from '../components/finance/MonthlyCommitmentList';
import { PaymentSummaryPanel } from '../components/finance/PaymentSummaryPanel';
import {
  buildCurrentMonthCategoryChartData,
  buildMonthlyCommitmentChartData,
  buildSurplusShortfallChartData,
} from '../lib/chartData';
import { resolveCommitmentColor } from '../lib/commitmentColor';
import {
  calculateIncomeCommitmentPercentage,
  calculateMonthlyTotalExpenses,
  calculatePaymentSummary,
  getMonthlyValueAmount,
  isAccountItemPaid,
  ProjectionMonth,
} from '../lib/financeCalculations';
import { colors } from '../theme/colors';
import { FinanceState } from '../types/finance';

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

  const paymentSummary = currentProjectionMonth
    ? calculatePaymentSummary(
        financeState.accountItems,
        financeState.monthlyValues,
        financeState.paymentStatuses,
        currentProjectionMonth,
      )
    : { totalPaid: 0, totalPending: 0 };

  const accountsWithValues = currentProjectionMonth
    ? financeState.accountItems.filter(
        (item) =>
          getMonthlyValueAmount(
            financeState.monthlyValues,
            item.id,
            currentProjectionMonth,
          ) > 0,
      )
    : [];

  const paidCount = currentProjectionMonth
    ? accountsWithValues.filter((item) =>
        isAccountItemPaid(
          financeState.paymentStatuses,
          item.id,
          currentProjectionMonth,
        ),
      ).length
    : 0;

  return (
    <>
      <MonthlyCommitmentList
        data={buildMonthlyCommitmentChartData(financeState, projectionMonths)}
        emptyText="Configure salário e valores mensais para visualizar comprometimento."
        title="Comprometimento por mês"
      />

      <PaymentSummaryPanel
        emptyText="Nenhuma conta com valor configurado para o mês atual."
        paidCount={paidCount}
        title="Pago vs Pendente — mês atual"
        totalAccounts={accountsWithValues.length}
        totalPaid={paymentSummary.totalPaid}
        totalPending={paymentSummary.totalPending}
        valuesHidden={valuesHidden}
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
        mode="balance"
        title="Saldo por mês"
        totalLabel="Total no período"
        valuesHidden={valuesHidden}
      />
    </>
  );
}
