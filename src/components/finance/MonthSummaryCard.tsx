import { Pressable, StyleSheet, Text, View } from 'react-native';

import { resolveCommitmentColor } from '../../lib/commitmentColor';
import { ProjectionMonth } from '../../lib/financeCalculations';
import {
  currencyFormatter,
  formatMonthLabel,
  percentageFormatter,
} from '../../lib/formatters';
import { colors } from '../../theme/colors';

type MonthSummaryCardProps = {
  commitmentDangerThreshold: number;
  commitmentWarningThreshold: number;
  monthlyTotalExpenses: number;
  onOpenDetails: () => void;
  projectionMonth: ProjectionMonth;
  salaryCommitmentPercentage: number | null;
  surplusOrShortfall: number;
};

export function MonthSummaryCard({
  commitmentDangerThreshold,
  commitmentWarningThreshold,
  monthlyTotalExpenses,
  onOpenDetails,
  projectionMonth,
  salaryCommitmentPercentage,
  surplusOrShortfall,
}: MonthSummaryCardProps) {
  const commitmentColor = resolveCommitmentColor(
    salaryCommitmentPercentage,
    commitmentWarningThreshold,
    commitmentDangerThreshold,
  );
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
          color={commitmentColor}
          label="Comprometido"
          value={
            salaryCommitmentPercentage === null
              ? '-'
              : percentageFormatter.format(salaryCommitmentPercentage)
          }
        />
      </View>

      <Pressable onPress={onOpenDetails} style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>Detalhes</Text>
      </Pressable>
    </View>
  );
}

function SummaryValue({
  color,
  label,
  value,
}: {
  color?: string | null;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.summaryValue}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryAmount, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  monthCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
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
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  currentMonthLabel: {
    color: colors.accent,
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
    color: colors.positive,
  },
  negativeBalance: {
    color: colors.negativeText,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  summaryValue: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    flex: 1,
    minHeight: 68,
    padding: 12,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  summaryAmount: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 8,
  },
  detailsButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 42,
    paddingHorizontal: 12,
  },
  detailsButtonText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
});
