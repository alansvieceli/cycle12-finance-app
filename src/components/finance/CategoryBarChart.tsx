import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import { CategoryChartPoint } from '../../lib/chartData';
import { currencyFormatter } from '../../lib/formatters';
import { toGiftedCategoryDonutData } from '../../lib/giftedChartAdapters';
import { colors } from '../../theme/colors';

type CategoryBarChartProps = {
  data: CategoryChartPoint[];
  emptyText: string;
  title: string;
  totalLabel: string;
};

export function CategoryBarChart({
  data,
  emptyText,
  title,
  totalLabel,
}: CategoryBarChartProps) {
  const total = data.reduce((sum, point) => sum + point.value, 0);
  const donutData = toGiftedCategoryDonutData(data);

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.length > 0 ? (
        <>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>{totalLabel}</Text>
            <Text style={styles.totalAmount}>{currencyFormatter.format(total)}</Text>
          </View>

          <View style={styles.donutBox}>
            <PieChart
              backgroundColor={colors.surface}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={styles.centerLabelText}>Total</Text>
                  <Text style={styles.centerLabelAmount}>
                    {currencyFormatter.format(total)}
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
                  <View
                    style={[styles.legendSwatch, { backgroundColor: point.color }]}
                  />
                  <Text numberOfLines={1} style={styles.categoryName}>
                    {point.label}
                  </Text>
                  <Text style={styles.amount}>
                    {currencyFormatter.format(point.value)}
                  </Text>
                  <Text style={styles.share}>{Math.round(share * 100)}%</Text>
                </View>
              );
            })}
          </View>
        </>
      ) : (
        <Text style={styles.emptyText}>{emptyText}</Text>
      )}
    </View>
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
  totalBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    marginTop: 14,
    minHeight: 64,
    padding: 12,
  },
  totalLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  totalAmount: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 8,
  },
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
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  centerLabelAmount: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
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
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  amount: {
    color: colors.textPrimary,
    flexShrink: 0,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'right',
  },
  share: {
    color: colors.textSecondary,
    flexShrink: 0,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    minWidth: 38,
    textAlign: 'right',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
});
