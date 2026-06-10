import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { getCategoryColor } from '../../lib/categoryColors';
import {
  calculatePaymentSummary,
  getMonthlyValueAmount,
  isAccountItemPaid,
  ProjectionMonth,
} from '../../lib/financeCalculations';
import { maskCurrency } from '../../lib/formatters';
import { parseDueDay } from '../../lib/inputParsers';
import { MonthlyValueAdjustmentOperation } from '../../lib/monthlyValueAdjustments';
import { sortAccountItemsByDueDay, sortCategories } from '../../lib/sorting';
import { colors } from '../../theme/colors';
import { modalFormStyles } from '../../theme/sharedStyles';
import { typography } from '../../theme/typography';
import {
  AccountItem,
  Category,
  MonthlyPaymentStatus,
  MonthlyValue,
} from '../../types/finance';
import { ActionButton } from '../common/ActionButton';
import { EditableAmountInput } from '../common/EditableAmountInput';
import { ModalShell } from '../common/ModalShell';
import { SelectField } from '../common/SelectField';
import { AdjustmentPanel, adjustmentModeColor } from './AdjustmentPanel';
import { SummaryValue } from './SummaryValue';

const shortMonthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });

function formatPaymentMonthLabel(year: number, month: number) {
  const raw = shortMonthFormatter.format(new Date(year, month - 1, 1)).replace('.', '');
  return `${raw.charAt(0).toUpperCase()}${raw.slice(1)} / ${year}`;
}

type CurrentMonthPaymentChecklistProps = {
  accountItems: AccountItem[];
  categories: Category[];
  initialFilter?: PaymentStatusFilter;
  monthlyValues: MonthlyValue[];
  onAdjustMonthlyValue: (
    accountItemId: string,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
    adjustmentAmount: number,
    operation: MonthlyValueAdjustmentOperation,
  ) => void;
  onCreateAccountItem: (
    name: string,
    categoryId: string,
    dueDay: number,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
    amount: number,
  ) => void;
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
  { id: 'pending', label: 'Pendentes' },
  { id: 'paid', label: 'Pagos' },
  { id: 'all', label: 'Todos' },
];

export function CurrentMonthPaymentChecklist({
  accountItems,
  categories,
  initialFilter = 'all',
  monthlyValues,
  onAdjustMonthlyValue,
  onClose,
  onCreateAccountItem,
  onTogglePaymentStatus,
  paymentStatuses,
  projectionMonth,
  valuesHidden,
}: CurrentMonthPaymentChecklistProps) {
  const [activeFilter, setActiveFilter] = useState<PaymentStatusFilter>(initialFilter);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newDueDay, setNewDueDay] = useState('');
  const [newAmount, setNewAmount] = useState(0);

  // Adjustment panel state
  const [expandedAccountItemId, setExpandedAccountItemId] = useState<string | null>(
    null,
  );
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);
  const [adjustmentMode, setAdjustmentMode] =
    useState<MonthlyValueAdjustmentOperation>('add');

  function openAddModal() {
    const firstCategoryId = categories[0]?.id ?? '';
    setNewName('');
    setNewCategoryId(firstCategoryId);
    setNewDueDay(String(new Date().getDate()));
    setNewAmount(0);
    setIsAddModalOpen(true);
  }

  function closeAddModal() {
    setIsAddModalOpen(false);
  }

  function saveNewAccount() {
    const name = newName.trim();
    const categoryId = newCategoryId || categories[0]?.id || '';

    if (!name || !categoryId) return;

    onCreateAccountItem(
      name,
      categoryId,
      parseDueDay(newDueDay),
      projectionMonth,
      newAmount,
    );
    setIsAddModalOpen(false);
  }

  function openAdjustPanel(accountItemId: string) {
    if (expandedAccountItemId === accountItemId) {
      setExpandedAccountItemId(null);
    } else {
      setExpandedAccountItemId(accountItemId);
      setAdjustmentAmount(0);
      setAdjustmentMode('add');
    }
  }

  function collapseAdjustPanel() {
    setExpandedAccountItemId(null);
  }

  function switchAdjustmentMode(mode: MonthlyValueAdjustmentOperation) {
    setAdjustmentMode(mode);
    setAdjustmentAmount(0);
  }

  function confirmAdjustment(accountItemId: string) {
    onAdjustMonthlyValue(
      accountItemId,
      projectionMonth,
      adjustmentAmount,
      adjustmentMode,
    );
    collapseAdjustPanel();
  }

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
  const activeColor = adjustmentModeColor(adjustmentMode);

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>Pagamentos</Text>
        <Text style={styles.sectionHint}>Marque o que já foi pago.</Text>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>
            {formatPaymentMonthLabel(projectionMonth.year, projectionMonth.month)}
          </Text>
          {onClose ? (
            <ActionButton
              icon="arrow-back"
              label="Voltar"
              onPress={onClose}
              variant="secondary"
            />
          ) : null}
        </View>
        <Pressable
          disabled={categories.length === 0}
          onPress={openAddModal}
          style={[
            styles.addButton,
            categories.length === 0 ? styles.addButtonDisabled : null,
          ]}
        >
          <Text
            style={[
              styles.addButtonText,
              categories.length === 0 ? styles.addButtonTextDisabled : null,
            ]}
          >
            Adicionar conta
          </Text>
        </Pressable>
        {categories.length === 0 ? (
          <Text style={styles.addButtonHint}>
            Crie uma categoria em Contas primeiro.
          </Text>
        ) : null}
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
                adjustsFontSizeToFit
                numberOfLines={1}
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
            const isExpanded = expandedAccountItemId === accountItem.id;

            return (
              <View
                key={accountItem.id}
                style={[
                  styles.paymentRowWrapper,
                  isPaid ? styles.paymentRowPaid : null,
                  isExpanded ? { borderColor: activeColor } : null,
                ]}
              >
                {/* Tappable top row for toggling payment status */}
                <Pressable
                  onPress={() => onTogglePaymentStatus(accountItem.id, projectionMonth)}
                  style={styles.paymentRowTop}
                >
                  <View style={[styles.checkbox, isPaid ? styles.checkboxPaid : null]}>
                    {isPaid ? (
                      <Ionicons color={colors.accentText} name="checkmark" size={16} />
                    ) : null}
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
                  {/* ± button — stops propagation so it doesn't toggle payment */}
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      openAdjustPanel(accountItem.id);
                    }}
                    style={styles.adjustToggleButton}
                  >
                    <Ionicons
                      color={colors.textSecondary}
                      name="calculator-outline"
                      size={18}
                    />
                  </Pressable>
                </Pressable>

                {/* Inline adjustment panel */}
                {isExpanded ? (
                  <View style={styles.adjustPanel}>
                    <AdjustmentPanel
                      adjustmentAmount={adjustmentAmount}
                      adjustmentMode={adjustmentMode}
                      currentAmount={amount}
                      onCancel={collapseAdjustPanel}
                      onChangeAmount={setAdjustmentAmount}
                      onConfirm={() => confirmAdjustment(accountItem.id)}
                      onSwitchMode={switchAdjustmentMode}
                      valuesHidden={valuesHidden}
                    />
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={styles.emptyText}>{getEmptyText(activeFilter)}</Text>
      )}

      <ModalShell
        onRequestClose={closeAddModal}
        title={`Nova conta — ${formatPaymentMonthLabel(projectionMonth.year, projectionMonth.month)}`}
        visible={isAddModalOpen}
      >
        <TextInput
          autoFocus
          onChangeText={setNewName}
          placeholder="Nome da conta..."
          placeholderTextColor={colors.textSecondary}
          style={styles.modalInput}
          value={newName}
        />

        <SelectField
          fieldLabel="Categoria"
          onChange={setNewCategoryId}
          options={sortCategories(categories).map((category) => ({
            id: category.id,
            label: category.name,
            color: getCategoryColor(category.id, categories),
          }))}
          value={newCategoryId}
        />

        <View style={styles.modalRow}>
          <View style={styles.modalFieldDueDay}>
            <Text style={styles.modalFieldLabel}>Dia de venc.</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={setNewDueDay}
              placeholder="1"
              placeholderTextColor={colors.textSecondary}
              style={styles.modalInput}
              value={newDueDay}
            />
          </View>
          <View style={styles.modalFieldValue}>
            <Text style={styles.modalFieldLabel}>
              {`Valor (${formatPaymentMonthLabel(projectionMonth.year, projectionMonth.month)})`}
            </Text>
            <EditableAmountInput
              immediate
              onChangeValue={setNewAmount}
              style={styles.modalInput}
              value={newAmount}
            />
          </View>
        </View>

        <View style={styles.modalActions}>
          <Pressable onPress={closeAddModal} style={styles.modalCancelButton}>
            <Text style={styles.modalCancelButtonText}>Cancelar</Text>
          </Pressable>
          <Pressable onPress={saveNewAccount} style={styles.modalSaveButton}>
            <Text style={styles.modalSaveButtonText}>Salvar</Text>
          </Pressable>
        </View>
      </ModalShell>
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
  modalInput: modalFormStyles.input,
  modalActions: modalFormStyles.actions,
  modalCancelButton: modalFormStyles.cancelButton,
  modalCancelButtonText: modalFormStyles.cancelButtonText,
  modalSaveButtonText: modalFormStyles.confirmButtonText,
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  header: {
    gap: 6,
  },
  sectionLabel: {
    color: colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    ...typography.label,
  },
  sectionHint: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.bodySmall,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.sectionTitle,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
  },
  addButtonDisabled: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderWidth: 1,
  },
  addButtonText: {
    color: colors.accentText,
    letterSpacing: 0,
    ...typography.button,
  },
  addButtonTextDisabled: {
    color: colors.textSecondary,
  },
  addButtonHint: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.bodySmall,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  filterButton: {
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
  filterButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterButtonText: {
    color: colors.textPrimary,
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
  paymentRowWrapper: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  paymentRowPaid: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.positive,
  },
  paymentRowTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    minHeight: 62,
    padding: 10,
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
  adjustToggleButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  adjustPanel: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: 8,
    padding: 10,
  },
  emptyText: {
    color: colors.textSecondary,
    marginTop: 12,
    ...typography.body,
  },
  modalFieldLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    marginBottom: 4,
    ...typography.label,
  },
  modalRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalFieldDueDay: {
    flex: 1,
  },
  modalFieldValue: {
    flex: 2,
  },
  modalSaveButton: {
    ...modalFormStyles.confirmButton,
    minWidth: 96,
  },
});
