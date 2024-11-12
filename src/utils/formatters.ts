/**
 * Formats a number as currency with no decimal places
 * @param value Number to format
 * @returns Formatted string with $ prefix and commas
 */
export function formatCurrency(value: number): string {
  return `$${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value)}`;
}

/**
 * Formats a rate as a percentage with 2 decimal places
 * @param rate Rate to format (e.g., 0.1355 for 13.55%)
 * @returns Formatted string with % suffix
 */
export function formatRate(rate: number | null): string {
  if (rate === null || isNaN(rate)) return 'N/A';
  try {
    // Convert ln rate to percentage
    const percentage = (Math.exp(rate) - 1) * 100;
    return isNaN(percentage) ? 'N/A' : `${percentage.toFixed(2)}%`;
  } catch (error) {
    console.error('Error formatting rate:', error);
    return 'N/A';
  }
}