import { chartPalette } from '../theme/colors';
import type { Subscription } from '../types/finance';
import {
  calculateSubscriptionsMonthlyTotal,
  calculateSubscriptionsSalaryShare,
  calculateSubscriptionsYearlyTotal,
  toSubscriptionChartPoints,
} from './subscriptions';

const subscriptions: Subscription[] = [
  { amount: 5590, id: 's1', name: 'Netflix' },
  { amount: 3490, id: 's2', name: 'Spotify' },
];

describe('calculateSubscriptionsMonthlyTotal', () => {
  it('adds every subscription amount', () => {
    expect(calculateSubscriptionsMonthlyTotal(subscriptions)).toBe(9080);
  });

  it('returns zero without subscriptions', () => {
    expect(calculateSubscriptionsMonthlyTotal([])).toBe(0);
  });
});

describe('calculateSubscriptionsYearlyTotal', () => {
  it('projects twelve months of the monthly total', () => {
    expect(calculateSubscriptionsYearlyTotal(subscriptions)).toBe(108960);
  });
});

describe('calculateSubscriptionsSalaryShare', () => {
  it('divides the monthly total by the salary alone', () => {
    expect(calculateSubscriptionsSalaryShare(9080, 90800)).toBeCloseTo(0.1);
  });

  it('returns null when there is no salary', () => {
    expect(calculateSubscriptionsSalaryShare(9080, 0)).toBeNull();
  });

  it('returns null for a negative salary', () => {
    expect(calculateSubscriptionsSalaryShare(9080, -100)).toBeNull();
  });
});

describe('toSubscriptionChartPoints', () => {
  it('sorts by amount descending and assigns palette colors by position', () => {
    const points = toSubscriptionChartPoints([
      { amount: 3490, id: 's2', name: 'Spotify' },
      { amount: 5590, id: 's1', name: 'Netflix' },
    ]);

    expect(points.map((point) => point.label)).toEqual(['Netflix', 'Spotify']);
    expect(points.map((point) => point.value)).toEqual([5590, 3490]);
    expect(points[0].color).toBe(chartPalette[0]);
    expect(points[1].color).toBe(chartPalette[1]);
  });

  it('keeps a subscription own color', () => {
    const [point] = toSubscriptionChartPoints([
      { amount: 5590, color: '#abcdef', id: 's1', name: 'Netflix' },
    ]);

    expect(point.color).toBe('#abcdef');
  });

  it('drops subscriptions without a positive amount', () => {
    expect(
      toSubscriptionChartPoints([{ amount: 0, id: 's1', name: 'Netflix' }]),
    ).toEqual([]);
  });
});
