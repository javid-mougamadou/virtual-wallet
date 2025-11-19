import { Cagnotte, Currency, Entry, EntryType } from '../../types';
import { CagnotteCard } from './CagnotteCard';

type CagnotteCardsViewProps = {
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

export const CagnotteCardsView = ({
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
}: CagnotteCardsViewProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cagnottes.map((cagnotte) => (
        <CagnotteCard
          key={cagnotte.id}
          cagnotte={cagnotte}
          entries={entries}
          currency={currency}
          isEditing={editingId === cagnotte.id}
          isAddingEntry={addingEntryId === cagnotte.id}
          onStartEdit={() => onStartEdit(cagnotte)}
          onCancelEdit={onCancelEdit}
          onSaveEdit={(name, target) => onSaveEdit(cagnotte.id, name, target)}
          onStartAddEntry={() => onStartAddEntry(cagnotte.id)}
          onCancelAddEntry={onCancelAddEntry}
          onAddEntry={(type, amount, label) => onAddEntry(cagnotte.id, type, amount, label)}
          onDelete={() => onDelete(cagnotte.id)}
        />
      ))}
    </div>
  );
};

