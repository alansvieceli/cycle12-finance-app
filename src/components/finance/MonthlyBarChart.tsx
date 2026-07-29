import { type DimensionValue, StyleSheet, Text, View } from 'react-native';

import {
  calculateBalanceBarRatio,
  calculateBalanceTotal,
  calculateNegativeBalanceTotal,
  type MonthlyChartPoint,
} from '../../lib/chartData';
import { maskCurrency } from '../../lib/formatters';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ChartPanel } from './ChartPanel';

type MonthlyBarChartProps = {
  data: MonthlyChartPoint[];
  emptyText: string;
  title: string;
  totalLabel: string;
  valuesHidden: boolean;
};

export function MonthlyBarChart({
  data,
  emptyText,
  title,
  totalLabel,
  valuesHidden,
}: MonthlyBarChartProps) {
  const maxAbsoluteValue = Math.max(...data.map((point) => Math.abs(point.value)), 0);
  const periodTotal = calculateBalanceTotal(data);
  const negativeTotal = calculateNegativeBalanceTotal(data);

  return (
    <ChartPanel
      emptyText={emptyText}
      hasData={data.length > 0}
      secondaryTotalAmountStyle={
        negativeTotal < 0 ? styles.negativeAmount : styles.positiveAmount
      }
      secondaryTotalLabel="Total negativo no período"
      secondaryTotalText={maskCurrency(negativeTotal, valuesHidden)}
      title={title}
      totalAmountStyle={periodTotal < 0 ? styles.negativeAmount : styles.positiveAmount}
      totalLabel={totalLabel}
      totalText={maskCurrency(periodTotal, valuesHidden)}
    >
      <View style={styles.list}>
        {data.map((point) => {
          const isNegative = point.value < 0;
          const ratio = calculateBalanceBarRatio(point.value, maxAbsoluteValue);
          const barWidth: DimensionValue = `${ratio * 100}%`;

          return (
            <View key={point.key} style={styles.row}>
              <Text style={styles.monthLabel}>{point.label}</Text>
              <View style={styles.track}>
                <View style={styles.trackNegativeHalf}>
                  {isNegative ? (
                    <View style={[styles.negativeBar, { width: barWidth }]} />
                  ) : null}
                </View>
                <View style={styles.zeroLine} />
                <View style={styles.trackPositiveHalf}>
                  {isNegative ? null : (
                    <View style={[styles.positiveBar, { width: barWidth }]} />
                  )}
                </View>
              </View>
              <Text
                style={[
                  styles.valueAmount,
                  isNegative ? styles.negativeAmount : styles.positiveAmount,
                ]}
              >
                {maskCurrency(point.value, valuesHidden)}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.legendRow}>
        <Text style={styles.legendText}>falta</Text>
        <Text style={styles.legendText}>sobra</Text>
      </View>
    </ChartPanel>
  );
}

const BAR_HEIGHT = 10;

const styles = StyleSheet.create({
  positiveAmount: {
    color: colors.positive,
  },
  negativeAmount: {
    color: colors.negativeText,
  },
  list: {
    gap: 10,
    marginTop: 16,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    minHeight: 24,
  },
  monthLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    minWidth: 28,
    textTransform: 'uppercase',
    ...typography.label,
  },
  track: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: BAR_HEIGHT + 6,
  },
  trackNegativeHalf: {
    alignItems: 'flex-end',
    flex: 1,
  },
  trackPositiveHalf: {
    alignItems: 'flex-start',
    flex: 1,
  },
  zeroLine: {
    backgroundColor: colors.borderStrong,
    height: '100%',
    width: 1,
  },
  negativeBar: {
    backgroundColor: colors.negative,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    height: BAR_HEIGHT,
  },
  positiveBar: {
    backgroundColor: colors.positive,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
    height: BAR_HEIGHT,
  },
  valueAmount: {
    letterSpacing: 0,
    minWidth: 84,
    textAlign: 'right',
    ...typography.amountSmall,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 38,
  },
  legendText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.caption,
  },
});
