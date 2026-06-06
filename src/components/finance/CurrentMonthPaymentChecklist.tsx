import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  calculatePaymentSummary,
  getMonthlyValueAmount,
  isAccountItemPaid,
  ProjectionMonth,
} from '../../lib/financeCalculations';
import { maskCurrency } from '../../lib/formatters';
import { sortAccountItemsByDueDay } from '../../lib/sorting';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import {
  AccountItem,
  Category,
  MonthlyPaymentStatus,
  MonthlyValue,
} from '../../types/finance';
import { ActionButton } from '../common/ActionButton';

type CurrentMonthPaymentChecklistProps = {
  accountItems: AccountItem[];
  categories: Category[];
  monthlyValues: MonthlyValue[];
  onTogglePaymentStatus: (
    accountItemId: string,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
  ) => void;
  onClose?: () => void;
  paymentStatuses: MonthlyPaymentStatus[];
  projectionMonth: ProjectionMonth;
  valuesHidden: boolean;
};

type PaymentStatusFilter = 'all' | 'pending' | 'paid';

const paymentStatusFilters: { id: PaymentStatusFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'pending', label: 'Pendentes' },
  { id: 'paid', label: 'Pagos' },
];

export function CurrentMonthPaymentChecklist({
  accountItems,
  categories,
  monthlyValues,
  onClose,
  onTogglePaymentStatus,
  paymentStatuses,
  projectionMonth,
  valuesHidden,
}: CurrentMonthPaymentChecklistProps) {
  const [activeFilter, setActiveFilter] = useState<PaymentStatusFilter>('all');
  const paymentSummary = calculatePaymentSummary(
    accountItems,
    monthlyValues,
    paymentStatuses,
    projectionMonth,
  );
  const sortedAccountItems = sortAccountItemsByDueDay(accountItems).filter(
    (accountItem) =>
      getMonthlyValueAmount(monthlyValues, accountItem.id, projectionMonth) > 0,
  );
  const filteredAccountItems = sortedAccountItems.filter((accountItem) => {
    const isPaid = isAccountItemPaid(paymentStatuses, accountItem.id, projectionMonth);

    if (activeFilter === 'paid') {
      return isPaid;
    }

    if (activeFilter === 'pending') {
      return !isPaid;
    }

    return true;
  });

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.sectionTitle}>Pagamentos do mês</Text>
          <Text style={styles.sectionHint}>Marque manualmente o que já foi pago.</Text>
        </View>
        {onClose ? <ActionButton label="Voltar" onPress={onClose} /> : null}
      </View>

      <View style={styles.summaryGrid}>
        <SummaryValue
          color={colors.positive}
          label="Pago"
          value={maskCurrency(paymentSummary.totalPaid, valuesHidden)}
        />
        <SummaryValue
          color={colors.negativeText}
          label="Pendente"
          value={maskCurrency(paymentSummary.totalPending, valuesHidden)}
        />
      </View>

      <View style={styles.filterRow}>
        {paymentStatusFilters.map((filter) => {
          const isActive = activeFilter === filter.id;

          return (
            <Pressable
              key={filter.id}
              onPress={() => setActiveFilter(filter.id)}
              style={[styles.filterButton, isActive ? styles.filterButtonActive : null]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  isActive ? styles.filterButtonTextActive : null,
                ]}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {filteredAccountItems.length > 0 ? (
        <View style={styles.paymentList}>
          {filteredAccountItems.map((accountItem) => {
            const amount = getMonthlyValueAmount(
              monthlyValues,
              accountItem.id,
              projectionMonth,
            );
            const isPaid = isAccountItemPaid(
              paymentStatuses,
              accountItem.id,
              projectionMonth,
            );

            return (
              <Pressable
                key={accountItem.id}
                onPress={() => onTogglePaymentStatus(accountItem.id, projectionMonth)}
                style={[styles.paymentRow, isPaid ? styles.paymentRowPaid : null]}
              >
                <View style={[styles.checkbox, isPaid ? styles.checkboxPaid : null]}>
                  <Text
                    style={[
                      styles.checkboxText,
                      isPaid ? styles.checkboxTextPaid : null,
                    ]}
                  >
                    {isPaid ? '✓' : ''}
                  </Text>
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.accountName}>{accountItem.name}</Text>
                  <Text style={styles.accountMeta}>
                    Dia {accountItem.dueDay} ·{' '}
                    {getCategoryName(categories, accountItem.categoryId)}
                  </Text>
                </View>
                <Text style={[styles.amount, isPaid ? styles.amountPaid : null]}>
                  {maskCurrency(amount, valuesHidden)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={styles.emptyText}>{getEmptyText(activeFilter)}</Text>
      )}
    </View>
  );
}

function SummaryValue({
  color,
  label,
  value,
}: {
  color?: string;
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

function getCategoryName(categories: Category[], categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.name ?? '-';
}

function getEmptyText(activeFilter: PaymentStatusFilter) {
  if (activeFilter === 'paid') {
    return 'Nenhuma conta paga neste mês.';
  }

  if (activeFilter === 'pending') {
    return 'Nenhuma conta pendente neste mês.';
  }

  return 'Cadastre contas no planejamento para acompanhar pagamentos.';
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
  },
  sectionTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.sectionTitle,
  },
  sectionHint: {
    color: colors.textSecondary,
    marginTop: 4,
    ...typography.bodySmall,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  summaryValue: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    flex: 1,
    minHeight: 64,
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
    ...typography.cardTitle,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
  },
  filterButtonActive: {
    backgroundColor: colors.accent,
  },
  filterButtonText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.button,
  },
  filterButtonTextActive: {
    color: colors.accentText,
  },
  paymentList: {
    gap: 8,
    marginTop: 14,
  },
  paymentRow: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 62,
    padding: 10,
  },
  paymentRowPaid: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.positive,
  },
  checkbox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  checkboxPaid: {
    backgroundColor: colors.positive,
    borderColor: colors.positive,
  },
  checkboxText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.cardTitle,
  },
  checkboxTextPaid: {
    color: colors.accentText,
  },
  paymentInfo: {
    flex: 1,
  },
  accountName: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.amountSmall,
  },
  accountMeta: {
    color: colors.textSecondary,
    letterSpacing: 0,
    marginTop: 3,
    ...typography.bodySmall,
  },
  amount: {
    color: colors.textPrimary,
    flexShrink: 0,
    letterSpacing: 0,
    textAlign: 'right',
    ...typography.amountSmall,
  },
  amountPaid: {
    color: colors.positive,
  },
  emptyText: {
    color: colors.textSecondary,
    marginTop: 12,
    ...typography.body,
  },
});
