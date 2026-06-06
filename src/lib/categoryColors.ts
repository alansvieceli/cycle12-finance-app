import { chartPalette } from '../theme/colors';
import { Category } from '../types/finance';
import { sortCategories } from './sorting';

export function getCategoryColor(categoryId: string, categories: Category[]): string {
  const category = categories.find((c) => c.id === categoryId);

  if (category?.color) {
    return category.color;
  }

  const sortedIndex = sortCategories(categories).findIndex((c) => c.id === categoryId);

  return chartPalette[Math.max(0, sortedIndex) % chartPalette.length];
}

export function suggestCategoryColor(categories: Category[]): string {
  const usedColors = new Set(categories.map((c) => c.color).filter(Boolean));
  return chartPalette.find((color) => !usedColors.has(color)) ?? chartPalette[0];
}
