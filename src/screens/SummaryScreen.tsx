import { Fragment, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MonthDetailsPanel } from '../components/finance/MonthDetailsPanel';
import { MonthSummaryCard } from '../components/finance/MonthSummaryCard';
import {
  calculateCategoryTotals,
  calculateIncomeCommitmentPercentage,
  calculatePaymentSummary,
  calculateMonthlyTotalExpenses,
  calculateSurplusOrShortfall,
  getMonthlyValueAmount,
  isAccountItemPaid,
  ProjectionMonth,
} from '../lib/financeCalculations';
import { resolveCommitmentColor } from '../lib/commitmentColor';
import { formatMonthLabel, maskCurrency, percentageFormatter } from '../lib/formatters';
import { getCategoryColor } from '../lib/categoryColors';
import { sortAccountItemsByDueDay, sortCategories } from '../lib/sorting';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { FinanceState } from '../types/finance';

type SummaryScreenProps = {
  financeState: FinanceState;
  onOpenPayments: () => void;
  projectionMonths: ProjectionMonth[];
  valuesHidden: boolean;
};

export function SummaryScreen({
  financeState,
  onOpenPayments,
  projectionMonths,
  valuesHidden,
}: SummaryScreenProps) {
  const [selectedDetailsMonthKey, setSelectedDetailsMonthKey] = useState<string | null>(
    null,
  );
  const [isOtherMonthsVisible, setIsOtherMonthsVisible] = useState(false);
  const sortedCategories = sortCategories(financeState.categories);
  const categoryNamesById = Object.fromEntries(
    sortedCategories.map((category) => [category.id, category.name]),
  );
  const categoryColorsById = Object.fromEntries(
    sortedCategories.map((category) => [
      category.id,
      getCategoryColor(category.id, sortedCategories),
    ]),
  );
  const selectedDetailsMonth = projectionMonths.find(
    (projectionMonth) => projectionMonth.key === selectedDetailsMonthKey,
  );
  const currentProjectionMonth = projectionMonths[0];
  const currentMonthlyTotalExpenses = currentProjectionMonth
    ? calculateMonthlyTotalExpenses(
        sortedCategories,
        financeState.accountItems,
        financeState.monthlyValues,
        currentProjectionMonth,
      )
    : 0;
  const currentCommitmentPercentage = currentProjectionMonth
    ? calculateIncomeCommitmentPercentage(
        currentMonthlyTotalExpenses,
        financeState.settings,
        currentProjectionMonth,
      )
    : null;
  const currentSurplusOrShortfall = currentProjectionMonth
    ? calculateSurplusOrShortfall(
        financeState.settings,
        currentMonthlyTotalExpenses,
        currentProjectionMonth,
      )
    : 0;
  const paymentSummary = currentProjectionMonth
    ? calculatePaymentSummary(
        financeState.accountItems,
        financeState.monthlyValues,
        financeState.paymentStatuses,
        currentProjectionMonth,
      )
    : { totalPaid: 0, totalPending: 0 };
  const nextDueAccount = currentProjectionMonth
    ? sortAccountItemsByDueDay(financeState.accountItems).find(
        (accountItem) =>
          !isAccountItemPaid(
            financeState.paymentStatuses,
            accountItem.id,
            currentProjectionMonth,
          ) &&
          getMonthlyValueAmount(
            financeState.monthlyValues,
            accountItem.id,
            currentProjectionMonth,
          ) > 0,
      )
    : undefined;
  const nextDueAccountCategoryName = nextDueAccount
    ? categoryNamesById[nextDueAccount.categoryId]
    : undefined;
  const currentMonthPayableAccounts = currentProjectionMonth
    ? financeState.accountItems
    : [];
  const currentMonthPendingAccounts = currentProjectionMonth
    ? currentMonthPayableAccounts.filter(
        (accountItem) =>
          !isAccountItemPaid(
            financeState.paymentStatuses,
            accountItem.id,
            currentProjectionMonth,
          ),
      )
    : [];
  const commitmentProgress = Math.min(Math.max(currentCommitmentPercentage ?? 0, 0), 1);
  const isCommitmentOverLimit =
    currentCommitmentPercentage !== null &&
    (currentCommitmentPercentage >= 1 ||
      currentCommitmentPercentage >=
        financeState.settings.commitmentDangerThreshold / 100);
  const commitmentColor =
    resolveCommitmentColor(
      currentCommitmentPercentage,
      financeState.settings.commitmentWarningThreshold,
      financeState.settings.commitmentDangerThreshold,
    ) ?? colors.commitmentLow;

  return (
    <>
      {currentProjectionMonth ? (
        <View style={styles.heroCard}>
          <View style={styles.monthPills}>
            <Pressable
              onPress={() => setIsOtherMonthsVisible(false)}
              style={[
                styles.monthPill,
                !isOtherMonthsVisible ? styles.monthPillActive : null,
              ]}
            >
              <Text
                style={[
                  styles.monthPillText,
                  !isOtherMonthsVisible ? styles.monthPillActiveText : null,
                ]}
              >
                {formatMonthLabel(
                  currentProjectionMonth.year,
                  currentProjectionMonth.month,
                )}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setIsOtherMonthsVisible(true)}
              style={[
                styles.monthPill,
                isOtherMonthsVisible ? styles.monthPillActive : null,
              ]}
            >
              <Text
                style={[
                  styles.monthPillText,
                  isOtherMonthsVisible ? styles.monthPillActiveText : null,
                ]}
              >
                Outros meses
              </Text>
            </Pressable>
          </View>

          {!isOtherMonthsVisible ? (
            <>
              <View style={styles.balancePanel}>
                <Text style={styles.kicker}>Saldo projetado</Text>
                <Text
                  style={[
                    styles.projectedBalance,
                    currentSurplusOrShortfall < 0
                      ? styles.negativeText
                      : styles.positiveText,
                  ]}
                >
                  {maskCurrency(currentSurplusOrShortfall, valuesHidden)}
                </Text>
                <View style={styles.commitmentHeader}>
                  <Text style={styles.commitmentLabel}>
                    Comprometimento do salário + extra
                  </Text>
                  <Text style={[styles.commitmentValue, { color: commitmentColor }]}>
                    {currentCommitmentPercentage === null
                      ? '-'
                      : percentageFormatter.format(currentCommitmentPercentage)}
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: commitmentColor,
                        width: `${commitmentProgress * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.statusHint}>
                  {currentCommitmentPercentage === null
                    ? 'Configure o salário para ver o comprometimento.'
                    : isCommitmentOverLimit
                      ? 'Acima do limite. Revise cartão e empréstimos.'
                      : 'Dentro dos limites configurados.'}
                </Text>
              </View>

              <View style={styles.kpiGrid}>
                <KpiCard
                  label="Despesas"
                  value={maskCurrency(currentMonthlyTotalExpenses, valuesHidden)}
                />
                <KpiCard
                  color={colors.negativeText}
                  label="Pendente"
                  value={maskCurrency(paymentSummary.totalPending, valuesHidden)}
                />
                <KpiCard
                  color={colors.positive}
                  label="Pago"
                  value={maskCurrency(paymentSummary.totalPaid, valuesHidden)}
                />
                <KpiCard
                  color={colors.commitmentMedium}
                  label="Próximo venc."
                  value={
                    nextDueAccount ? `Dia ${nextDueAccount.dueDay}` : 'Nenhum pendente'
                  }
                  detail={
                    nextDueAccount
                      ? [nextDueAccount.name, nextDueAccountCategoryName]
                          .filter(Boolean)
                          .join(' - ')
                      : undefined
                  }
                />
              </View>

              <Pressable onPress={onOpenPayments} style={styles.paymentShortcut}>
                <View>
                  <Text style={styles.paymentShortcutTitle}>Pagamentos do mês</Text>
                  <Text style={styles.paymentShortcutHint}>
                    {currentMonthPendingAccounts.length} pendentes de{' '}
                    {currentMonthPayableAccounts.length} no total
                  </Text>
                </View>
                <View style={styles.paymentShortcutButton}>
                  <Text style={styles.paymentShortcutButtonText}>Detalhes</Text>
                </View>
              </Pressable>
            </>
          ) : (
            projectionMonths.slice(1).map((projectionMonth) => {
              const monthlyTotalExpenses = calculateMonthlyTotalExpenses(
                sortedCategories,
                financeState.accountItems,
                financeState.monthlyValues,
                projectionMonth,
              );
              const salaryCommitmentPercentage = calculateIncomeCommitmentPercentage(
                monthlyTotalExpenses,
                financeState.settings,
                projectionMonth,
              );
              const surplusOrShortfall = calculateSurplusOrShortfall(
                financeState.settings,
                monthlyTotalExpenses,
                projectionMonth,
              );
              const isDetailsOpen = selectedDetailsMonth?.key === projectionMonth.key;

              return (
                <Fragment key={projectionMonth.key}>
                  <MonthSummaryCard
                    commitmentDangerThreshold={
                      financeState.settings.commitmentDangerThreshold
                    }
                    commitmentWarningThreshold={
                      financeState.settings.commitmentWarningThreshold
                    }
                    monthlyTotalExpenses={monthlyTotalExpenses}
                    onOpenDetails={() =>
                      setSelectedDetailsMonthKey(projectionMonth.key)
                    }
                    projectionMonth={projectionMonth}
                    salaryCommitmentPercentage={salaryCommitmentPercentage}
                    surplusOrShortfall={surplusOrShortfall}
                    valuesHidden={valuesHidden}
                  />
                  {isDetailsOpen ? (
                    <MonthDetailsPanel
                      categoryColorsById={categoryColorsById}
                      categoryNamesById={categoryNamesById}
                      categoryTotals={calculateCategoryTotals(
                        sortedCategories,
                        financeState.accountItems,
                        financeState.monthlyValues,
                        projectionMonth,
                      )}
                      monthlyTotalExpenses={monthlyTotalExpenses}
                      onClose={() => setSelectedDetailsMonthKey(null)}
                      projectionMonth={projectionMonth}
                      valuesHidden={valuesHidden}
                    />
                  ) : null}
                </Fragment>
              );
            })
          )}
        </View>
      ) : null}
    </>
  );
}

function KpiCard({
  color,
  detail,
  label,
  value,
}: {
  color?: string;
  detail?: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.kpiCard}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={[styles.kpiValue, color ? { color } : null]}>{value}</Text>
      {detail ? (
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.kpiDetail}>
          {detail}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.background,
    gap: 14,
  },
  monthPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  monthPillActive: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 18,
  },
  monthPillActiveText: {
    color: colors.accentText,
    letterSpacing: 0,
    ...typography.button,
  },
  monthPill: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 18,
  },
  monthPillText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.button,
  },
  balancePanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
  },
  kicker: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.label,
  },
  projectedBalance: {
    letterSpacing: 0,
    marginTop: 6,
    ...typography.amountLarge,
  },
  positiveText: {
    color: colors.positive,
  },
  negativeText: {
    color: colors.negativeText,
  },
  commitmentHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 18,
  },
  commitmentLabel: {
    color: colors.textSecondary,
    flex: 1,
    letterSpacing: 0,
    ...typography.button,
  },
  commitmentValue: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.button,
  },
  progressTrack: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    height: 10,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.negative,
    borderRadius: 999,
    height: '100%',
  },
  statusHint: {
    color: colors.textSecondary,
    letterSpacing: 0,
    marginTop: 10,
    ...typography.bodySmall,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kpiCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 88,
    padding: 14,
  },
  kpiLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    textTransform: 'uppercase',
    ...typography.label,
  },
  kpiValue: {
    color: colors.textPrimary,
    letterSpacing: 0,
    marginTop: 8,
    ...typography.amountMedium,
  },
  kpiDetail: {
    color: colors.textSecondary,
    letterSpacing: 0,
    marginTop: 4,
    ...typography.caption,
  },
  paymentShortcut: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    minHeight: 92,
    padding: 18,
  },
  paymentShortcutTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.sectionTitle,
  },
  paymentShortcutHint: {
    color: colors.textSecondary,
    letterSpacing: 0,
    marginTop: 5,
    ...typography.bodySmall,
  },
  paymentShortcutButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  paymentShortcutButtonText: {
    color: colors.accentText,
    letterSpacing: 0,
    ...typography.button,
  },
});
