export type Currency = 'EUR' | 'CAD' | 'USD';

export type EntryType = 'depense' | 'recette';

export type Cagnotte = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
};

export type Entry = {
  id: string;
  cagnotteId: string;
  type: EntryType;
  amount: number;
  label?: string;
  createdAt: string;
};

export type ValueEvent = {
  target: {
    value: string;
  };
};

export type ClickEvent = {
  preventDefault: () => void;
  stopPropagation: () => void;
};