import type { AccountItem, Category } from '../types/finance';

export function sortCategories(categories: Category[]): Category[] {
  return categories.slice().sort(compareCategories);
}

export function sortAccountItems(
  accountItems: AccountItem[],
  categories: Category[],
): AccountItem[] {
  const categoryById = new Map(categories.map((category) => [category.id, category]));

  return accountItems.slice().sort((firstAccountItem, secondAccountItem) => {
    const firstCategory = categoryById.get(firstAccountItem.categoryId);
    const secondCategory = categoryById.get(secondAccountItem.categoryId);
    const categoryComparison = compareCategoryValues(firstCategory, secondCategory);

    if (categoryComparison !== 0) {
      return categoryComparison;
    }

    return (
      compareDueDay(firstAccountItem.dueDay, secondAccountItem.dueDay) ||
      firstAccountItem.name.localeCompare(secondAccountItem.name, 'pt-BR')
    );
  });
}

export function sortAccountItemsByDueDay(accountItems: AccountItem[]): AccountItem[] {
  return accountItems
    .slice()
    .sort(
      (firstAccountItem, secondAccountItem) =>
        compareDueDay(firstAccountItem.dueDay, secondAccountItem.dueDay) ||
        firstAccountItem.name.localeCompare(secondAccountItem.name, 'pt-BR'),
    );
}

export function suggestNextCategorySortOrder(categories: Category[]): number {
  const used = new Set(categories.map((c) => c.sortOrder));
  let n = 1;
  while (used.has(n)) n++;
  return n;
}

function compareCategories(firstCategory: Category, secondCategory: Category) {
  return compareCategoryValues(firstCategory, secondCategory);
}

function compareCategoryValues(
  firstCategory: Category | undefined,
  secondCategory: Category | undefined,
) {
  return (
    compareSortOrder(firstCategory?.sortOrder, secondCategory?.sortOrder) ||
    (firstCategory?.name ?? '').localeCompare(secondCategory?.name ?? '', 'pt-BR')
  );
}

function compareSortOrder(firstValue: unknown, secondValue: unknown) {
  return safeSortOrder(firstValue) - safeSortOrder(secondValue);
}

function compareDueDay(firstValue: unknown, secondValue: unknown) {
  return safeDueDay(firstValue) - safeDueDay(secondValue);
}

function safeSortOrder(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function safeDueDay(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}
