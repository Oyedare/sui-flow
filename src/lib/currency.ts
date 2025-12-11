import { Currency } from "@/contexts/SettingsContext";

// Default exchange rates (USD as base) - used as fallback
const DEFAULT_EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1580,
  JPY: 149,
};

// Currency symbols
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
  JPY: "¥",
};

/**
 * Format a USD price to the specified currency
 */
export function formatCurrency(
  usdAmount: number,
  currency: Currency,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    exchangeRates?: Record<Currency, number>;
  }
): string {
  const rates = options?.exchangeRates || DEFAULT_EXCHANGE_RATES;
  const rate = rates[currency];
  const convertedAmount = usdAmount * rate;
  const symbol = CURRENCY_SYMBOLS[currency];

  const formatted = convertedAmount.toLocaleString(undefined, {
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  });

  return `${symbol}${formatted}`;
}

/**
 * Get currency symbol for a given currency
 */
export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency];
}

/**
 * Convert USD amount to target currency
 */
export function convertCurrency(
  usdAmount: number,
  currency: Currency,
  exchangeRates?: Record<Currency, number>
): number {
  const rates = exchangeRates || DEFAULT_EXCHANGE_RATES;
  return usdAmount * rates[currency];
}
