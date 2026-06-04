export function parseCurrencyInput(value: string) {
  const normalizedValue = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function parseDueDay(value: string) {
  const parsedValue = Number(value.replace(/\D/g, ''));

  if (!Number.isFinite(parsedValue)) {
    return 1;
  }

  return Math.max(1, Math.min(31, parsedValue));
}

export function clampVisibleMonthCount(value: number | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 12;
  }

  return Math.max(1, Math.min(12, Math.round(value)));
}
