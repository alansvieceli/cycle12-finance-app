import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  calculatePaymentSummary,
  getMonthlyValueAmount,
  isAccountItemPaid,
  ProjectionMonth,
} from '../../lib/financeCalculations';
import { currencyFormatter } from '../../lib/formatters';
import {
  AccountItem,
  Category,
  MonthlyPaymentStatus,
  MonthlyValue,
} from '../../types/finance';

type CurrentMonthPaymentChecklistProps = {
  accountItems: AccountItem[];
  categories: Category[];
  monthlyValues: MonthlyValue[];
  onTogglePaymentStatus: (
    accountItemId: string,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
  ) => void;
  paymentStatuses: MonthlyPaymentStatus[];
  projectionMonth: ProjectionMonth;
};

export function CurrentMonthPaymentChecklist({
  accountItems,
  categories,
  monthlyValues,
  onTogglePaymentStatus,
  paymentStatuses,
  projectionMonth,
}: CurrentMonthPaymentChecklistProps) {
  const paymentSummary = calculatePaymentSummary(
    accountItems,
    monthlyValues,
    paymentStatuses,
    projectionMonth,
  );
  const sortedAccountItems = accountItems
    .slice()
    .sort(
      (firstAccountItem, secondAccountItem) =>
        firstAccountItem.dueDay - secondAccountItem.dueDay ||
        firstAccountItem.sortOrder - secondAccountItem.sortOrder,
    );

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View>
          <Text style={styles.sectionTitle}>Pagamentos do mês</Text>
          <Text style={styles.sectionHint}>Marque manualmente o que já foi pago.</Text>
        </View>
      </View>

      <View style={styles.summaryGrid}>
        <SummaryValue label="Pago" value={currencyFormatter.format(paymentSummary.totalPaid)} />
        <SummaryValue
          label="Pendente"
          value={currencyFormatter.format(paymentSummary.totalPending)}
        />
      </View>

      {sortedAccountItems.length > 0 ? (
        <View style={styles.paymentList}>
          {sortedAccountItems.map((accountItem) => {
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
                  <Text style={[styles.checkboxText, isPaid ? styles.checkboxTextPaid : null]}>
                    {isPaid ? '✓' : ''}
                  </Text>
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.accountName}>{accountItem.name}</Text>
                  <Text style={styles.accountMeta}>
                    Dia {accountItem.dueDay} · {getCategoryName(categories, accountItem.categoryId)}
                  </Text>
                </View>
                <Text style={[styles.amount, isPaid ? styles.amountPaid : null]}>
                  {currencyFormatter.format(amount)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={styles.emptyText}>
          Cadastre contas no planejamento para acompanhar pagamentos.
        </Text>
      )}
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

function getCategoryName(categories: Category[], categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.name ?? '-';
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#ffffff',
    borderColor: '#dfe7e4',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#17211f',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  sectionHint: {
    color: '#60716d',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  summaryValue: {
    backgroundColor: '#eef4f2',
    borderRadius: 8,
    flex: 1,
    minHeight: 64,
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
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 8,
  },
  paymentList: {
    gap: 8,
    marginTop: 14,
  },
  paymentRow: {
    alignItems: 'center',
    backgroundColor: '#f7faf9',
    borderColor: '#dfe7e4',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 62,
    padding: 10,
  },
  paymentRowPaid: {
    backgroundColor: '#eef7f2',
    borderColor: '#b8d7c6',
  },
  checkbox: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#9fb3ad',
    borderRadius: 6,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  checkboxPaid: {
    backgroundColor: '#176a4d',
    borderColor: '#176a4d',
  },
  checkboxText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  checkboxTextPaid: {
    color: '#ffffff',
  },
  paymentInfo: {
    flex: 1,
  },
  accountName: {
    color: '#17211f',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  accountMeta: {
    color: '#60716d',
    fontSize: 12,
    letterSpacing: 0,
    marginTop: 3,
  },
  amount: {
    color: '#17211f',
    flexShrink: 0,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'right',
  },
  amountPaid: {
    color: '#176a4d',
  },
  emptyText: {
    color: '#60716d',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
});
