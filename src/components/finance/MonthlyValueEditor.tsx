import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ProjectionMonth } from '../../lib/financeCalculations';
import { currencyFormatter, formatMonthLabel } from '../../lib/formatters';
import { buildInstallmentMonths } from '../../lib/installmentMonths';
import { parseCurrencyInput } from '../../lib/inputParsers';
import { MonthlyValueAdjustmentOperation } from '../../lib/monthlyValueAdjustments';
import { sortAccountItems } from '../../lib/sorting';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { AccountItem, Category, MonthNumber, MonthlyValue } from '../../types/finance';
import { EditableAmountInput } from '../common/EditableAmountInput';

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
}: MonthlyValueEditorProps) {
  const [activeAdjustment, setActiveAdjustment] = useState<{
    operation: MonthlyValueAdjustmentOperation;
    projectionMonth: ProjectionMonth;
  }>();
  const [adjustmentInput, setAdjustmentInput] = useState('');
  const [installmentsInput, setInstallmentsInput] = useState('1');

  function openAdjustment(
    projectionMonth: ProjectionMonth,
    operation: MonthlyValueAdjustmentOperation,
  ) {
    setActiveAdjustment({ operation, projectionMonth });
    setAdjustmentInput('');
    setInstallmentsInput('1');
  }

  function closeAdjustment() {
    setActiveAdjustment(undefined);
    setAdjustmentInput('');
    setInstallmentsInput('1');
  }

  function confirmAdjustment() {
    if (!selectedAccountItem || !activeAdjustment) {
      return;
    }

    onAdjustMonthlyValue(
      selectedAccountItem.id,
      activeAdjustment.projectionMonth,
      adjustmentInput,
      activeAdjustment.operation,
      activeAdjustment.operation === 'add'
        ? parseInstallmentsInput(installmentsInput)
        : undefined,
    );
    closeAdjustment();
  }

  const affectedInstallmentMonths =
    activeAdjustment?.operation === 'add' && projectionMonths[0]
      ? buildInstallmentMonths(
          activeAdjustment.projectionMonth.year,
          activeAdjustment.projectionMonth.month,
          parseInstallmentsInput(installmentsInput),
          projectionMonths[0].year,
          projectionMonths[0].month,
        )
      : [];
  const shouldShowInstallmentSummary =
    activeAdjustment?.operation === 'add' &&
    parseInstallmentsInput(installmentsInput) > 1 &&
    affectedInstallmentMonths.length > 0;

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Planejamento mensal</Text>
      {selectedAccountItem ? (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.accountSelector}
          >
            {sortAccountItems(accountItems, categories).map((accountItem) => (
              <Pressable
                key={accountItem.id}
                onPress={() => onSelectAccountItem(accountItem.id)}
                style={[
                  styles.accountSelectorButton,
                  selectedAccountItem.id === accountItem.id
                    ? styles.accountSelectorButtonActive
                    : null,
                ]}
              >
                <Text
                  style={[
                    styles.accountSelectorAccountText,
                    selectedAccountItem.id === accountItem.id
                      ? styles.accountSelectorButtonTextActive
                      : null,
                  ]}
                >
                  {accountItem.name}
                </Text>
                <Text
                  style={[
                    styles.accountSelectorCategoryText,
                    selectedAccountItem.id === accountItem.id
                      ? styles.accountSelectorButtonTextActive
                      : null,
                  ]}
                >
                  {getCategoryName(categories, accountItem.categoryId)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.monthValueList}>
            {projectionMonths.map((projectionMonth) => {
              return (
                <View key={projectionMonth.key} style={styles.monthValueItem}>
                  <View style={styles.monthValueRow}>
                    <View style={styles.monthValueLabel}>
                      <Text style={styles.monthValueName}>
                        {formatMonthLabel(projectionMonth.year, projectionMonth.month)}
                      </Text>
                    </View>
                    <View style={styles.monthValueControlGroup}>
                      <EditableAmountInput
                        onChangeValue={(amount) =>
                          onChangeMonthlyValue(
                            selectedAccountItem.id,
                            projectionMonth,
                            amount,
                          )
                        }
                        style={[styles.input, styles.monthValueInput]}
                        value={getMonthlyValueAmount(
                          monthlyValues,
                          selectedAccountItem.id,
                          projectionMonth,
                        )}
                      />
                      <View style={styles.adjustmentButtons}>
                        <Pressable
                          accessibilityLabel="Adicionar ajuste"
                          onPress={() => openAdjustment(projectionMonth, 'add')}
                          style={[styles.adjustmentButton, styles.addButton]}
                        >
                          <Text style={styles.addButtonText}>+</Text>
                        </Pressable>
                        <Pressable
                          accessibilityLabel="Subtrair ajuste"
                          onPress={() => openAdjustment(projectionMonth, 'subtract')}
                          style={[styles.adjustmentButton, styles.subtractButton]}
                        >
                          <Text style={styles.subtractButtonText}>-</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <Modal
            animationType="fade"
            onRequestClose={closeAdjustment}
            transparent
            visible={Boolean(activeAdjustment)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <Text style={styles.adjustmentTitle}>
                  {activeAdjustment
                    ? `${activeAdjustment.operation === 'add' ? 'Adicionar' : 'Subtrair'} em ${formatMonthLabel(
                        activeAdjustment.projectionMonth.year,
                        activeAdjustment.projectionMonth.month,
                      )}`
                    : ''}
                </Text>
                <TextInput
                  autoFocus
                  keyboardType="decimal-pad"
                  onChangeText={setAdjustmentInput}
                  placeholder="0,00"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, styles.adjustmentInput]}
                  value={adjustmentInput}
                />
                {activeAdjustment?.operation === 'add' ? (
                  <>
                    <View style={styles.installmentsRow}>
                      <Text style={styles.installmentsLabel}>Parcelas</Text>
                      <TextInput
                        keyboardType="number-pad"
                        onChangeText={(value) =>
                          setInstallmentsInput(sanitizeInstallmentsInput(value))
                        }
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
                          parseInstallmentsInput(installmentsInput),
                          affectedInstallmentMonths,
                        )}
                      </Text>
                    ) : null}
                  </>
                ) : null}
                <View style={styles.modalActions}>
                  <Pressable
                    accessibilityLabel="Cancelar ajuste"
                    onPress={closeAdjustment}
                    style={[styles.modalButton, styles.cancelButton]}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    accessibilityLabel="Confirmar ajuste"
                    onPress={confirmAdjustment}
                    style={[
                      styles.modalButton,
                      activeAdjustment?.operation === 'subtract'
                        ? styles.subtractConfirmButton
                        : styles.addButton,
                    ]}
                  >
                    <Text
                      style={
                        activeAdjustment?.operation === 'subtract'
                          ? styles.subtractConfirmButtonText
                          : styles.addButtonText
                      }
                    >
                      OK
                    </Text>
                  </Pressable>
                </View>
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
    padding: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.sectionTitle,
  },
  accountSelector: {
    marginTop: 10,
  },
  accountSelectorButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    marginRight: 8,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  accountSelectorButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  accountSelectorButtonTextActive: {
    color: colors.accentText,
  },
  accountSelectorAccountText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    textAlign: 'center',
    ...typography.button,
  },
  accountSelectorCategoryText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    marginTop: 2,
    textAlign: 'center',
    ...typography.caption,
  },
  monthValueList: {
    gap: 8,
    marginTop: 10,
  },
  monthValueItem: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  monthValueRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  monthValueLabel: {
    flex: 1,
    minWidth: 92,
  },
  monthValueName: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.body,
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
    minHeight: 44,
    paddingHorizontal: 12,
    ...typography.input,
  },
  monthValueInput: {
    width: 106,
    textAlign: 'right',
  },
  adjustmentButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  adjustmentButton: {
    alignItems: 'center',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 38,
  },
  addButton: {
    backgroundColor: colors.accent,
  },
  subtractButton: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.negative,
    borderWidth: 1,
  },
  addButtonText: {
    color: colors.accentText,
    letterSpacing: 0,
    ...typography.button,
  },
  subtractButtonText: {
    color: colors.negativeText,
    letterSpacing: 0,
    ...typography.amountMedium,
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
    gap: 12,
    maxWidth: 360,
    padding: 16,
    width: '100%',
  },
  adjustmentTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.cardTitle,
  },
  adjustmentInput: {
    textAlign: 'right',
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
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  modalButton: {
    alignItems: 'center',
    borderRadius: 12,
    minHeight: 42,
    justifyContent: 'center',
    minWidth: 96,
    paddingHorizontal: 12,
  },
  cancelButton: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderWidth: 1,
  },
  subtractConfirmButton: {
    backgroundColor: colors.negative,
  },
  subtractConfirmButtonText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.button,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.button,
  },
  emptyText: {
    color: colors.textSecondary,
    marginTop: 10,
    ...typography.body,
  },
});
