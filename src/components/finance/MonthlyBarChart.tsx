import { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';

import { MonthlyChartPoint } from '../../lib/chartData';
import { currencyFormatter } from '../../lib/formatters';
import {
  toGiftedBalanceBarData,
  toGiftedExpenseLineData,
} from '../../lib/giftedChartAdapters';
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
  const [isValueListVisible, setIsValueListVisible] = useState(false);
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(Math.min(width - 64, 360), 240);
  const maxValue = Math.max(...data.map((point) => Math.abs(point.value)), 0);
  const maxPositiveValue = Math.max(...data.map((point) => point.value), 0);
  const minNegativeValue = Math.min(...data.map((point) => point.value), 0);
  const total = data.reduce((sum, point) => sum + point.value, 0);
  const isNegativeTotal = total < 0;
  const chartMaxValue = Math.max(maxValue * 1.18, 1);
  const positiveChartMaxValue = Math.max(maxPositiveValue * 1.18, 1);
  const negativeChartMinValue = minNegativeValue < 0 ? minNegativeValue * 1.18 : 0;
  const chartSpacing =
    data.length > 1 ? Math.max((chartWidth - 64) / data.length, 10) : 24;
  const balanceBarData = toGiftedBalanceBarData(data);
  const expenseLineData = toGiftedExpenseLineData(data);

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

          <View style={styles.chartBox}>
            {mode === 'balance' ? (
              <BarChart
                backgroundColor={colors.surface}
                barBorderRadius={5}
                barWidth={22}
                data={balanceBarData}
                disablePress
                disableScroll
                endSpacing={12}
                frontColor={colors.positive}
                height={190}
                initialSpacing={18}
                isAnimated
                labelWidth={44}
                maxValue={positiveChartMaxValue}
                mostNegativeValue={negativeChartMinValue}
                noOfSections={3}
                noOfSectionsBelowXAxis={data.some((point) => point.value < 0) ? 2 : 0}
                rulesColor={colors.border}
                rulesThickness={1}
                spacing={chartSpacing}
                width={chartWidth}
                xAxisColor={colors.borderStrong}
                xAxisLabelTextStyle={styles.axisLabel}
                xAxisThickness={1}
                yAxisColor={colors.borderStrong}
                yAxisLabelWidth={38}
                yAxisTextStyle={styles.axisLabel}
                yAxisThickness={1}
                formatYLabel={formatCurrencyAxisLabel}
              />
            ) : (
              <LineChart
                areaChart
                backgroundColor={colors.surface}
                color={colors.accent}
                curved
                data={expenseLineData}
                dataPointsColor={colors.accent}
                dataPointsRadius={4}
                disableScroll
                endFillColor={colors.surface}
                endOpacity={0.08}
                endSpacing={12}
                height={190}
                initialSpacing={16}
                isAnimated
                maxValue={chartMaxValue}
                noOfSections={3}
                rulesColor={colors.border}
                rulesThickness={1}
                spacing={chartSpacing}
                startFillColor={colors.accent}
                startOpacity={0.32}
                thickness={3}
                width={chartWidth}
                xAxisColor={colors.borderStrong}
                xAxisLabelTextStyle={styles.axisLabel}
                xAxisThickness={1}
                yAxisColor={colors.borderStrong}
                yAxisLabelWidth={38}
                yAxisTextStyle={styles.axisLabel}
                yAxisThickness={1}
                formatYLabel={formatCurrencyAxisLabel}
              />
            )}
          </View>

          <Pressable
            onPress={() => setIsValueListVisible((currentValue) => !currentValue)}
            style={styles.valuesToggle}
          >
            <Text style={styles.valuesToggleText}>
              {isValueListVisible ? 'Ocultar valores' : 'Valores'}
            </Text>
          </Pressable>

          {isValueListVisible ? (
            <View style={styles.valueList}>
              {data.map((point) => (
                <View key={point.key} style={styles.valueRow}>
                  <Text style={styles.valueMonth}>{point.label}</Text>
                  <Text
                    style={[
                      styles.valueAmount,
                      mode === 'balance'
                        ? point.value < 0
                          ? styles.negativeAmount
                          : styles.positiveAmount
                        : null,
                    ]}
                  >
                    {currencyFormatter.format(point.value)}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </>
      ) : (
        <Text style={styles.emptyText}>{emptyText}</Text>
      )}
    </View>
  );
}

function formatCurrencyAxisLabel(label: string) {
  const numericValue = Number(label);

  if (!Number.isFinite(numericValue)) {
    return '';
  }

  if (numericValue === 0) {
    return '0';
  }

  const absoluteValue = Math.abs(numericValue);
  const sign = numericValue < 0 ? '-' : '';

  if (absoluteValue >= 1000) {
    const compactValue = absoluteValue / 1000;
    const formattedValue =
      compactValue >= 10
        ? String(Math.round(compactValue))
        : compactValue.toFixed(1).replace('.', ',');

    return `${sign}${formattedValue}k`;
  }

  return `${sign}${Math.round(absoluteValue)}`;
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
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
    borderRadius: 16,
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
  positiveAmount: {
    color: colors.positive,
  },
  negativeAmount: {
    color: colors.negativeText,
  },
  chartBox: {
    alignItems: 'center',
    marginTop: 16,
    overflow: 'hidden',
  },
  axisLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0,
  },
  valuesToggle: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  valuesToggleText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  valueList: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    gap: 8,
    marginTop: 14,
    padding: 12,
  },
  valueRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    minHeight: 24,
  },
  valueMonth: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  valueAmount: {
    color: colors.textPrimary,
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'right',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
});
