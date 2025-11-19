import { Entry, Cagnotte, Currency } from '../types';
import { formatAmount } from '../utils/format';
import { usePersistentState } from '../hooks/usePersistentState';

type EntriesSectionProps = {
  entries: Entry[];
  cagnottes: Cagnotte[];
  currency: Currency;
  onDelete: (id: string) => void;
};

export const EntriesSection = ({
  entries,
  cagnottes,
  currency,
  onDelete,
}: EntriesSectionProps) => {
  const [isOpen, setIsOpen] = usePersistentState<boolean>({
    key: 'virtualwallet.entriessection-collapsed-v1',
    defaultValue: false,
  });
  const getCagnotteName = (id: string): string => {
    return cagnottes.find((c) => c.id === id)?.name || 'Cagnotte inconnue';
  };

  const groupedEntries = entries.reduce(
    (acc, entry) => {
      if (!acc[entry.cagnotteId]) {
        acc[entry.cagnotteId] = [];
      }
      acc[entry.cagnotteId].push(entry);
      return acc;
    },
    {} as Record<string, Entry[]>,
  );

  const sortedCagnotteIds = Object.keys(groupedEntries).sort((a, b) => {
    const nameA = getCagnotteName(a);
    const nameB = getCagnotteName(b);
    return nameA.localeCompare(nameB);
  });

  if (entries.length === 0) {
    return (
      <section className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Historique des entrées</h2>
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
        {isOpen && <p className="text-base-content/70">Aucune entrée enregistrée.</p>}
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Historique des entrées</h2>
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
      <div className="space-y-6">
        {sortedCagnotteIds.map((cagnotteId) => {
          const cagnotteEntries = groupedEntries[cagnotteId].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          const cagnotteName = getCagnotteName(cagnotteId);
          const total = cagnotteEntries.reduce((sum, entry) => {
            return entry.type === 'recette' ? sum + entry.amount : sum - entry.amount;
          }, 0);

          return (
            <div key={cagnotteId} className="rounded-lg border border-base-300 bg-base-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{cagnotteName}</h3>
                <span className={`text-sm font-semibold ${total >= 0 ? 'text-success' : 'text-error'}`}>
                  Total: {total >= 0 ? '+' : ''}
                  {formatAmount(Math.abs(total), currency)}
                </span>
              </div>
              <div className="space-y-2">
                {cagnotteEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-base-300 bg-base-100 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`badge ${entry.type === 'recette' ? 'badge-success' : 'badge-error'}`}
                        >
                          {entry.type === 'recette' ? 'Recette' : 'Dépense'}
                        </span>
                        <span
                          className={`font-semibold ${entry.type === 'recette' ? 'text-success' : 'text-error'}`}
                        >
                          {entry.type === 'recette' ? '+' : '-'}
                          {formatAmount(entry.amount, currency)}
                        </span>
                      </div>
                      {entry.label && (
                        <p className="mt-1 text-sm text-base-content/70">{entry.label}</p>
                      )}
                      <p className="mt-1 text-xs text-base-content/50">
                        {new Date(entry.createdAt).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-error btn-sm btn-outline sm:ml-4 flex-shrink-0"
                      onClick={() => onDelete(entry.id)}
                      aria-label="Supprimer cette entrée"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      )}
    </section>
  );
};
