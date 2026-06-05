import { chartPalette, colors } from '../theme/colors';
import { CategoryChartPoint, MonthlyChartPoint } from './chartData';

export type GiftedBarPoint = {
  disablePress: boolean;
  frontColor: string;
  label: string;
  value: number;
};

export type GiftedLinePoint = {
  dataPointColor: string;
  label: string;
  value: number;
};

export type GiftedDonutPoint = {
  categoryId: string;
  color: string;
  label: string;
  value: number;
};

export function toGiftedBalanceBarData(points: MonthlyChartPoint[]): GiftedBarPoint[] {
  return points.map((point) => ({
    disablePress: true,
    frontColor: point.value < 0 ? colors.negative : colors.positive,
    label: point.label,
    value: point.value,
  }));
}

export function toGiftedExpenseLineData(
  points: MonthlyChartPoint[],
): GiftedLinePoint[] {
  return points.map((point) => ({
    dataPointColor: colors.accent,
    label: point.label,
    value: point.value,
  }));
}

export function toGiftedCategoryDonutData(
  points: CategoryChartPoint[],
): GiftedDonutPoint[] {
  return points
    .filter((point) => point.value > 0)
    .map((point, index) => ({
      categoryId: point.categoryId,
      color: chartPalette[index % chartPalette.length],
      label: point.label,
      value: point.value,
    }));
}
