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