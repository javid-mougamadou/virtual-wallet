import { useState } from 'react';
import { Currency } from '../../types';
import { convertFromEUR, convertToEUR } from '../../utils/format';

type CagnotteEditFormProps = {
  initialName: string;
  initialTargetAmount: number; // Montant en EUR (stocké dans la base)
  currency: Currency;
  onSave: (name: string, targetAmount: number) => void; // targetAmount sera en EUR
  onCancel: () => void;
};

export const CagnotteEditForm = ({
  initialName,
  initialTargetAmount,
  currency,
  onSave,
  onCancel,
}: CagnotteEditFormProps) => {
  const [name, setName] = useState(initialName);
  // Convertir le montant initial (en EUR) vers la devise d'affichage
  const initialAmountInCurrency = convertFromEUR(initialTargetAmount, currency);
  const [targetAmount, setTargetAmount] = useState(initialAmountInCurrency.toString());

  const handleSubmit = () => {
    const target = parseFloat(targetAmount);
    if (name.trim() && !isNaN(target) && target > 0) {
      // Convertir le montant saisi en EUR avant stockage
      const targetInEUR = convertToEUR(target, currency);
      onSave(name.trim(), targetInEUR);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        className="input input-bordered w-full"
        value={name}
        onChange={(e: { target: { value: string } }) => setName(e.target.value)}
        placeholder="Nom de la cagnotte"
      />
      <input
        type="number"
        className="input input-bordered w-full"
        value={targetAmount}
        onChange={(e: { target: { value: string } }) => setTargetAmount(e.target.value)}
        placeholder="Montant initial"
        min="0"
        step="0.01"
      />
      <div className="flex gap-2">
        <button type="button" className="btn btn-sm btn-primary flex-1" onClick={handleSubmit}>
          Enregistrer
        </button>
        <button type="button" className="btn btn-sm btn-ghost flex-1" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </div>
  );
};

