import { useState, useEffect } from 'react';
import { Cagnotte, EntryType, Currency } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { convertToEUR } from '../utils/format';

type EntryFormProps = {
  cagnottes: Cagnotte[];
  currency: Currency;
  onSubmit: (cagnotteId: string, type: EntryType, amount: number, label?: string) => void;
};

export const EntryForm = ({ cagnottes, currency, onSubmit }: EntryFormProps) => {
  const [isOpen, setIsOpen] = usePersistentState<boolean>({
    key: 'virtualwallet.entryform-collapsed-v1',
    defaultValue: false,
  });
  const [selectedCagnotteId, setSelectedCagnotteId] = useState<string>('');
  const [entryType, setEntryType] = useState<EntryType>('depense');
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Pré-sélectionner la première cagnotte si disponible
  useEffect(() => {
    if (cagnottes.length > 0 && !selectedCagnotteId) {
      setSelectedCagnotteId(cagnottes[0].id);
    }
  }, [cagnottes, selectedCagnotteId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedCagnotteId) {
      setError('Sélectionnez une cagnotte.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Montant invalide.');
      return;
    }

    // Convertir le montant saisi en EUR avant stockage
    const amountInEUR = convertToEUR(parsedAmount, currency);
    onSubmit(selectedCagnotteId, entryType, amountInEUR, label.trim() || undefined);
    setAmount('');
    setLabel('');
    setError(null);
    // Garder la cagnotte sélectionnée après soumission
  };

  return (
    <section className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Ajouter une entrée</h2>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Réduire' : 'Développer'}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>
      {isOpen && (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cagnotte-select" className="label">
            <span className="label-text">Cagnotte</span>
          </label>
          <select
            id="cagnotte-select"
            className="select select-bordered w-full"
            value={selectedCagnotteId}
            onChange={(e) => setSelectedCagnotteId(e.target.value)}
            disabled={cagnottes.length === 0}
          >
            <option value="">Sélectionnez une cagnotte</option>
            {cagnottes.map((cagnotte) => (
              <option key={cagnotte.id} value={cagnotte.id}>
                {cagnotte.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="entry-type" className="label">
            <span className="label-text">Type</span>
          </label>
          <select
            id="entry-type"
            className="select select-bordered w-full"
            value={entryType}
            onChange={(e) => setEntryType(e.target.value as EntryType)}
          >
            <option value="recette">Recette</option>
            <option value="depense">Dépense</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="label">
            <span className="label-text">Montant ({currency})</span>
          </label>
          <input
            id="amount"
            type="number"
            className="input input-bordered w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="label" className="label">
            <span className="label-text">Label (optionnel)</span>
          </label>
          <input
            id="label"
            type="text"
            className="input input-bordered w-full"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Description"
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={cagnottes.length === 0}
        >
          Ajouter
        </button>
      </form>
      )}
    </section>
  );
};
