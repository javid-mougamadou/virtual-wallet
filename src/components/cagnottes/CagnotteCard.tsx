import { Cagnotte, Currency, Entry } from '../../types';
import { formatAmount } from '../../utils/format';
import { getProgressPercentage, getLastEntry } from '../../utils/cagnottes';
import { CagnotteEditForm } from './CagnotteEditForm';
import { QuickAddEntryForm } from './QuickAddEntryForm';

type CagnotteCardProps = {
  cagnotte: Cagnotte;
  entries: Entry[];
  currency: Currency;
  isEditing: boolean;
  isAddingEntry: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (name: string, targetAmount: number) => void;
  onStartAddEntry: () => void;
  onCancelAddEntry: () => void;
  onAddEntry: (type: 'depense' | 'recette', amount: number, label?: string) => void;
  onDelete: () => void;
};

export const CagnotteCard = ({
  cagnotte,
  entries,
  currency,
  isEditing,
  isAddingEntry,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onStartAddEntry,
  onCancelAddEntry,
  onAddEntry,
  onDelete,
}: CagnotteCardProps) => {
  const progress = getProgressPercentage(cagnotte.currentAmount, cagnotte.targetAmount);
  const lastEntry = getLastEntry(cagnotte.id, entries);

  if (isEditing) {
    return (
      <div className="card border border-base-300 bg-base-200 shadow-md">
        <div className="card-body">
          <CagnotteEditForm
            initialName={cagnotte.name}
            initialTargetAmount={cagnotte.targetAmount}
            currency={currency}
            onSave={onSaveEdit}
            onCancel={onCancelEdit}
          />
        </div>
      </div>
    );
  }

  if (isAddingEntry) {
    return (
      <div className="card border border-base-300 bg-base-200 shadow-md">
        <div className="card-body">
          <QuickAddEntryForm
            cagnotteName={cagnotte.name}
            currency={currency}
            onAdd={onAddEntry}
            onCancel={onCancelAddEntry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="card border border-base-300 bg-base-200 shadow-md">
      <div className="card-body">
        <h3 className="card-title text-lg text-center justify-center">{cagnotte.name}</h3>
        <div className="flex flex-col items-center justify-center py-4">
          <div
            className="radial-progress text-primary"
            style={
              {
                '--value': Math.min(progress, 100),
                '--size': '8rem',
                '--thickness': '0.5rem',
              } as Record<string, string | number>
            }
            role="progressbar"
            aria-valuenow={Math.min(progress, 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {formatAmount(cagnotte.currentAmount, currency)}
          </div>
        </div>
        <div className="space-y-1 text-center">
          <p className="text-sm text-base-content/70">
            {formatAmount(cagnotte.currentAmount, currency)} /{' '}
            {formatAmount(cagnotte.targetAmount, currency)}
          </p>
          {lastEntry && <LastEntryDisplay entry={lastEntry} currency={currency} />}
        </div>
        <div className="card-actions mt-4 justify-center gap-2">
          <button type="button" className="btn btn-sm btn-outline" onClick={onStartEdit}>
            Modifier
          </button>
          <button type="button" className="btn btn-sm btn-error btn-outline" onClick={onDelete}>
            Supprimer
          </button>
        </div>
        <div className="card-actions justify-center">
          <button type="button" className="btn btn-sm btn-primary" onClick={onStartAddEntry}>
            Ajouter une entrée
          </button>
        </div>
      </div>
    </div>
  );
};

type LastEntryDisplayProps = {
  entry: Entry;
  currency: Currency;
};

const LastEntryDisplay = ({ entry, currency }: LastEntryDisplayProps) => {
  const date = new Date(entry.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const sign = entry.type === 'recette' ? '+' : '-';
  const amount = formatAmount(entry.amount, currency);
  const label = entry.label ? ` ${entry.label}` : '';
  const textColor = entry.type === 'recette' ? 'text-success' : 'text-error';

  return (
    <p className="text-xs mt-1">
      <span className="text-base-content/50">{date}</span>{' '}
      <span className={textColor}>
        {sign}
        {amount}
        {label}
      </span>
    </p>
  );
};

