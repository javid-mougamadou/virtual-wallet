import { useEffect, useMemo, useState } from 'react';
import {
  HeaderSection,
  TotalSummary,
  CagnotteSection,
  CreateCagnotteModal,
  EntryForm,
  EntriesSection,
  AppFooter,
} from './components';
import { usePersistentState } from './hooks/usePersistentState';
import { usePageTracking, useAnalytics } from './hooks/useAnalytics';
import { Cagnotte, Entry, Currency, EntryType } from './types';
import { generateId } from './utils/id';

const App = () => {
  const [cagnottes, setCagnottes, resetCagnottes] = usePersistentState<Cagnotte[]>({
    key: 'virtualwallet.cagnottes-v1',
    defaultValue: [],
  });
  const [entries, setEntries, resetEntries] = usePersistentState<Entry[]>({
    key: 'virtualwallet.entries-v1',
    defaultValue: [],
  });
  const [currency, setCurrency] = usePersistentState<Currency>({
    key: 'virtualwallet.currency-v1',
    defaultValue: 'EUR',
  });
  const [theme, setTheme] = usePersistentState<'light' | 'dark'>({
    key: 'virtualwallet.theme-v1',
    defaultValue: 'dark',
  });
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const { trackEvent } = useAnalytics();

  // Track page view for home page
  usePageTracking('/', 'Virtual Wallet - Gestion de Cagnottes Virtuelles');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    trackEvent('theme_changed', {
      theme: newTheme,
    });
  };

  const handleCreateCagnotte = (name: string, targetAmount: number) => {
    const newCagnotte: Cagnotte = {
      id: generateId(),
      name,
      targetAmount,
      currentAmount: targetAmount, // Le montant initial est le montant de départ
      createdAt: new Date().toISOString(),
    };
    setCagnottes((prev) => [...prev, newCagnotte]);
    trackEvent('cagnotte_created', {
      cagnotte_name: name,
      target_amount: targetAmount,
      total_cagnottes: cagnottes.length + 1,
    });
  };

  const handleEditCagnotte = (updatedCagnotte: Cagnotte) => {
    setCagnottes((prev) =>
      prev.map((c) => (c.id === updatedCagnotte.id ? updatedCagnotte : c)),
    );
    trackEvent('cagnotte_edited', {
      cagnotte_id: updatedCagnotte.id,
      cagnotte_name: updatedCagnotte.name,
    });
  };

  const handleDeleteCagnotte = (id: string) => {
    const cagnotte = cagnottes.find((c) => c.id === id);
    setCagnottes((prev) => prev.filter((c) => c.id !== id));
    // Supprimer aussi toutes les entrées associées
    setEntries((prev) => prev.filter((e) => e.cagnotteId !== id));
    if (cagnotte) {
      trackEvent('cagnotte_deleted', {
        cagnotte_id: id,
        cagnotte_name: cagnotte.name,
      });
    }
  };

  const handleAddEntry = (
    cagnotteId: string,
    type: EntryType,
    amount: number,
    label?: string,
  ) => {
    const newEntry: Entry = {
      id: generateId(),
      cagnotteId,
      type,
      amount,
      label,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [...prev, newEntry]);

    // Mettre à jour le montant actuel de la cagnotte
    setCagnottes((prev) =>
      prev.map((c) => {
        if (c.id === cagnotteId) {
          const newAmount =
            type === 'recette'
              ? c.currentAmount + amount
              : c.currentAmount - amount;
          return { ...c, currentAmount: newAmount };
        }
        return c;
      }),
    );

    trackEvent('entry_added', {
      cagnotte_id: cagnotteId,
      entry_type: type,
      amount,
      has_label: !!label,
    });
  };

  const handleDeleteEntry = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;

    setEntries((prev) => prev.filter((e) => e.id !== id));

    // Mettre à jour le montant actuel de la cagnotte
    setCagnottes((prev) =>
      prev.map((c) => {
        if (c.id === entry.cagnotteId) {
          const newAmount =
            entry.type === 'recette'
              ? c.currentAmount - entry.amount
              : c.currentAmount + entry.amount;
          return { ...c, currentAmount: newAmount };
        }
        return c;
      }),
    );

    trackEvent('entry_deleted', {
      entry_id: id,
      cagnotte_id: entry.cagnotteId,
      entry_type: entry.type,
    });
  };

  const totalAmount = useMemo(() => {
    return cagnottes.reduce((sum, cagnotte) => sum + cagnotte.currentAmount, 0);
  }, [cagnottes]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 py-12">
      <section className="w-full max-w-5xl space-y-8 rounded-3xl border border-base-300 bg-base-100 p-8 shadow-2xl">
        <HeaderSection
          currency={currency}
          onCurrencyChange={setCurrency}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <TotalSummary totalAmount={totalAmount} currency={currency} />

        <CagnotteSection
          cagnottes={cagnottes}
          entries={entries}
          currency={currency}
          onEdit={handleEditCagnotte}
          onDelete={handleDeleteCagnotte}
          onCreate={() => setShowCreateModal(true)}
          onAddEntry={handleAddEntry}
        />

        <EntryForm cagnottes={cagnottes} currency={currency} onSubmit={handleAddEntry} />

        <EntriesSection
          entries={entries}
          cagnottes={cagnottes}
          currency={currency}
          onDelete={handleDeleteEntry}
        />
      </section>
      <AppFooter />
      <CreateCagnotteModal
        currency={currency}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCagnotte}
      />
    </main>
  );
};

export default App;