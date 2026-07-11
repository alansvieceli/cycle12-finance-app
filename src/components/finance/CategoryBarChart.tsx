import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import type { CategoryChartPoint } from '../../lib/chartData';
import { maskCurrency } from '../../lib/formatters';
import { toGiftedCategoryDonutData } from '../../lib/giftedChartAdapters';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ChartPanel } from './ChartPanel';

type CategoryBarChartProps = {
  data: CategoryChartPoint[];
  emptyText: string;
  title: string;
  totalAmountColor?: string;
  totalLabel: string;
  valuesHidden: boolean;
};

export function CategoryBarChart({
  data,
  emptyText,
  title,
  totalAmountColor,
  totalLabel,
  valuesHidden,
}: CategoryBarChartProps) {
  const total = data.reduce((sum, point) => sum + point.value, 0);
  const donutData = toGiftedCategoryDonutData(data);

  return (
    <ChartPanel
      emptyText={emptyText}
      hasData={data.length > 0}
      title={title}
      totalAmountStyle={totalAmountColor ? { color: totalAmountColor } : undefined}
      totalLabel={totalLabel}
      totalText={maskCurrency(total, valuesHidden)}
    >
      <View style={styles.donutBox}>
        <PieChart
          backgroundColor={colors.surface}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.centerLabelText}>Total</Text>
              <Text
                style={[
                  styles.centerLabelAmount,
                  totalAmountColor ? { color: totalAmountColor } : null,
                ]}
              >
                {maskCurrency(total, valuesHidden)}
              </Text>
            </View>
          )}
          data={donutData}
          donut
          focusOnPress={false}
          innerCircleColor={colors.surface}
          innerRadius={54}
          isAnimated
          radius={86}
          sectionAutoFocus={false}
          showText={false}
          strokeColor={colors.surface}
          strokeWidth={2}
        />
      </View>

      <View style={styles.legendList}>
        {donutData.map((point) => {
          const share = total > 0 ? point.value / total : 0;

          return (
            <View key={point.categoryId} style={styles.legendRow}>
              <View style={[styles.legendSwatch, { backgroundColor: point.color }]} />
              <Text numberOfLines={1} style={styles.categoryName}>
                {point.label}
              </Text>
              <Text style={styles.amount}>
                {maskCurrency(point.value, valuesHidden)}
              </Text>
              <Text style={styles.share}>{Math.round(share * 100)}%</Text>
            </View>
          );
        })}
      </View>
    </ChartPanel>
  );
}

const styles = StyleSheet.create({
  donutBox: {
    alignItems: 'center',
    marginTop: 16,
  },
  centerLabel: {
    alignItems: 'center',
    gap: 2,
  },
  centerLabelText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    textTransform: 'uppercase',
    ...typography.caption,
  },
  centerLabelAmount: {
    color: colors.textPrimary,
    letterSpacing: 0,
    textAlign: 'center',
    ...typography.amountSmall,
  },
  legendList: {
    gap: 10,
    marginTop: 16,
  },
  legendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 28,
  },
  legendSwatch: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  categoryName: {
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: 0,
    ...typography.body,
  },
  amount: {
    color: colors.textPrimary,
    flexShrink: 0,
    letterSpacing: 0,
    textAlign: 'right',
    ...typography.amountSmall,
  },
  share: {
    color: colors.textSecondary,
    flexShrink: 0,
    letterSpacing: 0,
    minWidth: 38,
    textAlign: 'right',
    ...typography.bodySmall,
  },
});
