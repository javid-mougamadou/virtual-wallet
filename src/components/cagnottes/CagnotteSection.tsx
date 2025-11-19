import { useState } from 'react';
import { Cagnotte, Currency, EntryType, Entry } from '../../types';
import { usePersistentState } from '../../hooks/usePersistentState';
import { CagnotteSectionHeader } from './CagnotteSectionHeader';
import { CagnotteCardsView } from './CagnotteCardsView';
import { CagnotteListView } from './CagnotteListView';

type CagnotteSectionProps = {
  cagnottes: Cagnotte[];
  entries: Entry[];
  currency: Currency;
  onEdit: (cagnotte: Cagnotte) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onAddEntry: (cagnotteId: string, type: EntryType, amount: number, label?: string) => void;
};

export const CagnotteSection = ({
  cagnottes,
  entries,
  currency,
  onEdit,
  onDelete,
  onCreate,
  onAddEntry,
}: CagnotteSectionProps) => {
  const [viewMode, setViewMode] = usePersistentState<'cards' | 'list'>({
    key: 'virtualwallet.cagnottes-view-mode-v1',
    defaultValue: 'cards',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTarget, setEditTarget] = useState('');
  const [addingEntryId, setAddingEntryId] = useState<string | null>(null);

  const handleStartEdit = (cagnotte: Cagnotte) => {
    setEditingId(cagnotte.id);
    setEditName(cagnotte.name);
    setEditTarget(cagnotte.targetAmount.toString());
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditTarget('');
  };

  const handleSaveEdit = (id: string, name: string, targetAmount: number) => {
    const cagnotte = cagnottes.find((c) => c.id === id);
    if (cagnotte) {
      onEdit({
        ...cagnotte,
        name,
        targetAmount,
      });
    }
    handleCancelEdit();
  };

  const handleStartAddEntry = (cagnotteId: string) => {
    setAddingEntryId(cagnotteId);
  };

  const handleCancelAddEntry = () => {
    setAddingEntryId(null);
  };

  const handleAddEntry = (cagnotteId: string, type: EntryType, amount: number, label?: string) => {
    onAddEntry(cagnotteId, type, amount, label);
    handleCancelAddEntry();
  };

  return (
    <section className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-lg">
      <CagnotteSectionHeader viewMode={viewMode} onViewModeChange={setViewMode} onCreate={onCreate} />

      {cagnottes.length === 0 ? (
        <p className="text-base-content/70">Aucune cagnotte créée. Créez-en une pour commencer.</p>
      ) : viewMode === 'list' ? (
        <CagnotteListView
          cagnottes={cagnottes}
          entries={entries}
          currency={currency}
          editingId={editingId}
          addingEntryId={addingEntryId}
          onStartEdit={handleStartEdit}
          onCancelEdit={handleCancelEdit}
          onSaveEdit={handleSaveEdit}
          onStartAddEntry={handleStartAddEntry}
          onCancelAddEntry={handleCancelAddEntry}
          onAddEntry={handleAddEntry}
          onDelete={onDelete}
        />
      ) : (
        <CagnotteCardsView
          cagnottes={cagnottes}
          entries={entries}
          currency={currency}
          editingId={editingId}
          addingEntryId={addingEntryId}
          onStartEdit={handleStartEdit}
          onCancelEdit={handleCancelEdit}
          onSaveEdit={handleSaveEdit}
          onStartAddEntry={handleStartAddEntry}
          onCancelAddEntry={handleCancelAddEntry}
          onAddEntry={handleAddEntry}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};

