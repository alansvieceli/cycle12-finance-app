import type { CategoryChartPoint } from './chartData';

export type GiftedDonutPoint = {
  categoryId: string;
  color: string;
  label: string;
  value: number;
};

export function toGiftedCategoryDonutData(
  points: CategoryChartPoint[],
): GiftedDonutPoint[] {
  return points
    .filter((point) => point.value > 0)
    .map((point) => ({
      categoryId: point.categoryId,
      color: point.color,
      label: point.label,
      value: point.value,
    }));
}
