import type { MonthHistoryEntry } from '../types/finance';

const NEUTRAL_BAND_RATIO = 0.02;

export type TrendDirection = 'above' | 'below' | 'average';

export type TotalTrend = {
  hasEnoughData: boolean;
  average: number;
  current: number;
  deltaAmount: number;
  deltaRatio: number | null;
  direction: TrendDirection;
};

export type CategoryAverage = {
  categoryId: string;
  name: string;
  average: number;
};

function resolveDirection(ratio: number | null, deltaAmount: number): TrendDirection {
  if (ratio === null) {
    return deltaAmount === 0 ? 'average' : 'above';
  }
  if (ratio > NEUTRAL_BAND_RATIO) return 'above';
  if (ratio < -NEUTRAL_BAND_RATIO) return 'below';
  return 'average';
}

export function computeTotalTrend(
  monthHistory: MonthHistoryEntry[],
  currentTotal: number,
): TotalTrend {
  const hasEnoughData = monthHistory.length >= 2;
  const average = hasEnoughData
    ? monthHistory.reduce((sum, entry) => sum + entry.totalExpenses, 0) /
      monthHistory.length
    : 0;
  const deltaAmount = currentTotal - average;
  const deltaRatio = average === 0 ? null : deltaAmount / average;

  return {
    hasEnoughData,
    average,
    current: currentTotal,
    deltaAmount,
    deltaRatio,
    direction: resolveDirection(deltaRatio, deltaAmount),
  };
}

export function computeCategoryAverages(
  monthHistory: MonthHistoryEntry[],
): CategoryAverage[] {
  const totalsById = new Map<string, { name: string; sum: number; count: number }>();

  for (const entry of monthHistory) {
    for (const category of entry.categories) {
      const existing = totalsById.get(category.id);
      if (existing) {
        existing.sum += category.total;
        existing.count += 1;
        existing.name = category.name;
      } else {
        totalsById.set(category.id, {
          name: category.name,
          sum: category.total,
          count: 1,
        });
      }
    }
  }

  return Array.from(totalsById.entries()).map(([categoryId, { name, sum, count }]) => ({
    categoryId,
    name,
    average: sum / count,
  }));
}

export function categoryVariation(
  monthTotal: number,
  average: number,
): { direction: TrendDirection; ratio: number | null } {
  const deltaAmount = monthTotal - average;
  const ratio = average === 0 ? null : deltaAmount / average;

  return {
    direction: resolveDirection(ratio, deltaAmount),
    ratio,
  };
}
