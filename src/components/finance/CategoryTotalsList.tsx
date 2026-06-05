import { StyleSheet, Text, View } from 'react-native';

import { CategoryMonthTotal } from '../../lib/financeCalculations';
import { currencyFormatter } from '../../lib/formatters';
import { colors } from '../../theme/colors';

type CategoryTotalsListProps = {
  categoryNamesById: Record<string, string>;
  categoryTotals: CategoryMonthTotal[];
};

export function CategoryTotalsList({
  categoryNamesById,
  categoryTotals,
}: CategoryTotalsListProps) {
  return (
    <View style={styles.categoryList}>
      {categoryTotals.map((categoryTotal) => (
        <View key={categoryTotal.categoryId} style={styles.categoryRow}>
          <Text style={styles.categoryName}>
            {categoryNamesById[categoryTotal.categoryId]}
          </Text>
          <Text style={styles.categoryAmount}>
            {currencyFormatter.format(categoryTotal.total)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryList: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 6,
  },
  categoryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 32,
  },
  categoryName: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: 14,
    letterSpacing: 0,
  },
  categoryAmount: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    marginLeft: 12,
  },
});
