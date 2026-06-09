import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { getCategoryColor } from '../../lib/categoryColors';
import { ProjectionMonth } from '../../lib/financeCalculations';
import {
  currencyFormatter,
  formatMonthLabel,
  maskCurrency,
} from '../../lib/formatters';
import { buildInstallmentMonths } from '../../lib/installmentMonths';
import { parseCurrencyInput } from '../../lib/inputParsers';
import {
  calculateAdjustedMonthlyValue,
  MonthlyValueAdjustmentOperation,
} from '../../lib/monthlyValueAdjustments';
import { sortAccountItems } from '../../lib/sorting';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { AccountItem, Category, MonthNumber, MonthlyValue } from '../../types/finance';
import { EditableAmountInput } from '../common/EditableAmountInput';
import { SelectField } from '../common/SelectField';

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
    amount: string,
  ) => void;
  onAdjustMonthlyValue: (
    accountItemId: string,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
    adjustmentInput: string,
    operation: MonthlyValueAdjustmentOperation,
    installments?: number,
  ) => void;
  onSelectAccountItem: (accountItemId: string) => void;
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
  onSelectAccountItem,
  projectionMonths,
  selectedAccountItem,
  valuesHidden = false,
}: MonthlyValueEditorProps) {
  const [activeAdjustmentMonthKey, setActiveAdjustmentMonthKey] = useState<
    string | null
  >(null);
  const [adjustmentInput, setAdjustmentInput] = useState('');
  const [adjustmentMode, setAdjustmentMode] =
    useState<MonthlyValueAdjustmentOperation>('add');
  const [installmentsInput, setInstallmentsInput] = useState('1');

  function openAdjustModal(projectionMonth: ProjectionMonth) {
    setActiveAdjustmentMonthKey(projectionMonth.key);
    setAdjustmentInput('');
    setAdjustmentMode('add');
    setInstallmentsInput('1');
  }

  function closeAdjustModal() {
    setActiveAdjustmentMonthKey(null);
  }

  function switchAdjustmentMode(mode: MonthlyValueAdjustmentOperation) {
    setAdjustmentMode(mode);
    setAdjustmentInput('');
    setInstallmentsInput('1');
  }

  function confirmAdjustment(projectionMonth: ProjectionMonth) {
    if (!selectedAccountItem) return;
    onAdjustMonthlyValue(
      selectedAccountItem.id,
      projectionMonth,
      adjustmentInput,
      adjustmentMode,
      adjustmentMode === 'add' ? parseInstallmentsInput(installmentsInput) : undefined,
    );
    closeAdjustModal();
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

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Planejamento mensal</Text>
      {selectedAccountItem ? (
        <>
          <SelectField
            fieldLabel="Conta"
            onChange={onSelectAccountItem}
            options={sortAccountItems(accountItems, categories).map((accountItem) => ({
              id: accountItem.id,
              label: accountItem.name,
              sublabel: getCategoryName(categories, accountItem.categoryId),
              color: getCategoryColor(accountItem.categoryId, categories),
            }))}
            value={selectedAccountItem.id}
          />

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
            <Text style={styles.annualTotalLabel}>Total do ano</Text>
            <Text style={styles.annualTotalValue}>
              {maskCurrency(annualTotal, valuesHidden)}
            </Text>
          </View>

          <Modal
            animationType="fade"
            onRequestClose={closeAdjustModal}
            transparent
            visible={Boolean(activeAdjustmentMonth)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                {activeAdjustmentMonth ? (
                  <AdjustPanel
                    accountItemId={selectedAccountItem.id}
                    adjustmentInput={adjustmentInput}
                    adjustmentMode={adjustmentMode}
                    installmentsInput={installmentsInput}
                    monthlyValues={monthlyValues}
                    onCancel={closeAdjustModal}
                    onConfirm={() => confirmAdjustment(activeAdjustmentMonth)}
                    onInputChange={setAdjustmentInput}
                    onInstallmentsChange={(v) =>
                      setInstallmentsInput(sanitizeInstallmentsInput(v))
                    }
                    onSwitchMode={switchAdjustmentMode}
                    projectionMonth={activeAdjustmentMonth}
                    projectionMonths={projectionMonths}
                    valuesHidden={valuesHidden}
                  />
                ) : null}
              </View>
            </View>
          </Modal>
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
  adjustmentInput: string;
  adjustmentMode: MonthlyValueAdjustmentOperation;
  installmentsInput: string;
  monthlyValues: MonthlyValue[];
  onCancel: () => void;
  onConfirm: () => void;
  onInputChange: (value: string) => void;
  onInstallmentsChange: (value: string) => void;
  onSwitchMode: (mode: MonthlyValueAdjustmentOperation) => void;
  projectionMonth: ProjectionMonth;
  projectionMonths: ProjectionMonth[];
  valuesHidden: boolean;
};

function AdjustPanel({
  accountItemId,
  adjustmentInput,
  adjustmentMode,
  installmentsInput,
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
  const activeColor = adjustmentMode === 'add' ? colors.accent : colors.negative;
  const currentAmount = getMonthlyValueAmount(
    monthlyValues,
    accountItemId,
    projectionMonth,
  );
  const parsedInstallments = parseInstallmentsInput(installmentsInput);
  const affectedInstallmentMonths =
    adjustmentMode === 'add' && projectionMonths[0]
      ? buildInstallmentMonths(
          projectionMonth.year,
          projectionMonth.month,
          parsedInstallments,
          projectionMonths[0].year,
          projectionMonths[0].month,
        )
      : [];
  const shouldShowInstallmentSummary =
    adjustmentMode === 'add' &&
    parsedInstallments > 1 &&
    affectedInstallmentMonths.length > 0;

  return (
    <View style={styles.adjustPanelContent}>
      <Text style={styles.adjustTitle}>
        {`Ajustar — ${formatMonthLabel(projectionMonth.year, projectionMonth.month)}`}
      </Text>

      <View style={[styles.adjustFieldRow, { borderColor: activeColor }]}>
        <Pressable
          onPress={() => onSwitchMode('add')}
          style={[
            styles.adjustModeButton,
            adjustmentMode === 'add'
              ? { backgroundColor: colors.accent }
              : styles.adjustModeButtonInactive,
          ]}
        >
          <Text
            style={[
              styles.adjustModeButtonText,
              adjustmentMode === 'add'
                ? { color: colors.accentText }
                : { color: colors.textSecondary },
            ]}
          >
            +
          </Text>
        </Pressable>

        <TextInput
          autoFocus
          keyboardType="decimal-pad"
          onChangeText={onInputChange}
          placeholder="0,00"
          placeholderTextColor={colors.textSecondary}
          style={styles.adjustInput}
          value={adjustmentInput}
        />

        <Pressable
          onPress={() => onSwitchMode('subtract')}
          style={[
            styles.adjustModeButton,
            adjustmentMode === 'subtract'
              ? { backgroundColor: colors.negative }
              : styles.adjustModeButtonInactive,
          ]}
        >
          <Text
            style={[
              styles.adjustModeButtonText,
              adjustmentMode === 'subtract'
                ? { color: colors.accentText }
                : { color: colors.textSecondary },
            ]}
          >
            −
          </Text>
        </Pressable>
      </View>

      {adjustmentMode === 'add' ? (
        <>
          <View style={styles.installmentsRow}>
            <Text style={styles.installmentsLabel}>Parcelas</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={onInstallmentsChange}
              placeholder="1"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, styles.installmentsInput]}
              value={installmentsInput}
            />
          </View>
          {shouldShowInstallmentSummary ? (
            <Text style={styles.installmentSummary}>
              {formatInstallmentSummary(
                adjustmentInput,
                parsedInstallments,
                affectedInstallmentMonths,
              )}
            </Text>
          ) : null}
        </>
      ) : null}

      <View style={styles.adjustActions}>
        <Pressable onPress={onCancel} style={styles.adjustCancelButton}>
          <Text style={styles.adjustCancelButtonText}>Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={onConfirm}
          style={[styles.adjustConfirmButton, { backgroundColor: activeColor }]}
        >
          <Text style={styles.adjustConfirmText}>Novo total</Text>
          <Text style={styles.adjustConfirmText}>
            {maskCurrency(
              calculateAdjustedMonthlyValue(
                currentAmount,
                adjustmentInput,
                adjustmentMode,
              ),
              valuesHidden,
            )}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function getCategoryName(categories: Category[], categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.name ?? '-';
}

function getMonthlyValueAmount(
  monthlyValues: MonthlyValue[],
  accountItemId: string,
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
) {
  return (
    monthlyValues.find(
      (monthlyValue) =>
        monthlyValue.accountItemId === accountItemId &&
        monthlyValue.month === projectionMonth.month &&
        monthlyValue.year === projectionMonth.year,
    )?.amount ?? 0
  );
}

function sanitizeInstallmentsInput(value: string) {
  return value.replace(/\D/g, '');
}

function parseInstallmentsInput(value: string) {
  const parsedValue = parseInt(sanitizeInstallmentsInput(value), 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return 1;
  }

  return parsedValue;
}

function formatInstallmentSummary(
  adjustmentInput: string,
  installments: number,
  affectedMonths: { year: number; month: MonthNumber }[],
) {
  const formattedAmount = currencyFormatter.format(parseCurrencyInput(adjustmentInput));
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
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.sectionTitle,
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
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.textPrimary,
    letterSpacing: 0,
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...typography.input,
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
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 18,
    borderWidth: 1,
    maxWidth: 360,
    width: '100%',
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
  adjustFieldRow: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  adjustModeButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  adjustModeButtonInactive: {
    backgroundColor: colors.surfaceMuted,
  },
  adjustModeButtonText: {
    letterSpacing: 0,
    ...typography.button,
  },
  adjustInput: {
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: 0,
    paddingHorizontal: 12,
    textAlign: 'center',
    ...typography.input,
  },
  installmentsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  installmentsLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.button,
  },
  installmentsInput: {
    minHeight: 44,
    textAlign: 'center',
    width: 78,
  },
  installmentSummary: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.bodySmall,
  },
  adjustActions: {
    flexDirection: 'row',
    gap: 8,
  },
  adjustCancelButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  adjustCancelButtonText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.button,
  },
  adjustConfirmButton: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 2,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  adjustConfirmText: {
    color: colors.accentText,
    letterSpacing: 0,
    ...typography.button,
  },
  emptyText: {
    color: colors.textSecondary,
    marginTop: 10,
    ...typography.body,
  },
});
