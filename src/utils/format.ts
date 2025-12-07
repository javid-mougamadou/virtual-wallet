import { Currency } from '../types';

const currencyLocaleMap: Record<Currency, string> = {
  EUR: 'fr-FR',
  CAD: 'fr-CA',
};

// Taux de change : 1 EUR = 1.61 CAD
const EUR_TO_CAD_RATE = 1.61;

/**
 * Convertit un montant depuis EUR vers la devise cible
 * Les montants sont stockés en EUR dans la base de données
 */
export const convertFromEUR = (amountEUR: number, targetCurrency: Currency): number => {
  if (targetCurrency === 'EUR') {
    return amountEUR;
  }
  // Conversion vers CAD
  return amountEUR * EUR_TO_CAD_RATE;
};

/**
 * Convertit un montant depuis la devise source vers EUR
 * Utilisé lors de la saisie de montants dans les formulaires
 */
export const convertToEUR = (amount: number, sourceCurrency: Currency): number => {
  if (sourceCurrency === 'EUR') {
    return amount;
  }
  // Conversion depuis CAD vers EUR
  return amount / EUR_TO_CAD_RATE;
};

export const formatAmount = (value: number, currency: Currency = 'EUR'): string => {
  // Convertir le montant depuis EUR (devise de stockage) vers la devise d'affichage
  const convertedAmount = convertFromEUR(value, currency);
  
  return new Intl.NumberFormat(currencyLocaleMap[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(convertedAmount);
};
