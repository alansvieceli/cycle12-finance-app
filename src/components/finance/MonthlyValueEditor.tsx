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
import { formatMonthLabel } from '../../lib/formatters';
import { MonthlyValueAdjustmentOperation } from '../../lib/monthlyValueAdjustments';
import { sortAccountItems } from '../../lib/sorting';
import { colors } from '../../theme/colors';
import { AccountItem, Category, MonthlyValue } from '../../types/finance';
import { EditableAmountInput } from '../common/EditableAmountInput';

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

  function openAdjustment(
    projectionMonth: ProjectionMonth,
    operation: MonthlyValueAdjustmentOperation,
  ) {
    setActiveAdjustment({ operation, projectionMonth });
    setAdjustmentInput('');
  }

  function closeAdjustment() {
    setActiveAdjustment(undefined);
    setAdjustmentInput('');
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
    );
    closeAdjustment();
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Valores mensais</Text>
      {selectedAccountItem ? (
        <>
          <Text style={styles.editorHint}>
            Selecione uma conta e edite os valores previstos para cada mês.
          </Text>

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

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  editorHint: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  accountSelector: {
    marginTop: 14,
  },
  accountSelectorButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    marginRight: 8,
    minHeight: 52,
    paddingHorizontal: 12,
    paddingVertical: 7,
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
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'center',
  },
  accountSelectorCategoryText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: 2,
    textAlign: 'center',
  },
  monthValueList: {
    gap: 10,
    marginTop: 14,
  },
  monthValueItem: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: 10,
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
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  monthValueControlGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
    minHeight: 48,
    paddingHorizontal: 12,
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
    borderRadius: 8,
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
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtractButtonText: {
    color: colors.negativeText,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
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
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    maxWidth: 360,
    padding: 16,
    width: '100%',
  },
  adjustmentTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0,
  },
  adjustmentInput: {
    textAlign: 'right',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  modalButton: {
    alignItems: 'center',
    borderRadius: 8,
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
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
});
