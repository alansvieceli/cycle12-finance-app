import { StyleSheet, Text, View } from 'react-native';
import { DimensionValue } from 'react-native';

import { MonthlyChartPoint } from '../../lib/chartData';
import { currencyFormatter } from '../../lib/formatters';
import { colors } from '../../theme/colors';

type MonthlyBarChartProps = {
  data: MonthlyChartPoint[];
  emptyText: string;
  mode?: 'expense' | 'balance';
  title: string;
  totalLabel: string;
};

export function MonthlyBarChart({
  data,
  emptyText,
  mode = 'expense',
  title,
  totalLabel,
}: MonthlyBarChartProps) {
  const maxValue = Math.max(...data.map((point) => Math.abs(point.value)), 0);
  const total = data.reduce((sum, point) => sum + point.value, 0);
  const isNegativeTotal = total < 0;

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.length > 0 ? (
        <>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>{totalLabel}</Text>
            <Text
              style={[
                styles.totalAmount,
                mode === 'balance'
                  ? isNegativeTotal
                    ? styles.negativeAmount
                    : styles.positiveAmount
                  : null,
              ]}
            >
              {currencyFormatter.format(total)}
            </Text>
          </View>

          <View style={styles.chartRows}>
            {data.map((point) => {
              const widthPercent: DimensionValue =
                maxValue > 0 ? `${Math.max((Math.abs(point.value) / maxValue) * 100, 4)}%` : '4%';
              const isNegative = point.value < 0;

              return (
                <View key={point.key} style={styles.chartRow}>
                  <Text style={styles.monthLabel}>{point.label}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: widthPercent },
                        mode === 'balance'
                          ? isNegative
                            ? styles.negativeBar
                            : styles.positiveBar
                          : styles.expenseBar,
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.amount,
                      mode === 'balance'
                        ? isNegative
                          ? styles.negativeAmount
                          : styles.positiveAmount
                        : null,
                    ]}
                  >
                    {currencyFormatter.format(point.value)}
                  </Text>
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
    gap: 10,
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
  monthLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  barTrack: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 8,
    height: 14,
    overflow: 'hidden',
  },
  barFill: {
    borderRadius: 8,
    height: 14,
  },
  expenseBar: {
    backgroundColor: colors.accent,
  },
  positiveBar: {
    backgroundColor: colors.positive,
  },
  negativeBar: {
    backgroundColor: colors.negative,
  },
  amount: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  positiveAmount: {
    color: colors.positive,
  },
  negativeAmount: {
    color: colors.negativeText,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
});
