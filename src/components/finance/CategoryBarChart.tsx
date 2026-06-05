import { StyleSheet, Text, View } from 'react-native';
import { DimensionValue } from 'react-native';

import { CategoryChartPoint } from '../../lib/chartData';
import { currencyFormatter } from '../../lib/formatters';
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
  const maxValue = Math.max(...data.map((point) => point.value), 0);
  const total = data.reduce((sum, point) => sum + point.value, 0);

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.length > 0 ? (
        <>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>{totalLabel}</Text>
            <Text style={styles.totalAmount}>{currencyFormatter.format(total)}</Text>
          </View>

          <View style={styles.chartRows}>
            {data.map((point) => {
              const widthPercent: DimensionValue =
                maxValue > 0 ? `${Math.max((point.value / maxValue) * 100, 4)}%` : '4%';

              return (
                <View key={point.categoryId} style={styles.chartRow}>
                  <View style={styles.rowHeader}>
                    <Text style={styles.categoryName}>{point.label}</Text>
                    <Text style={styles.amount}>
                      {currencyFormatter.format(point.value)}
                    </Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: widthPercent }]} />
                  </View>
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
  chartRows: {
    gap: 12,
    marginTop: 14,
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
  chartRow: {
    gap: 6,
  },
  rowHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
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
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'right',
  },
  barTrack: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 8,
    height: 14,
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    height: 14,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
});
