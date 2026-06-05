import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ProjectionMonth } from '../../lib/financeCalculations';
import { formatMonthLabel } from '../../lib/formatters';
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
  onSelectAccountItem: (accountItemId: string) => void;
  projectionMonths: ProjectionMonth[];
  selectedAccountItem?: AccountItem;
};

export function MonthlyValueEditor({
  accountItems,
  categories,
  monthlyValues,
  onChangeMonthlyValue,
  onSelectAccountItem,
  projectionMonths,
  selectedAccountItem,
}: MonthlyValueEditorProps) {
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
            {sortAccountItems(accountItems, categories)
              .map((accountItem) => (
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
            {projectionMonths.map((projectionMonth) => (
              <View key={projectionMonth.key} style={styles.monthValueRow}>
                <View style={styles.monthValueLabel}>
                  <Text style={styles.monthValueName}>
                    {formatMonthLabel(projectionMonth.year, projectionMonth.month)}
                  </Text>
                  <Text style={styles.monthValueCategory}>
                    {getCategoryName(categories, selectedAccountItem.categoryId)}
                  </Text>
                </View>
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
              </View>
            ))}
          </View>
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
  monthValueRow: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingTop: 10,
  },
  monthValueLabel: {
    flex: 1,
  },
  monthValueName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  monthValueCategory: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 0,
    marginTop: 3,
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
    maxWidth: 130,
    textAlign: 'right',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
});
