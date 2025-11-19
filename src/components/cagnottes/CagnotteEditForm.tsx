import { useState } from 'react';

type CagnotteEditFormProps = {
  initialName: string;
  initialTargetAmount: number;
  onSave: (name: string, targetAmount: number) => void;
  onCancel: () => void;
};

export const CagnotteEditForm = ({
  initialName,
  initialTargetAmount,
  onSave,
  onCancel,
}: CagnotteEditFormProps) => {
  const [name, setName] = useState(initialName);
  const [targetAmount, setTargetAmount] = useState(initialTargetAmount.toString());

  const handleSubmit = () => {
    const target = parseFloat(targetAmount);
    if (name.trim() && !isNaN(target) && target > 0) {
      onSave(name.trim(), target);
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

