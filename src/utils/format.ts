import { Currency } from '../types';

const currencyLocaleMap: Record<Currency, string> = {
  EUR: 'fr-FR',
  CAD: 'fr-CA',
  YEN: 'ja-JP',
};

/** Code ISO 4217 pour Intl (YEN n’est pas un code valide, on utilise JPY). */
const intlCurrencyCode: Record<Currency, string> = {
  EUR: 'EUR',
  CAD: 'CAD',
  YEN: 'JPY',
};

// Taux de change : 1 EUR = 1.61 CAD
const EUR_TO_CAD_RATE = 1.61;

// 100 EUR = 18 394,70 ¥ — à ajuster comme le taux CAD si besoin
const EUR_TO_YEN_RATE = 18394.7 / 100;

/**
 * Convertit un montant depuis EUR vers la devise cible
 * Les montants sont stockés en EUR dans la base de données
 */
export const convertFromEUR = (amountEUR: number, targetCurrency: Currency): number => {
  if (targetCurrency === 'EUR') {
    return amountEUR;
  }
  if (targetCurrency === 'CAD') {
    return amountEUR * EUR_TO_CAD_RATE;
  }
  return amountEUR * EUR_TO_YEN_RATE;
};

/**
 * Convertit un montant depuis la devise source vers EUR
 * Utilisé lors de la saisie de montants dans les formulaires
 */
export const convertToEUR = (amount: number, sourceCurrency: Currency): number => {
  if (sourceCurrency === 'EUR') {
    return amount;
  }
  if (sourceCurrency === 'CAD') {
    return amount / EUR_TO_CAD_RATE;
  }
  return amount / EUR_TO_YEN_RATE;
};

export const formatAmount = (value: number, currency: Currency = 'EUR'): string => {
  // Convertir le montant depuis EUR (devise de stockage) vers la devise d'affichage
  const convertedAmount = convertFromEUR(value, currency);

  return new Intl.NumberFormat(currencyLocaleMap[currency], {
    style: 'currency',
    currency: intlCurrencyCode[currency],
    maximumFractionDigits: 0,
  }).format(Math.round(convertedAmount));
};
