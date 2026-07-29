import { chartPalette } from '../theme/colors';
import type { Subscription } from '../types/finance';
import type { CategoryChartPoint } from './chartData';

const MONTHS_IN_YEAR = 12;

export const UNTAGGED_SUBSCRIPTION_GROUP = 'Outros';

export type SubscriptionGroup = {
  tag: string;
  subscriptions: Subscription[];
  total: number;
};

/** Buckets subscriptions by trimmed tag, both groups and members sorted by amount descending. */
export function groupSubscriptionsByTag(
  subscriptions: Subscription[],
): SubscriptionGroup[] {
  const byTag = new Map<string, Subscription[]>();

  for (const subscription of subscriptions) {
    const tag = subscription.tag?.trim() || UNTAGGED_SUBSCRIPTION_GROUP;
    const members = byTag.get(tag) ?? [];
    members.push(subscription);
    byTag.set(tag, members);
  }

  return [...byTag.entries()]
    .map(([tag, members]) => ({
      subscriptions: [...members].sort((a, b) => b.amount - a.amount),
      tag,
      total: members.reduce((sum, subscription) => sum + subscription.amount, 0),
    }))
    .sort((a, b) => b.total - a.total);
}

export function calculateSubscriptionsMonthlyTotal(
  subscriptions: Subscription[],
): number {
  return subscriptions.reduce((total, subscription) => total + subscription.amount, 0);
}

export function calculateSubscriptionsYearlyTotal(
  subscriptions: Subscription[],
): number {
  return calculateSubscriptionsMonthlyTotal(subscriptions) * MONTHS_IN_YEAR;
}

/**
 * Share of the salary taken by the subscriptions.
 *
 * It takes the salary alone and never `calculateAvailableIncome`: the current
 * month extra balance is a one-off amount and would distort a recurring cost.
 */
export function calculateSubscriptionsSalaryShare(
  monthlyTotal: number,
  monthlySalary: number,
): number | null {
  if (monthlySalary <= 0) {
    return null;
  }

  return monthlyTotal / monthlySalary;
}

/**
 * Maps subscriptions to the shape the existing donut chart already consumes,
 * ordered by group then amount so same-group slices sit next to each other.
 */
export function toSubscriptionChartPoints(
  subscriptions: Subscription[],
): CategoryChartPoint[] {
  const ordered = groupSubscriptionsByTag(
    subscriptions.filter((subscription) => subscription.amount > 0),
  ).flatMap((group) => group.subscriptions);

  return ordered.map((subscription, index) => ({
    categoryId: subscription.id,
    color: subscription.color ?? chartPalette[index % chartPalette.length],
    label: subscription.name,
    value: subscription.amount,
  }));
}

/** Maps each subscription group to the shape the existing donut chart consumes. */
export function toSubscriptionGroupChartPoints(
  subscriptions: Subscription[],
): CategoryChartPoint[] {
  return groupSubscriptionsByTag(
    subscriptions.filter((subscription) => subscription.amount > 0),
  ).map((group, index) => ({
    categoryId: group.tag,
    color: chartPalette[index % chartPalette.length],
    label: group.tag,
    value: group.total,
  }));
}
