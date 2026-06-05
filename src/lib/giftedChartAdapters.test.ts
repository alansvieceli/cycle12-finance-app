import {
  toGiftedBalanceBarData,
  toGiftedCategoryDonutData,
  toGiftedExpenseLineData,
} from './giftedChartAdapters';
import { colors } from '../theme/colors';

describe('gifted chart adapters', () => {
  it('maps balance values to positive and negative bar colors', () => {
    expect(
      toGiftedBalanceBarData([
        { key: '2026-06', label: 'Jun', value: 120 },
        { key: '2026-07', label: 'Jul', value: -80 },
      ]),
    ).toEqual([
      {
        disablePress: true,
        frontColor: colors.positive,
        label: 'Jun',
        value: 120,
      },
      {
        disablePress: true,
        frontColor: colors.negative,
        label: 'Jul',
        value: -80,
      },
    ]);
  });

  it('maps expense values to line data with accent data points', () => {
    expect(
      toGiftedExpenseLineData([
        { key: '2026-06', label: 'Jun', value: 1000 },
        { key: '2026-07', label: 'Jul', value: 800 },
      ]),
    ).toEqual([
      { dataPointColor: colors.accent, label: 'Jun', value: 1000 },
      { dataPointColor: colors.accent, label: 'Jul', value: 800 },
    ]);
  });

  it('maps category totals to non-zero donut data with stable colors', () => {
    expect(
      toGiftedCategoryDonutData([
        { categoryId: 'cards', label: 'Cartões', value: 1000 },
        { categoryId: 'empty', label: 'Vazia', value: 0 },
        { categoryId: 'home', label: 'Casa', value: 250 },
      ]),
    ).toEqual([
      {
        categoryId: 'cards',
        color: colors.accent,
        label: 'Cartões',
        value: 1000,
      },
      {
        categoryId: 'home',
        color: colors.positive,
        label: 'Casa',
        value: 250,
      },
    ]);
  });
});
