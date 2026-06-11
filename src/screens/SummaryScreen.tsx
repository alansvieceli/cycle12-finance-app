import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fragment, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ModalShell } from '../components/common/ModalShell';

import { HistoryCard } from '../components/finance/HistoryCard';
import { MonthDetailsPanel } from '../components/finance/MonthDetailsPanel';
import { MonthSummaryCard } from '../components/finance/MonthSummaryCard';
import { SalaryDistributionPanel } from '../components/finance/SalaryDistributionPanel';
import { buildSalaryDistribution } from '../lib/salaryDistribution';
import {
  calculateAvailableIncome,
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
import { EditableAmountInput } from '../components/common/EditableAmountInput';
import { getCategoryColor } from '../lib/categoryColors';
import { sortAccountItemsByDueDay, sortCategories } from '../lib/sorting';
import { colors } from '../theme/colors';
import { modalFormStyles } from '../theme/sharedStyles';
import { typography } from '../theme/typography';
import { FinanceState } from '../types/finance';

type ActiveView = 'current' | 'other' | 'history';

type SummaryScreenProps = {
  financeState: FinanceState;
  onAddExtra: (amount: number) => void;
  onOpenPayments: () => void;
  projectionMonths: ProjectionMonth[];
  valuesHidden: boolean;
};

export function SummaryScreen({
  financeState,
  onAddExtra,
  onOpenPayments,
  projectionMonths,
  valuesHidden,
}: SummaryScreenProps) {
  const [selectedDetailsMonthKey, setSelectedDetailsMonthKey] = useState<string | null>(
    null,
  );
  const [activeView, setActiveView] = useState<ActiveView>('current');
  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
  const [extraAmount, setExtraAmount] = useState(0);
  const [expandedHistoryKey, setExpandedHistoryKey] = useState<string | null>(null);
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
    ? financeState.accountItems.filter(
        (accountItem) =>
          getMonthlyValueAmount(
            financeState.monthlyValues,
            accountItem.id,
            currentProjectionMonth,
          ) > 0,
      )
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
  const commitmentColor =
    resolveCommitmentColor(
      currentCommitmentPercentage,
      financeState.settings.commitmentWarningThreshold,
      financeState.settings.commitmentDangerThreshold,
    ) ?? colors.commitmentLow;
  const currentAvailableIncome = currentProjectionMonth
    ? calculateAvailableIncome(financeState.settings, currentProjectionMonth)
    : 0;
  const salaryDistribution = currentProjectionMonth
    ? buildSalaryDistribution(financeState, currentProjectionMonth)
    : null;

  const daysUntilNextDue = (() => {
    if (!nextDueAccount?.dueDay || !currentProjectionMonth) return null;
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDate = new Date(
      currentProjectionMonth.year,
      currentProjectionMonth.month - 1,
      nextDueAccount.dueDay,
    );
    return Math.round(
      (dueDate.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24),
    );
  })();

  return (
    <>
      {currentProjectionMonth ? (
        <View style={styles.heroCard}>
          <View style={styles.monthPills}>
            <Pressable
              onPress={() => setActiveView('current')}
              style={[
                styles.monthPill,
                activeView === 'current' ? styles.monthPillActive : null,
              ]}
            >
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={[
                  styles.monthPillText,
                  activeView === 'current' ? styles.monthPillActiveText : null,
                ]}
              >
                {formatMonthLabel(
                  currentProjectionMonth.year,
                  currentProjectionMonth.month,
                )}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveView('other')}
              style={[
                styles.monthPill,
                activeView === 'other' ? styles.monthPillActive : null,
              ]}
            >
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={[
                  styles.monthPillText,
                  activeView === 'other' ? styles.monthPillActiveText : null,
                ]}
              >
                Projeção
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveView('history')}
              style={[
                styles.monthPill,
                activeView === 'history' ? styles.monthPillActive : null,
              ]}
            >
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={[
                  styles.monthPillText,
                  activeView === 'history' ? styles.monthPillActiveText : null,
                ]}
              >
                Histórico
              </Text>
            </Pressable>
          </View>

          {activeView === 'current' ? (
            <>
              <View style={styles.balancePanel}>
                <Text style={styles.kicker}>Saldo projetado</Text>
                <View style={styles.balanceRow}>
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
                  <Pressable
                    onPress={() => {
                      setExtraAmount(0);
                      setIsExtraModalOpen(true);
                    }}
                    style={styles.addExtraButton}
                  >
                    <MaterialCommunityIcons
                      color={colors.accentText}
                      name="plus-thick"
                      size={20}
                    />
                  </Pressable>
                </View>
                <View style={styles.incomeRow}>
                  <Text style={styles.incomeLabel}>Recebido</Text>
                  <Text style={styles.incomeValue}>
                    {maskCurrency(currentAvailableIncome, valuesHidden)}
                  </Text>
                </View>
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
              </View>

              {salaryDistribution ? (
                <SalaryDistributionPanel
                  distribution={salaryDistribution}
                  valuesHidden={valuesHidden}
                />
              ) : null}

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
                  subvalue={
                    daysUntilNextDue === null
                      ? undefined
                      : daysUntilNextDue === 0
                        ? 'hoje'
                        : daysUntilNextDue < 0
                          ? `${Math.abs(daysUntilNextDue)}d atrás`
                          : `em ${daysUntilNextDue}d`
                  }
                />
              </View>

              <Pressable onPress={onOpenPayments} style={styles.paymentShortcut}>
                <View style={styles.paymentShortcutLeft}>
                  <Text style={styles.paymentShortcutTitle}>Pagamentos do mês</Text>
                  <Text style={styles.paymentShortcutHint}>
                    {currentMonthPendingAccounts.length} pendentes de{' '}
                    {currentMonthPayableAccounts.length} no total
                  </Text>
                  {currentMonthPayableAccounts.length > 0 ? (
                    <View style={styles.paymentProgressTrack}>
                      <View
                        style={[
                          styles.paymentProgressFill,
                          {
                            width: `${
                              ((currentMonthPayableAccounts.length -
                                currentMonthPendingAccounts.length) /
                                currentMonthPayableAccounts.length) *
                              100
                            }%`,
                          },
                        ]}
                      />
                    </View>
                  ) : null}
                </View>
                <View style={styles.paymentShortcutButton}>
                  <Text style={styles.paymentShortcutButtonText}>Detalhes</Text>
                </View>
              </Pressable>

              <ModalShell
                closeOnOverlayPress
                onRequestClose={() => setIsExtraModalOpen(false)}
                title="Adicionar extra do mês"
                visible={isExtraModalOpen}
              >
                <EditableAmountInput
                  autoFocus
                  immediate
                  onChangeValue={setExtraAmount}
                  style={styles.modalInput}
                  value={extraAmount}
                />
                <View style={styles.modalActions}>
                  <Pressable
                    onPress={() => setIsExtraModalOpen(false)}
                    style={styles.modalCancelButton}
                  >
                    <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      if (extraAmount > 0) {
                        onAddExtra(extraAmount);
                      }
                      setIsExtraModalOpen(false);
                    }}
                    style={styles.modalConfirmButton}
                  >
                    <Text style={styles.modalConfirmButtonText}>
                      {valuesHidden
                        ? 'Nova extra ••••'
                        : `Nova extra ${maskCurrency(
                            financeState.settings.currentMonthExtraBalance +
                              extraAmount,
                            false,
                          )}`}
                    </Text>
                  </Pressable>
                </View>
              </ModalShell>
            </>
          ) : activeView === 'other' ? (
            <>
              <View style={styles.projectionIncomePanel}>
                <Text style={styles.projectionIncomeLabel}>Valor a receber</Text>
                <Text style={styles.projectionIncomeValue}>
                  {maskCurrency(financeState.settings.monthlySalary, valuesHidden)}
                </Text>
              </View>
              {projectionMonths.slice(1).map((projectionMonth) => {
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
                        setSelectedDetailsMonthKey((prev) =>
                          prev === projectionMonth.key ? null : projectionMonth.key,
                        )
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
              })}
            </>
          ) : (
            <>
              {financeState.monthHistory.length === 0 ? (
                <View style={styles.emptyHistory}>
                  <Text style={styles.emptyHistoryText}>
                    Nenhum mês registrado ainda. O histórico é salvo automaticamente
                    quando o mês avança.
                  </Text>
                </View>
              ) : (
                financeState.monthHistory.map((entry) => {
                  const key = `${entry.year}-${entry.month}`;
                  return (
                    <HistoryCard
                      key={key}
                      categories={sortedCategories}
                      entry={entry}
                      isExpanded={expandedHistoryKey === key}
                      onToggle={() =>
                        setExpandedHistoryKey((prev) => (prev === key ? null : key))
                      }
                      settings={financeState.settings}
                      valuesHidden={valuesHidden}
                    />
                  );
                })
              )}
            </>
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
  subvalue,
  value,
}: {
  color?: string;
  detail?: string;
  label: string;
  subvalue?: string;
  value: string;
}) {
  return (
    <View style={styles.kpiCard}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <View style={styles.kpiValueRow}>
        <Text style={[styles.kpiValue, color ? { color } : null]}>{value}</Text>
        {subvalue ? (
          <Text style={[styles.kpiSubvalue, color ? { color } : null]}>{subvalue}</Text>
        ) : null}
      </View>
      {detail ? (
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.kpiDetail}>
          {detail}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  modalActions: modalFormStyles.actions,
  modalCancelButton: modalFormStyles.cancelButton,
  modalCancelButtonText: modalFormStyles.cancelButtonText,
  modalConfirmButtonText: modalFormStyles.confirmButtonText,
  heroCard: {
    backgroundColor: colors.background,
    gap: 14,
  },
  monthPills: {
    flexDirection: 'row',
    gap: 10,
  },
  monthPillActive: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 16,
    flex: 1,
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
    flex: 1,
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
  balanceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  addExtraButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 999,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  modalInput: {
    ...modalFormStyles.input,
    textAlign: 'center',
  },
  modalConfirmButton: {
    ...modalFormStyles.confirmButton,
    flex: 1,
  },
  incomeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  incomeLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.button,
  },
  incomeValue: {
    color: colors.positive,
    letterSpacing: 0,
    ...typography.button,
  },
  projectionIncomePanel: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  projectionIncomeLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.button,
  },
  projectionIncomeValue: {
    color: colors.positive,
    letterSpacing: 0,
    ...typography.amountMedium,
  },
  kicker: {
    color: colors.textSecondary,
    letterSpacing: 0,
    textTransform: 'uppercase',
    ...typography.label,
  },
  projectedBalance: {
    letterSpacing: 0,
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
  kpiValueRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  kpiValue: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.amountMedium,
  },
  kpiSubvalue: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.caption,
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
  paymentShortcutLeft: {
    flex: 1,
    gap: 6,
  },
  paymentProgressTrack: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    height: 6,
    overflow: 'hidden',
  },
  paymentProgressFill: {
    backgroundColor: colors.positive,
    borderRadius: 999,
    height: '100%',
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
  emptyHistory: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 120,
    padding: 24,
  },
  emptyHistoryText: {
    color: colors.textSecondary,
    textAlign: 'center',
    ...typography.body,
  },
});
