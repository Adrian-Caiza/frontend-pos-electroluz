export function formatCurrency(value: number | string, currency = "$"): string {
  const numericValue = Number(value);
  if (isNaN(numericValue)) return `${currency}0.00`;
  return `${currency}${numericValue.toFixed(2)}`;
}
