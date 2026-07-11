import { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';

import type { MonthlyChartPoint } from '../../lib/chartData';
import { maskCurrency } from '../../lib/formatters';
import {
  toGiftedBalanceBarData,
  toGiftedExpenseLineData,
} from '../../lib/giftedChartAdapters';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ChartPanel } from './ChartPanel';

type MonthlyBarChartProps = {
  data: MonthlyChartPoint[];
  emptyText: string;
  mode?: 'expense' | 'balance';
  title: string;
  totalLabel: string;
  valuesHidden: boolean;
};

export function MonthlyBarChart({
  data,
  emptyText,
  mode = 'expense',
  title,
  totalLabel,
  valuesHidden,
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

  const sharedChartProps = {
    backgroundColor: colors.surface,
    disableScroll: true,
    endSpacing: 12,
    formatYLabel: formatCurrencyAxisLabel,
    height: 190,
    isAnimated: true,
    noOfSections: 3,
    rulesColor: colors.border,
    rulesThickness: 1,
    spacing: chartSpacing,
    width: chartWidth,
    xAxisColor: colors.borderStrong,
    xAxisLabelTextStyle: styles.axisLabel,
    xAxisThickness: 1,
    yAxisColor: colors.borderStrong,
    yAxisLabelWidth: 38,
    yAxisTextStyle: styles.axisLabel,
    yAxisThickness: 1,
  };

  return (
    <ChartPanel
      emptyText={emptyText}
      hasData={data.length > 0}
      title={title}
      totalAmountStyle={
        mode === 'balance'
          ? isNegativeTotal
            ? styles.negativeAmount
            : styles.positiveAmount
          : undefined
      }
      totalLabel={totalLabel}
      totalText={maskCurrency(total, valuesHidden)}
    >
      <View style={styles.chartBox}>
        {mode === 'balance' ? (
          <BarChart
            {...sharedChartProps}
            barBorderRadius={5}
            barWidth={22}
            data={toGiftedBalanceBarData(data)}
            disablePress
            frontColor={colors.positive}
            initialSpacing={18}
            labelWidth={22}
            maxValue={positiveChartMaxValue}
            mostNegativeValue={negativeChartMinValue}
            noOfSectionsBelowXAxis={data.some((point) => point.value < 0) ? 2 : 0}
          />
        ) : (
          <LineChart
            {...sharedChartProps}
            areaChart
            color={colors.accent}
            curved
            data={toGiftedExpenseLineData(data)}
            dataPointsColor={colors.accent}
            dataPointsRadius={4}
            endFillColor={colors.surface}
            endOpacity={0.08}
            initialSpacing={16}
            maxValue={chartMaxValue}
            startFillColor={colors.accent}
            startOpacity={0.32}
            thickness={3}
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
                {maskCurrency(point.value, valuesHidden)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </ChartPanel>
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
    letterSpacing: 0,
    textAlign: 'center',
    ...typography.caption,
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
    letterSpacing: 0,
    ...typography.button,
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
    letterSpacing: 0,
    textTransform: 'uppercase',
    ...typography.label,
  },
  valueAmount: {
    color: colors.textPrimary,
    flexShrink: 1,
    letterSpacing: 0,
    textAlign: 'right',
    ...typography.amountSmall,
  },
});
