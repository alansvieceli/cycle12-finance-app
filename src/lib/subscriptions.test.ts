import { chartPalette } from '../theme/colors';
import type { Subscription } from '../types/finance';
import {
  calculateSubscriptionsMonthlyTotal,
  calculateSubscriptionsSalaryShare,
  calculateSubscriptionsYearlyTotal,
  groupSubscriptionsByTag,
  toSubscriptionChartPoints,
  toSubscriptionGroupChartPoints,
  UNTAGGED_SUBSCRIPTION_GROUP,
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

  it('orders by group then amount within the group', () => {
    const points = toSubscriptionChartPoints(groupedSubscriptions);

    expect(points.map((point) => point.label)).toEqual([
      'Netflix',
      'Spotify',
      'Notion',
      'Sem grupo',
    ]);
  });
});

const groupedSubscriptions: Subscription[] = [
  { amount: 5590, id: 's1', name: 'Netflix', tag: 'Streaming' },
  { amount: 3490, id: 's2', name: 'Spotify', tag: 'Streaming' },
  { amount: 1000, id: 's3', name: 'Notion', tag: 'Produtividade' },
  { amount: 100, id: 's4', name: 'Sem grupo' },
];

describe('groupSubscriptionsByTag', () => {
  it('buckets by trimmed tag and falls back to Outros', () => {
    const groups = groupSubscriptionsByTag(groupedSubscriptions);

    expect(groups.map((group) => group.tag)).toEqual([
      'Streaming',
      'Produtividade',
      UNTAGGED_SUBSCRIPTION_GROUP,
    ]);
  });

  it('sorts groups by total descending and subscriptions within a group by amount descending', () => {
    const groups = groupSubscriptionsByTag(groupedSubscriptions);

    expect(groups[0].total).toBe(9080);
    expect(groups[0].subscriptions.map((s) => s.name)).toEqual(['Netflix', 'Spotify']);
  });

  it('treats a blank tag as untagged', () => {
    const groups = groupSubscriptionsByTag([
      { amount: 100, id: 's1', name: 'Blank', tag: '   ' },
    ]);

    expect(groups[0].tag).toBe(UNTAGGED_SUBSCRIPTION_GROUP);
  });
});

describe('toSubscriptionGroupChartPoints', () => {
  it('returns one point per group with its total and a palette color', () => {
    const points = toSubscriptionGroupChartPoints(groupedSubscriptions);

    expect(points.map((point) => point.label)).toEqual([
      'Streaming',
      'Produtividade',
      UNTAGGED_SUBSCRIPTION_GROUP,
    ]);
    expect(points[0].value).toBe(9080);
    expect(points[0].color).toBe(chartPalette[0]);
    expect(points[1].color).toBe(chartPalette[1]);
  });

  it('drops groups made only of non-positive amounts', () => {
    expect(
      toSubscriptionGroupChartPoints([{ amount: 0, id: 's1', name: 'Free' }]),
    ).toEqual([]);
  });
});
