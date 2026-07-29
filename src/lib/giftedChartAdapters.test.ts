import { toGiftedCategoryDonutData } from './giftedChartAdapters';

describe('gifted chart adapters', () => {
  it('maps category totals to non-zero donut data with stable colors', () => {
    expect(
      toGiftedCategoryDonutData([
        { categoryId: 'cards', color: '#FF6B1A', label: 'Cartões', value: 1000 },
        { categoryId: 'empty', color: '#32D078', label: 'Vazia', value: 0 },
        { categoryId: 'home', color: '#FFC845', label: 'Casa', value: 250 },
      ]),
    ).toEqual([
      {
        categoryId: 'cards',
        color: '#FF6B1A',
        label: 'Cartões',
        value: 1000,
      },
      {
        categoryId: 'home',
        color: '#FFC845',
        label: 'Casa',
        value: 250,
      },
    ]);
  });
});
