export const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  style: 'currency',
});

export const percentageFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  style: 'percent',
});

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
});

export function formatEditableAmount(value: number) {
  if (!Number.isFinite(value) || value === 0) {
    return '';
  }

  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

export function maskCurrency(value: number, hidden: boolean): string {
  return hidden ? 'R$ ••••' : currencyFormatter.format(value);
}

export function formatMonthLabel(year: number, month: number) {
  const monthLabel = monthFormatter.format(new Date(year, month - 1, 1));
  const label = `${monthLabel}/${year}`;

  return label.charAt(0).toUpperCase() + label.slice(1);
}
