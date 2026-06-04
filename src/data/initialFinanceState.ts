import { FinanceState, MonthlyValue } from '../types/finance';
import { ProjectionMonth } from '../lib/financeCalculations';

const categories = [
  { id: 'credit-card', name: 'Cartão de Crédito', sortOrder: 1 },
  { id: 'car', name: 'Carro', sortOrder: 2 },
  { id: 'home', name: 'Casa', sortOrder: 3 },
  { id: 'other', name: 'Outros', sortOrder: 4 },
];

const accountItems = [
  {
    id: 'nubank',
    categoryId: 'credit-card',
    name: 'Nubank',
    dueDay: 8,
    sortOrder: 1,
  },
  {
    id: 'santander-card',
    categoryId: 'credit-card',
    name: 'Santander',
    dueDay: 18,
    sortOrder: 2,
  },
  {
    id: 'car-payment',
    categoryId: 'car',
    name: 'Volkswagen',
    dueDay: 22,
    sortOrder: 1,
  },
  {
    id: 'power',
    categoryId: 'home',
    name: 'Luz',
    dueDay: 10,
    sortOrder: 1,
  },
  {
    id: 'internet',
    categoryId: 'home',
    name: 'TV/Internet',
    dueDay: 10,
    sortOrder: 2,
  },
  {
    id: 'phone',
    categoryId: 'other',
    name: 'Vivo',
    dueDay: 26,
    sortOrder: 1,
  },
];

const baseAmountsByAccountId: Record<string, number[]> = {
  nubank: [2700, 2550, 2400, 2150, 1600, 1140],
  'santander-card': [2100, 1750, 1200, 1100, 350, 350],
  'car-payment': [1801, 1801, 1801, 0, 0, 0],
  power: [180, 180, 180, 180, 180, 180],
  internet: [450, 450, 450, 450, 450, 450],
  phone: [140, 140, 140, 140, 140, 140],
};

function createInitialMonthlyValues(
  projectionMonths: ProjectionMonth[],
): MonthlyValue[] {
  return accountItems.flatMap((accountItem) =>
    projectionMonths.map((projectionMonth, index) => ({
      accountItemId: accountItem.id,
      month: projectionMonth.month,
      year: projectionMonth.year,
      amount:
        baseAmountsByAccountId[accountItem.id][
          index % baseAmountsByAccountId[accountItem.id].length
        ],
    })),
  );
}

export function createInitialFinanceState(
  projectionMonths: ProjectionMonth[],
): FinanceState {
  return {
    settings: {
      monthlySalary: 13400,
      currentMonthExtraBalance: 1800,
    },
    categories,
    accountItems,
    monthlyValues: createInitialMonthlyValues(projectionMonths),
  };
}
