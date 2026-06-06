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
  year: 'numeric',
});

export function formatEditableAmount(value: number) {
  if (!Number.isFinite(value) || value === 0) {
    return '';
  }

  return value.toFixed(2).replace('.', ',');
}

export function formatMonthLabel(year: number, month: number) {
  const label = monthFormatter.format(new Date(year, month - 1, 1));

  return label.charAt(0).toUpperCase() + label.slice(1);
}
