import { chartPalette } from '../theme/colors';
import type { Subscription } from '../types/finance';
import type { CategoryChartPoint } from './chartData';

const MONTHS_IN_YEAR = 12;

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

/** Maps subscriptions to the shape the existing donut chart already consumes. */
export function toSubscriptionChartPoints(
  subscriptions: Subscription[],
): CategoryChartPoint[] {
  return subscriptions
    .filter((subscription) => subscription.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .map((subscription, index) => ({
      categoryId: subscription.id,
      color: subscription.color ?? chartPalette[index % chartPalette.length],
      label: subscription.name,
      value: subscription.amount,
    }));
}
