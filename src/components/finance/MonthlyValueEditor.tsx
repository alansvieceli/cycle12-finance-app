import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { getCategoryColor } from '../../lib/categoryColors';
import {
  getCategoryName,
  getMonthlyValueAmount,
  isAccountItemReviewed,
  type ProjectionMonth,
} from '../../lib/financeCalculations';
import {
  currencyFormatter,
  formatMonthLabel,
  maskCurrency,
} from '../../lib/formatters';
import {
  type MonthlyValueImportEntry,
  parseMonthlyValueList,
} from '../../lib/inputParsers';
import { buildInstallmentMonths } from '../../lib/installmentMonths';
import type { MonthlyValueAdjustmentOperation } from '../../lib/monthlyValueAdjustments';
import { sortAccountItems } from '../../lib/sorting';
import { colors } from '../../theme/colors';
import { modalFormStyles, panelStyles } from '../../theme/sharedStyles';
import { typography } from '../../theme/typography';
import type {
  AccountItem,
  Category,
  MonthlyPaymentStatus,
  MonthlyValue,
  MonthNumber,
} from '../../types/finance';
import { ActionButton } from '../common/ActionButton';
import { EditableAmountInput } from '../common/EditableAmountInput';
import { ModalShell } from '../common/ModalShell';
import { SelectField } from '../common/SelectField';
import { AdjustmentPanel } from './AdjustmentPanel';

const shortMonthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
});

type MonthlyValueEditorProps = {
  accountItems: AccountItem[];
  categories: Category[];
  monthlyValues: MonthlyValue[];
  onChangeMonthlyValue: (
    accountItemId: string,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
    amount: number,
  ) => void;
  onAdjustMonthlyValue: (
    accountItemId: string,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
    adjustmentAmount: number,
    operation: MonthlyValueAdjustmentOperation,
    installments?: number,
  ) => void;
  onReplaceMonthlyValues: (
    accountItemId: string,
    entries: MonthlyValueImportEntry[],
  ) => void;
  onSelectAccountItem: (accountItemId: string) => void;
  onToggleReview: (
    accountItemId: string,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
  ) => void;
  paymentStatuses: MonthlyPaymentStatus[];
  projectionMonths: ProjectionMonth[];
  selectedAccountItem?: AccountItem;
  valuesHidden?: boolean;
};

export function MonthlyValueEditor({
  accountItems,
  categories,
  monthlyValues,
  onAdjustMonthlyValue,
  onChangeMonthlyValue,
  onReplaceMonthlyValues,
  onSelectAccountItem,
  onToggleReview,
  paymentStatuses,
  projectionMonths,
  selectedAccountItem,
  valuesHidden = false,
}: MonthlyValueEditorProps) {
  const [activeAdjustmentMonthKey, setActiveAdjustmentMonthKey] = useState<
    string | null
  >(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);
  const [adjustmentMode, setAdjustmentMode] =
    useState<MonthlyValueAdjustmentOperation>('add');
  const [installments, setInstallments] = useState(1);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<MonthlyValueImportEntry[] | null>(
    null,
  );

  function openAdjustModal(projectionMonth: ProjectionMonth) {
    setActiveAdjustmentMonthKey(projectionMonth.key);
    setAdjustmentAmount(0);
    setAdjustmentMode('add');
    setInstallments(1);
  }

  function closeAdjustModal() {
    setActiveAdjustmentMonthKey(null);
  }

  function switchAdjustmentMode(mode: MonthlyValueAdjustmentOperation) {
    setAdjustmentMode(mode);
    setAdjustmentAmount(0);
    setInstallments(1);
  }

  function confirmAdjustment(projectionMonth: ProjectionMonth) {
    if (!selectedAccountItem) return;
    onAdjustMonthlyValue(
      selectedAccountItem.id,
      projectionMonth,
      adjustmentAmount,
      adjustmentMode,
      adjustmentMode === 'add' ? installments : undefined,
    );
    closeAdjustModal();
  }

  function openImportModal() {
    setImportText('');
    setImportError(null);
    setImportPreview(null);
    setIsImportModalOpen(true);
  }

  function closeImportModal() {
    setIsImportModalOpen(false);
    setImportText('');
    setImportError(null);
    setImportPreview(null);
  }

  function buildImportPreview() {
    const result = parseMonthlyValueList(importText, projectionMonths);

    if (!result.ok) {
      setImportError(
        result.invalidLine
          ? `Linha ${result.invalidLine}: use apenas números com vírgula e até duas casas decimais.`
          : 'Cole ao menos um valor.',
      );
      return;
    }

    setImportError(null);
    setImportPreview(result.entries);
  }

  function confirmImport() {
    if (!selectedAccountItem || !importPreview) return;

    onReplaceMonthlyValues(selectedAccountItem.id, importPreview);
    closeImportModal();
  }

  const activeAdjustmentMonth = projectionMonths.find(
    (pm) => pm.key === activeAdjustmentMonthKey,
  );

  const annualTotal = useMemo(() => {
    if (!selectedAccountItem) return 0;
    return projectionMonths.reduce(
      (sum, pm) =>
        sum + getMonthlyValueAmount(monthlyValues, selectedAccountItem.id, pm),
      0,
    );
  }, [monthlyValues, projectionMonths, selectedAccountItem]);

  const currentProjectionMonth =
    projectionMonths.find((projectionMonth) => projectionMonth.isCurrentMonth) ??
    projectionMonths[0];
  const isSelectedAccountReviewed = Boolean(
    selectedAccountItem &&
      currentProjectionMonth &&
      isAccountItemReviewed(
        paymentStatuses,
        selectedAccountItem.id,
        currentProjectionMonth,
      ),
  );

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Planejamento mensal</Text>
      {selectedAccountItem ? (
        <>
          <View style={styles.accountRow}>
            <View style={styles.accountSelect}>
              <SelectField
                fieldLabel="Conta"
                onChange={onSelectAccountItem}
                options={sortAccountItems(accountItems, categories).map(
                  (accountItem) => ({
                    id: accountItem.id,
                    label: accountItem.name,
                    sublabel: getCategoryName(categories, accountItem.categoryId),
                    color: getCategoryColor(accountItem.categoryId, categories),
                    marked: currentProjectionMonth
                      ? isAccountItemReviewed(
                          paymentStatuses,
                          accountItem.id,
                          currentProjectionMonth,
                        )
                      : false,
                  }),
                )}
                value={selectedAccountItem.id}
              />
            </View>
            {currentProjectionMonth ? (
              <Pressable
                accessibilityLabel={
                  isSelectedAccountReviewed
                    ? 'Desmarcar conta revisada'
                    : 'Marcar conta como revisada'
                }
                onPress={() =>
                  onToggleReview(selectedAccountItem.id, currentProjectionMonth)
                }
                style={[
                  styles.accountActionButton,
                  isSelectedAccountReviewed ? styles.reviewButtonActive : null,
                ]}
              >
                <Ionicons
                  color={
                    isSelectedAccountReviewed ? colors.accentText : colors.textSecondary
                  }
                  name="checkmark"
                  size={20}
                />
              </Pressable>
            ) : null}
            <Pressable
              accessibilityLabel="Importar valores"
              onPress={openImportModal}
              style={styles.accountActionButton}
            >
              <Ionicons
                color={colors.textSecondary}
                name="download-outline"
                size={20}
              />
            </Pressable>
          </View>

          <View style={styles.monthValueList}>
            {projectionMonths.map((projectionMonth, index) => {
              const amount = getMonthlyValueAmount(
                monthlyValues,
                selectedAccountItem.id,
                projectionMonth,
              );
              const isZero = amount === 0;
              const isCurrent = projectionMonth.isCurrentMonth;
              const isEven = index % 2 === 0;

              return (
                <View
                  key={projectionMonth.key}
                  style={[
                    styles.monthValueItem,
                    isEven ? styles.monthValueItemEven : null,
                    isCurrent ? styles.monthValueItemCurrent : null,
                  ]}
                >
                  <View style={styles.monthValueRow}>
                    <View style={styles.monthValueLabel}>
                      <Text
                        style={[
                          styles.monthValueName,
                          isCurrent ? styles.monthValueNameCurrent : null,
                        ]}
                      >
                        {formatMonthLabel(projectionMonth.year, projectionMonth.month)}
                      </Text>
                      {isCurrent ? (
                        <Text style={styles.currentMonthBadge}>Atual</Text>
                      ) : null}
                    </View>
                    <View style={styles.monthValueControlGroup}>
                      <EditableAmountInput
                        onChangeValue={(value) =>
                          onChangeMonthlyValue(
                            selectedAccountItem.id,
                            projectionMonth,
                            value,
                          )
                        }
                        style={[
                          styles.input,
                          styles.monthValueInput,
                          isZero ? styles.monthValueInputZero : null,
                        ]}
                        value={amount}
                        valuesHidden={valuesHidden}
                      />
                      <Pressable
                        accessibilityLabel="Ajustar valor"
                        onPress={() => openAdjustModal(projectionMonth)}
                        style={styles.adjustToggleButton}
                      >
                        <Ionicons
                          color={colors.textSecondary}
                          name="calculator-outline"
                          size={18}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.annualTotalRow}>
            <Text style={styles.annualTotalLabel}>Total dos 12 meses</Text>
            <Text style={styles.annualTotalValue}>
              {maskCurrency(annualTotal, valuesHidden)}
            </Text>
          </View>

          <ModalShell
            cardStyle={styles.adjustModalCard}
            onRequestClose={closeAdjustModal}
            visible={Boolean(activeAdjustmentMonth)}
          >
            {activeAdjustmentMonth ? (
              <AdjustPanel
                accountItemId={selectedAccountItem.id}
                adjustmentAmount={adjustmentAmount}
                adjustmentMode={adjustmentMode}
                installments={installments}
                monthlyValues={monthlyValues}
                onCancel={closeAdjustModal}
                onConfirm={() => confirmAdjustment(activeAdjustmentMonth)}
                onInputChange={setAdjustmentAmount}
                onInstallmentsChange={setInstallments}
                onSwitchMode={switchAdjustmentMode}
                projectionMonth={activeAdjustmentMonth}
                projectionMonths={projectionMonths}
                valuesHidden={valuesHidden}
              />
            ) : null}
          </ModalShell>

          <ModalShell
            onRequestClose={closeImportModal}
            title={importPreview ? 'Confirmar importação' : 'Importar valores'}
            visible={isImportModalOpen}
          >
            {importPreview ? (
              <>
                <Text style={styles.importAccountName}>{selectedAccountItem.name}</Text>
                <ScrollView style={styles.importPreviewList}>
                  {importPreview.map((entry) => (
                    <View
                      key={`${entry.year}-${entry.month}`}
                      style={styles.importPreviewRow}
                    >
                      <Text style={styles.importPreviewMonth}>
                        {formatMonthLabel(entry.year, entry.month)}
                      </Text>
                      <Text style={styles.importPreviewValue}>
                        {`${currencyFormatter.format(
                          getMonthlyValueAmount(
                            monthlyValues,
                            selectedAccountItem.id,
                            entry,
                          ),
                        )} → ${currencyFormatter.format(entry.amount)}`}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
                <View style={modalFormStyles.actions}>
                  <ActionButton
                    label="Voltar"
                    onPress={() => setImportPreview(null)}
                    variant="secondary"
                  />
                  <ActionButton
                    label="Cancelar"
                    onPress={closeImportModal}
                    variant="secondary"
                  />
                  <ActionButton label="Confirmar" onPress={confirmImport} />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.importAccountName}>{selectedAccountItem.name}</Text>
                <Text style={styles.importHint}>
                  Cole um valor por linha. A primeira linha corresponde ao mês atual.
                </Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  multiline
                  onChangeText={(value) => {
                    setImportText(value);
                    setImportError(null);
                  }}
                  placeholder="Um valor por linha"
                  placeholderTextColor={colors.textSecondary}
                  style={styles.importInput}
                  value={importText}
                />
                {importError ? (
                  <Text style={styles.importError}>{importError}</Text>
                ) : null}
                <View style={modalFormStyles.actions}>
                  <ActionButton
                    label="Cancelar"
                    onPress={closeImportModal}
                    variant="secondary"
                  />
                  <ActionButton
                    disabled={!importText.trim()}
                    label="Continuar"
                    onPress={buildImportPreview}
                  />
                </View>
              </>
            )}
          </ModalShell>
        </>
      ) : (
        <Text style={styles.emptyText}>
          Crie uma categoria e uma conta para editar valores mensais.
        </Text>
      )}
    </View>
  );
}

type AdjustPanelProps = {
  accountItemId: string;
  adjustmentAmount: number;
  adjustmentMode: MonthlyValueAdjustmentOperation;
  installments: number;
  monthlyValues: MonthlyValue[];
  onCancel: () => void;
  onConfirm: () => void;
  onInputChange: (value: number) => void;
  onInstallmentsChange: (value: number) => void;
  onSwitchMode: (mode: MonthlyValueAdjustmentOperation) => void;
  projectionMonth: ProjectionMonth;
  projectionMonths: ProjectionMonth[];
  valuesHidden: boolean;
};

function AdjustPanel({
  accountItemId,
  adjustmentAmount,
  adjustmentMode,
  installments,
  monthlyValues,
  onCancel,
  onConfirm,
  onInputChange,
  onInstallmentsChange,
  onSwitchMode,
  projectionMonth,
  projectionMonths,
  valuesHidden,
}: AdjustPanelProps) {
  const currentAmount = getMonthlyValueAmount(
    monthlyValues,
    accountItemId,
    projectionMonth,
  );
  const monthIndex = projectionMonths.findIndex((pm) => pm.key === projectionMonth.key);
  const maxInstallments = projectionMonths.length - Math.max(monthIndex, 0);
  const affectedInstallmentMonths =
    adjustmentMode === 'add' && projectionMonths[0]
      ? buildInstallmentMonths(
          projectionMonth.year,
          projectionMonth.month,
          installments,
          projectionMonths[0].year,
          projectionMonths[0].month,
        )
      : [];
  const shouldShowInstallmentSummary =
    adjustmentMode === 'add' &&
    installments > 1 &&
    affectedInstallmentMonths.length > 0;

  return (
    <View style={styles.adjustPanelContent}>
      <Text style={styles.adjustTitle}>
        {`Ajustar — ${formatMonthLabel(projectionMonth.year, projectionMonth.month)}`}
      </Text>

      <AdjustmentPanel
        adjustmentAmount={adjustmentAmount}
        adjustmentMode={adjustmentMode}
        currentAmount={currentAmount}
        onCancel={onCancel}
        onChangeAmount={onInputChange}
        onConfirm={onConfirm}
        onSwitchMode={onSwitchMode}
        valuesHidden={valuesHidden}
      >
        {adjustmentMode === 'add' ? (
          <>
            <SelectField
              fieldLabel="Parcelas"
              onChange={(id) => onInstallmentsChange(Number(id))}
              options={Array.from({ length: maxInstallments }, (_, i) => {
                const option = i + 1;
                return {
                  id: String(option),
                  label: option === 1 ? '1 mês' : `${option} meses`,
                };
              })}
              value={String(installments)}
            />
            {shouldShowInstallmentSummary ? (
              <Text style={styles.installmentSummary}>
                {formatInstallmentSummary(
                  adjustmentAmount,
                  installments,
                  affectedInstallmentMonths,
                )}
              </Text>
            ) : null}
          </>
        ) : null}
      </AdjustmentPanel>
    </View>
  );
}

function formatInstallmentSummary(
  adjustmentAmount: number,
  installments: number,
  affectedMonths: { year: number; month: MonthNumber }[],
) {
  const formattedAmount = currencyFormatter.format(adjustmentAmount);
  const monthLabels = affectedMonths
    .map(({ month, year }) =>
      shortMonthFormatter
        .format(new Date(year, month - 1, 1))
        .replace('.', '')
        .replace(/^\w/, (firstLetter) => firstLetter.toUpperCase()),
    )
    .join(', ');

  return `+ ${formattedAmount} × ${installments} meses → ${monthLabels}`;
}

const styles = StyleSheet.create({
  emptyText: panelStyles.emptyText,
  input: modalFormStyles.input,
  sectionTitle: panelStyles.sectionTitle,
  panel: {
    ...panelStyles.panel,
    gap: 14,
  },
  accountRow: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: 8,
  },
  accountSelect: {
    flex: 1,
  },
  accountActionButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    width: 44,
  },
  reviewButtonActive: {
    backgroundColor: colors.info,
    borderColor: colors.info,
  },
  monthValueList: {
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  monthValueItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  monthValueItemEven: {
    backgroundColor: colors.surfaceMuted,
  },
  monthValueItemCurrent: {
    backgroundColor: colors.surfaceRaised,
    borderLeftColor: colors.accent,
    borderLeftWidth: 3,
  },
  monthValueRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  monthValueLabel: {
    flex: 1,
    gap: 2,
    minWidth: 92,
  },
  monthValueName: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.body,
  },
  monthValueNameCurrent: {
    color: colors.accent,
  },
  currentMonthBadge: {
    color: colors.accent,
    letterSpacing: 0,
    textTransform: 'uppercase',
    ...typography.label,
  },
  monthValueControlGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  monthValueInput: {
    textAlign: 'right',
    width: 106,
  },
  monthValueInputZero: {
    color: colors.textSecondary,
  },
  adjustToggleButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    width: 44,
  },
  annualTotalRow: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  annualTotalLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    textTransform: 'uppercase',
    ...typography.label,
  },
  annualTotalValue: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.amountSmall,
  },
  adjustModalCard: {
    gap: 0,
    padding: 0,
  },
  adjustPanelContent: {
    gap: 12,
    padding: 16,
  },
  adjustTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.cardTitle,
  },
  installmentSummary: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.bodySmall,
  },
  importAccountName: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.cardTitle,
  },
  importHint: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.bodySmall,
  },
  importInput: {
    ...modalFormStyles.input,
    minHeight: 160,
    textAlignVertical: 'top',
  },
  importError: {
    color: colors.negativeText,
    letterSpacing: 0,
    ...typography.bodySmall,
  },
  importPreviewList: {
    maxHeight: 300,
  },
  importPreviewRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 4,
    paddingVertical: 8,
  },
  importPreviewMonth: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.label,
  },
  importPreviewValue: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.body,
  },
});
