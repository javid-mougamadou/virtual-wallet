import { Currency } from '../types';

const currencyLocaleMap: Record<Currency, string> = {
  EUR: 'fr-FR',
  CAD: 'fr-CA',
  USD: 'en-US',
};

export const formatAmount = (value: number, currency: Currency = 'EUR'): string =>
  new Intl.NumberFormat(currencyLocaleMap[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
