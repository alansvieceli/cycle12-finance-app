import { sortAccountItems, sortAccountItemsByDueDay, sortCategories } from './sorting';
import { AccountItem, Category } from '../types/finance';

describe('sorting helpers', () => {
  it('sorts categories by sort order and name', () => {
    const categories: Category[] = [
      { id: 'b', name: 'Moradia', propagation: 'zero', sortOrder: 2 },
      { id: 'c', name: 'Cartões', propagation: 'zero', sortOrder: 0 },
      { id: 'a', name: 'Alimentação', propagation: 'zero', sortOrder: 0 },
    ];

    expect(sortCategories(categories).map((category) => category.id)).toEqual([
      'a',
      'c',
      'b',
    ]);
  });

  it('sorts accounts by category order, category name, due day, and account name', () => {
    const categories: Category[] = [
      { id: 'home', name: 'Casa', propagation: 'zero', sortOrder: 2 },
      { id: 'cards', name: 'Cartões', propagation: 'zero', sortOrder: 1 },
    ];
    const accountItems: AccountItem[] = [
      {
        id: 'energy',
        categoryId: 'home',
        dueDay: 10,
        name: 'Luz',
        sortOrder: 1,
      },
      {
        id: 'santander',
        categoryId: 'cards',
        dueDay: 18,
        name: 'Santander',
        sortOrder: 1,
      },
      {
        id: 'nubank',
        categoryId: 'cards',
        dueDay: 8,
        name: 'Nubank',
        sortOrder: 99,
      },
    ];

    expect(
      sortAccountItems(accountItems, categories).map((accountItem) => accountItem.id),
    ).toEqual(['nubank', 'santander', 'energy']);
  });

  it('sorts accounts by due day before name even when account sort order exists', () => {
    const categories: Category[] = [
      { id: 'cards', name: 'Cartões', propagation: 'zero', sortOrder: 1 },
    ];
    const accountItems = [
      {
        id: 'late',
        categoryId: 'cards',
        dueDay: 20,
        name: 'Boleto B',
        sortOrder: 1,
      },
      {
        id: 'early',
        categoryId: 'cards',
        dueDay: 5,
        name: 'Boleto C',
        sortOrder: 99,
      },
      {
        id: 'same-day-name',
        categoryId: 'cards',
        dueDay: 5,
        name: 'Boleto A',
        sortOrder: 50,
      },
    ];

    expect(
      sortAccountItems(accountItems, categories).map((accountItem) => accountItem.id),
    ).toEqual(['same-day-name', 'early', 'late']);
  });

  it('sorts payment checklist accounts only by due day and account name', () => {
    const accountItems: AccountItem[] = [
      {
        id: 'home',
        categoryId: 'home',
        dueDay: 20,
        name: 'Aluguel',
        sortOrder: 1,
      },
      {
        id: 'card',
        categoryId: 'cards',
        dueDay: 5,
        name: 'Cartão',
        sortOrder: 99,
      },
      {
        id: 'market',
        categoryId: 'food',
        dueDay: 5,
        name: 'Mercado',
        sortOrder: 1,
      },
    ];

    expect(
      sortAccountItemsByDueDay(accountItems).map((accountItem) => accountItem.id),
    ).toEqual(['card', 'market', 'home']);
  });

  it('treats missing or invalid category sort order as zero', () => {
    const categories = [
      { id: 'later', name: 'Depois', sortOrder: 2 },
      { id: 'missing', name: 'Sem ordem' },
      { id: 'invalid', name: 'Inválida', sortOrder: Number.NaN },
    ] as Category[];

    expect(sortCategories(categories).map((category) => category.id)).toEqual([
      'invalid',
      'missing',
      'later',
    ]);
  });
});
