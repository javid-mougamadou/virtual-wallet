import { Cagnotte, Entry } from '../types';

/**
 * Calcule le pourcentage de progression d'une cagnotte
 */
export const getProgressPercentage = (current: number, target: number): number => {
  if (target === 0) return 0;
  // Le pourcentage peut dépasser 100% si le montant actuel dépasse le montant initial
  return Math.max((current / target) * 100, 0);
};

/**
 * Récupère la dernière entrée d'une cagnotte
 */
export const getLastEntry = (cagnotteId: string, entries: Entry[]): Entry | null => {
  const cagnotteEntries = entries
    .filter((e) => e.cagnotteId === cagnotteId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return cagnotteEntries.length > 0 ? cagnotteEntries[0] : null;
};

