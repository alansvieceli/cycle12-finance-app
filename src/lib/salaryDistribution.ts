import type { FinanceState } from '../types/finance';
import { getCategoryColor } from './categoryColors';
import {
  calculateAvailableIncome,
  calculateCategoryTotals,
  calculateMonthlyTotalExpenses,
  type ProjectionMonth,
} from './financeCalculations';
import { sortCategories } from './sorting';

const TAIL_SHARE_THRESHOLD = 0.08;

type SalaryDistributionSegment = {
  categoryId: string;
  color: string;
  label: string;
  value: number;
  share: number;
};

export type SalaryDistribution = {
  availableIncome: number;
  totalExpenses: number;
  isOverBudget: boolean;
  hasSalary: boolean;
  denominator: number;
  leftover: number;
  leftoverShare: number;
  segments: SalaryDistributionSegment[];
  tailGroupedCount: number;
};

export function buildSalaryDistribution(
  financeState: FinanceState,
  projectionMonth: ProjectionMonth,
): SalaryDistribution {
  const sortedCategories = sortCategories(financeState.categories);
  const categoryNamesById = Object.fromEntries(
    sortedCategories.map((category) => [category.id, category.name]),
  );

  const availableIncome = calculateAvailableIncome(
    financeState.settings,
    projectionMonth,
  );
  const totalExpenses = calculateMonthlyTotalExpenses(
    sortedCategories,
    financeState.accountItems,
    financeState.monthlyValues,
    projectionMonth,
  );
  const isOverBudget = totalExpenses > availableIncome;
  const denominator = isOverBudget ? totalExpenses : availableIncome;
  const leftover = Math.max(availableIncome - totalExpenses, 0);
  const leftoverShare = !isOverBudget && denominator > 0 ? leftover / denominator : 0;

  const segments: SalaryDistributionSegment[] = calculateCategoryTotals(
    sortedCategories,
    financeState.accountItems,
    financeState.monthlyValues,
    projectionMonth,
  )
    .filter((categoryTotal) => categoryTotal.total > 0)
    .map((categoryTotal) => ({
      categoryId: categoryTotal.categoryId,
      color: getCategoryColor(categoryTotal.categoryId, sortedCategories),
      label: categoryNamesById[categoryTotal.categoryId] ?? '-',
      value: categoryTotal.total,
      share: denominator > 0 ? categoryTotal.total / denominator : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const tailGroupedCount = segments.filter(
    (segment) => segment.share < TAIL_SHARE_THRESHOLD,
  ).length;

  return {
    availableIncome,
    totalExpenses,
    isOverBudget,
    hasSalary: availableIncome > 0,
    denominator,
    leftover,
    leftoverShare,
    segments,
    tailGroupedCount,
  };
}
