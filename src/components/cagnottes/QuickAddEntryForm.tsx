import { useState } from 'react';
import { Currency, EntryType } from '../../types';
import { convertToEUR } from '../../utils/format';

type QuickAddEntryFormProps = {
  cagnotteName: string;
  currency: Currency;
  onAdd: (type: EntryType, amount: number, label?: string) => void;
  onCancel: () => void;
};

export const QuickAddEntryForm = ({
  cagnotteName,
  currency,
  onAdd,
  onCancel,
}: QuickAddEntryFormProps) => {
  const [entryType, setEntryType] = useState<EntryType>('depense');
  const [entryAmount, setEntryAmount] = useState('');
  const [entryLabel, setEntryLabel] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);

    const parsedAmount = parseFloat(entryAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Montant invalide.');
      return;
    }

    // Convertir le montant saisi en EUR avant stockage
    const amountInEUR = convertToEUR(parsedAmount, currency);
    onAdd(entryType, amountInEUR, entryLabel.trim() || undefined);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-center">{cagnotteName}</h3>
      <div>
        <label htmlFor="entry-type" className="label">
          <span className="label-text">Type</span>
        </label>
        <select
          id="entry-type"
          className="select select-bordered w-full"
          value={entryType}
          onChange={(e: { target: { value: string } }) => setEntryType(e.target.value as EntryType)}
        >
          <option value="recette">Recette</option>
          <option value="depense">Dépense</option>
        </select>
      </div>
      <div>
        <label htmlFor="entry-amount" className="label">
          <span className="label-text">Montant ({currency})</span>
        </label>
        <input
          id="entry-amount"
          type="number"
          className="input input-bordered w-full"
          value={entryAmount}
          onChange={(e: { target: { value: string } }) => setEntryAmount(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div>
        <label htmlFor="entry-label" className="label">
          <span className="label-text">Label (optionnel)</span>
        </label>
        <input
          id="entry-label"
          type="text"
          className="input input-bordered w-full"
          value={entryLabel}
          onChange={(e: { target: { value: string } }) => setEntryLabel(e.target.value)}
          placeholder="Description"
        />
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="flex gap-2">
        <button type="button" className="btn btn-sm btn-primary flex-1" onClick={handleSubmit}>
          Ajouter
        </button>
        <button type="button" className="btn btn-sm btn-ghost flex-1" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </div>
  );
};

