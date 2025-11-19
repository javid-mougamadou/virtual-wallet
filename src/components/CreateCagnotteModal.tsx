import { useState } from 'react';
import { Currency } from '../types';

type CreateCagnotteModalProps = {
  currency: Currency;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, targetAmount: number) => void;
};

export const CreateCagnotteModal = ({
  currency,
  isOpen,
  onClose,
  onSubmit,
}: CreateCagnotteModalProps) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Le nom de la cagnotte est requis.');
      return;
    }

    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Le montant initial doit être supérieur à 0.');
      return;
    }

    onSubmit(name.trim(), amount);
    setName('');
    setTargetAmount('');
    setError(null);
    onClose();
  };

  const handleClose = () => {
    setName('');
    setTargetAmount('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">Créer une nouvelle cagnotte</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="cagnotte-name" className="label">
              <span className="label-text">Nom de la cagnotte</span>
            </label>
            <input
              id="cagnotte-name"
              type="text"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Vacances, Épargne..."
              required
            />
          </div>

          <div>
            <label htmlFor="target-amount" className="label">
              <span className="label-text">Montant initial ({currency})</span>
            </label>
            <input
              id="target-amount"
              type="number"
              className="input input-bordered w-full"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Créer
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={handleClose} />
    </div>
  );
};
