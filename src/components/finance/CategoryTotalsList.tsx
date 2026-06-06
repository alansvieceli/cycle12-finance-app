import { StyleSheet, Text, View } from 'react-native';

import { CategoryMonthTotal } from '../../lib/financeCalculations';
import { maskCurrency } from '../../lib/formatters';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

type CategoryTotalsListProps = {
  categoryColorsById: Record<string, string>;
  categoryNamesById: Record<string, string>;
  categoryTotals: CategoryMonthTotal[];
  valuesHidden: boolean;
};

export function CategoryTotalsList({
  categoryColorsById,
  categoryNamesById,
  categoryTotals,
  valuesHidden,
}: CategoryTotalsListProps) {
  return (
    <View style={styles.categoryList}>
      {categoryTotals
        .filter((categoryTotal) => categoryTotal.total > 0)
        .map((categoryTotal) => (
          <View key={categoryTotal.categoryId} style={styles.categoryRow}>
            <View style={styles.categoryLabel}>
              <View
                style={[
                  styles.categoryDot,
                  {
                    backgroundColor:
                      categoryColorsById[categoryTotal.categoryId] ??
                      colors.textSecondary,
                  },
                ]}
              />
              <Text style={styles.categoryName}>
                {categoryNamesById[categoryTotal.categoryId]}
              </Text>
            </View>
            <Text style={styles.categoryAmount}>
              {maskCurrency(categoryTotal.total, valuesHidden)}
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
  categoryLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: 8,
  },
  categoryDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  categoryName: {
    color: colors.textSecondary,
    flex: 1,
    letterSpacing: 0,
    ...typography.body,
  },
  categoryAmount: {
    color: colors.textPrimary,
    letterSpacing: 0,
    marginLeft: 12,
    ...typography.amountSmall,
  },
});
