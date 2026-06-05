import {
  currencyFormatter,
  formatEditableAmount,
  formatMonthLabel,
  percentageFormatter,
} from './formatters';

describe('formatters', () => {
  it('formats currency values for Brazilian Portuguese', () => {
    const formatted = currencyFormatter.format(1234.56);

    expect(formatted).toContain('R$');
    expect(formatted).toContain('1.234,56');
  });

  it('formats percentages with one decimal place', () => {
    const formatted = percentageFormatter.format(0.1234);

    expect(formatted).toContain('12,3');
    expect(formatted).toContain('%');
  });

  it('formats editable amounts for text inputs', () => {
    expect(formatEditableAmount(1234.56)).toBe('1234,56');
    expect(formatEditableAmount(213.3)).toBe('213,30');
    expect(formatEditableAmount(-10.5)).toBe('-10,50');
    expect(formatEditableAmount(0)).toBe('');
    expect(formatEditableAmount(Number.NaN)).toBe('');
    expect(formatEditableAmount(Number.POSITIVE_INFINITY)).toBe('');
  });

  it('formats month labels with the first letter capitalized', () => {
    expect(formatMonthLabel(2026, 1)).toBe('Janeiro de 2026');
    expect(formatMonthLabel(2026, 12)).toBe('Dezembro de 2026');
  });
});
