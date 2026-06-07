import { Pressable, StyleSheet, Text, View } from 'react-native';

import { resolveCommitmentColor } from '../../lib/commitmentColor';
import { ProjectionMonth } from '../../lib/financeCalculations';
import {
  formatMonthLabel,
  maskCurrency,
  percentageFormatter,
} from '../../lib/formatters';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

type MonthSummaryCardProps = {
  commitmentDangerThreshold: number;
  commitmentWarningThreshold: number;
  monthlyTotalExpenses: number;
  onOpenDetails: () => void;
  projectionMonth: ProjectionMonth;
  salaryCommitmentPercentage: number | null;
  surplusOrShortfall: number;
  valuesHidden: boolean;
};

export function MonthSummaryCard({
  commitmentDangerThreshold,
  commitmentWarningThreshold,
  monthlyTotalExpenses,
  onOpenDetails,
  projectionMonth,
  salaryCommitmentPercentage,
  surplusOrShortfall,
  valuesHidden,
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
          {maskCurrency(surplusOrShortfall, valuesHidden)}
        </Text>
      </View>

      <View style={styles.summaryGrid}>
        <SummaryValue
          label="Despesas"
          value={maskCurrency(monthlyTotalExpenses, valuesHidden)}
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
    borderRadius: 16,
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
    letterSpacing: 0,
    ...typography.sectionTitle,
  },
  currentMonthLabel: {
    color: colors.accent,
    letterSpacing: 0,
    marginTop: 4,
    textTransform: 'uppercase',
    ...typography.label,
  },
  balance: {
    flexShrink: 1,
    letterSpacing: 0,
    textAlign: 'right',
    ...typography.amountMedium,
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
    borderRadius: 16,
    flex: 1,
    minHeight: 68,
    padding: 12,
  },
  summaryLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    textTransform: 'uppercase',
    ...typography.label,
  },
  summaryAmount: {
    color: colors.textPrimary,
    letterSpacing: 0,
    marginTop: 8,
    ...typography.amountMedium,
  },
  detailsButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  detailsButtonText: {
    color: colors.accent,
    letterSpacing: 0,
    ...typography.button,
  },
});
