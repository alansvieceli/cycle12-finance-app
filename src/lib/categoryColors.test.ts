import { chartPalette } from '../theme/colors';
import { Category } from '../types/finance';
import { getCategoryColor, suggestCategoryColor } from './categoryColors';

function makeCategory(id: string, overrides?: Partial<Category>): Category {
  return { id, name: id, propagation: 'zero', sortOrder: 0, ...overrides };
}

describe('getCategoryColor', () => {
  it('returns the custom color when the category has one set', () => {
    const categories = [makeCategory('a', { color: '#ff0000' })];
    expect(getCategoryColor('a', categories)).toBe('#ff0000');
  });

  it('returns a palette color based on sorted position when no custom color', () => {
    const categories = [makeCategory('a'), makeCategory('b')];
    expect(chartPalette).toContain(getCategoryColor('a', categories));
    expect(chartPalette).toContain(getCategoryColor('b', categories));
  });

  it('returns palette[0] when the category id is not found', () => {
    expect(getCategoryColor('missing', [])).toBe(chartPalette[0]);
  });

  it('wraps around the palette when there are more categories than palette entries', () => {
    const categories = Array.from({ length: chartPalette.length + 1 }, (_, i) =>
      makeCategory(`cat-${i}`, { sortOrder: i }),
    );
    const lastId = `cat-${chartPalette.length}`;
    expect(chartPalette).toContain(getCategoryColor(lastId, categories));
  });
});

describe('suggestCategoryColor', () => {
  it('returns the first palette color when no categories exist', () => {
    expect(suggestCategoryColor([])).toBe(chartPalette[0]);
  });

  it('returns the first color not yet used by any category', () => {
    const categories = [makeCategory('a', { color: chartPalette[0] })];
    expect(suggestCategoryColor(categories)).toBe(chartPalette[1]);
  });

  it('skips categories with no custom color when looking for unused colors', () => {
    const categories = [
      makeCategory('a'),
      makeCategory('b', { color: chartPalette[0] }),
    ];
    expect(suggestCategoryColor(categories)).toBe(chartPalette[1]);
  });

  it('returns palette[0] when all palette colors are already in use', () => {
    const categories = chartPalette.map((color, i) =>
      makeCategory(`cat-${i}`, { color }),
    );
    expect(suggestCategoryColor(categories)).toBe(chartPalette[0]);
  });
});
