import { StyleSheet, Text, View } from 'react-native';

import { CategoryMonthTotal, ProjectionMonth } from '../../lib/financeCalculations';
import {
  currencyFormatter,
  formatMonthLabel,
  percentageFormatter,
} from '../../lib/formatters';
import { CategoryTotalsList } from './CategoryTotalsList';

type MonthSummaryCardProps = {
  categoryNamesById: Record<string, string>;
  categoryTotals: CategoryMonthTotal[];
  monthlyTotalExpenses: number;
  projectionMonth: ProjectionMonth;
  salaryCommitmentPercentage: number | null;
  surplusOrShortfall: number;
};

export function MonthSummaryCard({
  categoryNamesById,
  categoryTotals,
  monthlyTotalExpenses,
  projectionMonth,
  salaryCommitmentPercentage,
  surplusOrShortfall,
}: MonthSummaryCardProps) {
  return (
    <View style={styles.monthCard}>
      <View style={styles.monthHeader}>
        <View>
          <Text style={styles.monthName}>
            {formatMonthLabel(projectionMonth.year, projectionMonth.month)}
          </Text>
          {projectionMonth.isCurrentMonth ? (
            <Text style={styles.currentMonthLabel}>Mês atual</Text>
          ) : null}
        </View>
        <Text
          style={[
            styles.balance,
            surplusOrShortfall < 0 ? styles.negativeBalance : styles.positiveBalance,
          ]}
        >
          {currencyFormatter.format(surplusOrShortfall)}
        </Text>
      </View>

      <View style={styles.summaryGrid}>
        <SummaryValue
          label="Despesas"
          value={currencyFormatter.format(monthlyTotalExpenses)}
        />
        <SummaryValue
          label="Comprometido"
          value={
            salaryCommitmentPercentage === null
              ? '-'
              : percentageFormatter.format(salaryCommitmentPercentage)
          }
        />
      </View>

      <CategoryTotalsList
        categoryNamesById={categoryNamesById}
        categoryTotals={categoryTotals}
      />
    </View>
  );
}

function SummaryValue({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryValue}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryAmount}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  monthCard: {
    backgroundColor: '#ffffff',
    borderColor: '#dfe7e4',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  monthHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  monthName: {
    color: '#17211f',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  currentMonthLabel: {
    color: '#3d6f66',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  balance: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'right',
  },
  positiveBalance: {
    color: '#176a4d',
  },
  negativeBalance: {
    color: '#a33b2f',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  summaryValue: {
    backgroundColor: '#eef4f2',
    borderRadius: 8,
    flex: 1,
    minHeight: 68,
    padding: 12,
  },
  summaryLabel: {
    color: '#60716d',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  summaryAmount: {
    color: '#17211f',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 8,
  },
});
