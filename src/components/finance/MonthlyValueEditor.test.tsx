import { fireEvent, render, screen } from '@testing-library/react-native';

import { createProjectionMonths } from '../../lib/financeCalculations';
import { currencyFormatter } from '../../lib/formatters';
import type { AccountItem, Category, MonthlyValue } from '../../types/finance';
import { MonthlyValueEditor } from './MonthlyValueEditor';

const projectionMonths = createProjectionMonths(new Date(2026, 6, 1));

const categories: Category[] = [
  { id: 'category-fixed', name: 'Fixos', propagation: 'zero', sortOrder: 0 },
];

const accountItems: AccountItem[] = [
  {
    categoryId: 'category-fixed',
    dueDay: 10,
    id: 'account-rent',
    name: 'Aluguel',
    sortOrder: 0,
  },
  {
    categoryId: 'category-fixed',
    dueDay: 20,
    id: 'account-internet',
    name: 'Internet',
    sortOrder: 1,
  },
];

const monthlyValues: MonthlyValue[] = [
  { accountItemId: 'account-rent', amount: 1200, month: 7, year: 2026 },
  { accountItemId: 'account-rent', amount: 800, month: 8, year: 2026 },
];

function renderEditor(
  overrides: Partial<Parameters<typeof MonthlyValueEditor>[0]> = {},
) {
  const props = {
    accountItems,
    categories,
    monthlyValues,
    onAdjustMonthlyValue: jest.fn(),
    onChangeMonthlyValue: jest.fn(),
    onSelectAccountItem: jest.fn(),
    onToggleReview: jest.fn(),
    paymentStatuses: [],
    projectionMonths,
    selectedAccountItem: accountItems[0],
    ...overrides,
  };

  render(<MonthlyValueEditor {...props} />);

  return props;
}

/**
 * The 12 month rows render before the adjustment modal, so the modal's amount
 * field is always the last masked input in the tree.
 */
function getModalAmountInput() {
  const amountInputs = screen.getAllByPlaceholderText('0,00');

  return amountInputs[amountInputs.length - 1];
}

describe('MonthlyValueEditor', () => {
  it('asks for a category and an account when none is selected', () => {
    renderEditor({ selectedAccountItem: undefined });

    expect(
      screen.getByText('Crie uma categoria e uma conta para editar valores mensais.'),
    ).toBeOnTheScreen();
  });

  it('renders one row per projection month and the summed total', () => {
    renderEditor();

    expect(screen.getAllByPlaceholderText('0,00')).toHaveLength(12);
    expect(screen.getByText('Jul/2026')).toBeOnTheScreen();
    expect(screen.getByText('Jun/2027')).toBeOnTheScreen();
    expect(screen.getByText('Total dos 12 meses')).toBeOnTheScreen();
    expect(screen.getByText(currencyFormatter.format(2000))).toBeOnTheScreen();
  });

  it('saves an inline month value on blur', () => {
    const { onChangeMonthlyValue } = renderEditor();
    const firstMonthInput = screen.getAllByPlaceholderText('0,00')[0];

    fireEvent.changeText(firstMonthInput, '15000');
    fireEvent(firstMonthInput, 'blur');

    expect(onChangeMonthlyValue).toHaveBeenCalledWith(
      'account-rent',
      expect.objectContaining({ month: 7, year: 2026 }),
      150,
    );
  });

  it('applies an addition across the selected number of installments', () => {
    const { onAdjustMonthlyValue } = renderEditor();

    fireEvent.press(screen.getAllByLabelText('Ajustar valor')[1]);
    fireEvent.changeText(getModalAmountInput(), '15000');
    fireEvent.press(screen.getByText('Parcelas'));
    fireEvent.press(screen.getByText('3 meses'));
    fireEvent.press(screen.getByText('Novo total'));

    expect(onAdjustMonthlyValue).toHaveBeenCalledWith(
      'account-rent',
      expect.objectContaining({ month: 8, year: 2026 }),
      150,
      'add',
      3,
    );
  });

  it('applies a subtraction to the selected month only', () => {
    const { onAdjustMonthlyValue } = renderEditor();

    fireEvent.press(screen.getAllByLabelText('Ajustar valor')[0]);
    fireEvent.press(screen.getByText('−'));
    fireEvent.changeText(getModalAmountInput(), '5000');
    fireEvent.press(screen.getByText('Novo total'));

    expect(onAdjustMonthlyValue).toHaveBeenCalledWith(
      'account-rent',
      expect.objectContaining({ month: 7, year: 2026 }),
      50,
      'subtract',
      undefined,
    );
  });

  it('toggles the review mark for the selected account in the current month', () => {
    const { onToggleReview } = renderEditor();

    fireEvent.press(screen.getByLabelText('Marcar conta como revisada'));

    expect(onToggleReview).toHaveBeenCalledWith(
      'account-rent',
      expect.objectContaining({ month: 7, year: 2026 }),
    );
  });

  it('shows the reviewed state when the account is already marked', () => {
    renderEditor({
      paymentStatuses: [
        {
          accountItemId: 'account-rent',
          isPaid: false,
          isReviewed: true,
          month: 7,
          year: 2026,
        },
      ],
    });

    expect(screen.getByLabelText('Desmarcar conta revisada')).toBeOnTheScreen();
  });
});
