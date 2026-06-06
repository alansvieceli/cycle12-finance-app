import { StyleSheet, Text, View } from 'react-native';

import { maskCurrency } from '../../lib/formatters';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

type PaymentSummaryPanelProps = {
  emptyText: string;
  paidCount: number;
  title: string;
  totalAccounts: number;
  totalPaid: number;
  totalPending: number;
  valuesHidden: boolean;
};

export function PaymentSummaryPanel({
  emptyText,
  paidCount,
  title,
  totalAccounts,
  totalPaid,
  totalPending,
  valuesHidden,
}: PaymentSummaryPanelProps) {
  const totalAmount = totalPaid + totalPending;
  const paidProgress = totalAmount > 0 ? totalPaid / totalAmount : 0;

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {totalAccounts > 0 ? (
        <>
          <View style={styles.kpiRow}>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>Pago</Text>
              <Text style={[styles.kpiAmount, styles.paidAmount]}>
                {maskCurrency(totalPaid, valuesHidden)}
              </Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>Pendente</Text>
              <Text style={[styles.kpiAmount, styles.pendingAmount]}>
                {maskCurrency(totalPending, valuesHidden)}
              </Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${paidProgress * 100}%` }]} />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.footerText}>
              {Math.round(paidProgress * 100)}% pago
            </Text>
            <Text style={styles.footerText}>
              {paidCount} de {totalAccounts} contas
            </Text>
          </View>
        </>
      ) : (
        <Text style={styles.emptyText}>{emptyText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.sectionTitle,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  kpiBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    flex: 1,
    padding: 12,
  },
  kpiLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    textTransform: 'uppercase',
    ...typography.label,
  },
  kpiAmount: {
    color: colors.textPrimary,
    letterSpacing: 0,
    marginTop: 6,
    ...typography.amountSmall,
  },
  paidAmount: {
    color: colors.positive,
  },
  pendingAmount: {
    color: colors.negativeText,
  },
  progressTrack: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    height: 8,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.positive,
    borderRadius: 999,
    height: '100%',
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  footerText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.bodySmall,
  },
  emptyText: {
    color: colors.textSecondary,
    marginTop: 10,
    ...typography.body,
  },
});
