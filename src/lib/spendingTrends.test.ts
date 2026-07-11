import type { MonthHistoryEntry } from '../types/finance';
import {
  categoryVariation,
  computeCategoryAverages,
  computeTotalTrend,
} from './spendingTrends';

function buildEntry(
  totalExpenses: number,
  categories: { id: string; name: string; total: number }[] = [],
): MonthHistoryEntry {
  return {
    month: 1,
    year: 2026,
    totalIncome: 0,
    totalExpenses,
    categories: categories.map((c) => ({ ...c })),
    accounts: [],
  } as unknown as MonthHistoryEntry;
}

describe('computeTotalTrend', () => {
  it('returns hasEnoughData false with fewer than 2 entries', () => {
    expect(computeTotalTrend([], 100).hasEnoughData).toBe(false);
    expect(computeTotalTrend([buildEntry(100)], 100).hasEnoughData).toBe(false);
  });

  it('averages totalExpenses across entries', () => {
    const result = computeTotalTrend([buildEntry(100), buildEntry(200)], 150);
    expect(result.average).toBe(150);
    expect(result.hasEnoughData).toBe(true);
  });

  it('direction is above when current is more than 2% over average', () => {
    const result = computeTotalTrend([buildEntry(100), buildEntry(100)], 110);
    expect(result.direction).toBe('above');
    expect(result.deltaAmount).toBe(10);
    expect(result.deltaRatio).toBeCloseTo(0.1);
  });

  it('direction is below when current is more than 2% under average', () => {
    const result = computeTotalTrend([buildEntry(100), buildEntry(100)], 90);
    expect(result.direction).toBe('below');
  });

  it('direction is average within the +-2% band', () => {
    const result = computeTotalTrend([buildEntry(100), buildEntry(100)], 101);
    expect(result.direction).toBe('average');
  });

  it('deltaRatio is null when average is 0', () => {
    const result = computeTotalTrend([buildEntry(0), buildEntry(0)], 50);
    expect(result.deltaRatio).toBeNull();
  });
});

describe('computeCategoryAverages', () => {
  it('averages only over entries where the category appears', () => {
    const history: MonthHistoryEntry[] = [
      buildEntry(100, [{ id: 'food', name: 'Comida', total: 50 }]),
      buildEntry(200, [
        { id: 'food', name: 'Comida', total: 150 },
        { id: 'rent', name: 'Aluguel', total: 100 },
      ]),
    ];

    const averages = computeCategoryAverages(history);
    const food = averages.find((a) => a.categoryId === 'food');
    const rent = averages.find((a) => a.categoryId === 'rent');

    expect(food?.average).toBe(100);
    expect(rent?.average).toBe(100);
  });
});

describe('categoryVariation', () => {
  it('returns above for values more than 2% over average', () => {
    expect(categoryVariation(110, 100).direction).toBe('above');
  });

  it('returns below for values more than 2% under average', () => {
    expect(categoryVariation(90, 100).direction).toBe('below');
  });

  it('returns average within the +-2% band', () => {
    expect(categoryVariation(101, 100).direction).toBe('average');
  });

  it('handles average === 0 with zero monthTotal as average', () => {
    expect(categoryVariation(0, 0).direction).toBe('average');
    expect(categoryVariation(0, 0).ratio).toBeNull();
  });

  it('handles average === 0 with positive monthTotal as above', () => {
    expect(categoryVariation(50, 0).direction).toBe('above');
    expect(categoryVariation(50, 0).ratio).toBeNull();
  });
});
