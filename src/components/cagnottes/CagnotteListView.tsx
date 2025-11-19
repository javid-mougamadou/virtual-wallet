import { Cagnotte, Currency, Entry, EntryType } from '../../types';
import { formatAmount } from '../../utils/format';
import { getLastEntry } from '../../utils/cagnottes';
import { CagnotteEditForm } from './CagnotteEditForm';
import { QuickAddEntryForm } from './QuickAddEntryForm';

type CagnotteListViewProps = {
  cagnottes: Cagnotte[];
  entries: Entry[];
  currency: Currency;
  editingId: string | null;
  addingEntryId: string | null;
  onStartEdit: (cagnotte: Cagnotte) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string, name: string, targetAmount: number) => void;
  onStartAddEntry: (cagnotteId: string) => void;
  onCancelAddEntry: () => void;
  onAddEntry: (cagnotteId: string, type: EntryType, amount: number, label?: string) => void;
  onDelete: (id: string) => void;
};

export const CagnotteListView = ({
  cagnottes,
  entries,
  currency,
  editingId,
  addingEntryId,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onStartAddEntry,
  onCancelAddEntry,
  onAddEntry,
  onDelete,
}: CagnotteListViewProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Solde actuel</th>
            <th>Montant initial</th>
            <th>Dernière entrée</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cagnottes.map((cagnotte) => {
            const lastEntry = getLastEntry(cagnotte.id, entries);
            const isEditing = editingId === cagnotte.id;
            const isAddingEntry = addingEntryId === cagnotte.id;

            return (
              <tr key={cagnotte.id} className="hover">
                {isEditing ? (
                  <td colSpan={5}>
                    <CagnotteEditForm
                      initialName={cagnotte.name}
                      initialTargetAmount={cagnotte.targetAmount}
                      onSave={(name, target) => onSaveEdit(cagnotte.id, name, target)}
                      onCancel={onCancelEdit}
                    />
                  </td>
                ) : isAddingEntry ? (
                  <td colSpan={5}>
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <span className="font-semibold">{cagnotte.name}</span>
                      </div>
                      <QuickAddEntryForm
                        cagnotteName={cagnotte.name}
                        currency={currency}
                        onAdd={(type, amount, label) => onAddEntry(cagnotte.id, type, amount, label)}
                        onCancel={onCancelAddEntry}
                      />
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="font-semibold">{cagnotte.name}</td>
                    <td>{formatAmount(cagnotte.currentAmount, currency)}</td>
                    <td>{formatAmount(cagnotte.targetAmount, currency)}</td>
                    <td>
                      {lastEntry ? (
                        <div className="text-xs">
                          <span className="text-base-content/50">
                            {new Date(lastEntry.createdAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </span>{' '}
                          <span className={lastEntry.type === 'recette' ? 'text-success' : 'text-error'}>
                            {lastEntry.type === 'recette' ? '+' : '-'}
                            {formatAmount(lastEntry.amount, currency)}
                            {lastEntry.label ? ` ${lastEntry.label}` : ''}
                          </span>
                        </div>
                      ) : (
                        <span className="text-base-content/50 text-xs">Aucune</span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className="btn btn-xs btn-primary"
                          onClick={() => onStartAddEntry(cagnotte.id)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="btn btn-xs btn-outline"
                          onClick={() => onStartEdit(cagnotte)}
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          className="btn btn-xs btn-error btn-outline"
                          onClick={() => onDelete(cagnotte.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

