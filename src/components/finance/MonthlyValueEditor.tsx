import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ProjectionMonth } from '../../lib/financeCalculations';
import { formatEditableAmount, formatMonthLabel } from '../../lib/formatters';
import { AccountItem, Category, MonthlyValue } from '../../types/finance';

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
            {accountItems
              .slice()
              .sort(
                (firstAccountItem, secondAccountItem) =>
                  firstAccountItem.sortOrder - secondAccountItem.sortOrder,
              )
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
                      styles.accountSelectorButtonText,
                      selectedAccountItem.id === accountItem.id
                        ? styles.accountSelectorButtonTextActive
                        : null,
                    ]}
                  >
                    {accountItem.name}
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
                <TextInput
                  keyboardType="decimal-pad"
                  onChangeText={(amount) =>
                    onChangeMonthlyValue(
                      selectedAccountItem.id,
                      projectionMonth,
                      amount,
                    )
                  }
                  placeholder="0,00"
                  style={[styles.input, styles.monthValueInput]}
                  value={formatEditableAmount(
                    getMonthlyValueAmount(
                      monthlyValues,
                      selectedAccountItem.id,
                      projectionMonth,
                    ),
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
    backgroundColor: '#ffffff',
    borderColor: '#dfe7e4',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    color: '#17211f',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  editorHint: {
    color: '#60716d',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  accountSelector: {
    marginTop: 14,
  },
  accountSelectorButton: {
    alignItems: 'center',
    backgroundColor: '#eef4f2',
    borderColor: '#c9d6d2',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    marginRight: 8,
    minHeight: 42,
    paddingHorizontal: 12,
  },
  accountSelectorButtonActive: {
    backgroundColor: '#176a4d',
    borderColor: '#176a4d',
  },
  accountSelectorButtonText: {
    color: '#17211f',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
  },
  accountSelectorButtonTextActive: {
    color: '#ffffff',
  },
  monthValueList: {
    gap: 10,
    marginTop: 14,
  },
  monthValueRow: {
    alignItems: 'center',
    borderTopColor: '#e7eeeb',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingTop: 10,
  },
  monthValueLabel: {
    flex: 1,
  },
  monthValueName: {
    color: '#17211f',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  monthValueCategory: {
    color: '#60716d',
    fontSize: 12,
    letterSpacing: 0,
    marginTop: 3,
  },
  input: {
    backgroundColor: '#f7faf9',
    borderColor: '#c9d6d2',
    borderRadius: 8,
    borderWidth: 1,
    color: '#17211f',
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
    color: '#60716d',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
});
