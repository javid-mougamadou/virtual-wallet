type CagnotteSectionHeaderProps = {
  viewMode: 'cards' | 'list';
  onViewModeChange: (mode: 'cards' | 'list') => void;
  onCreate: () => void;
};

export const CagnotteSectionHeader = ({
  viewMode,
  onViewModeChange,
  onCreate,
}: CagnotteSectionHeaderProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h2 className="text-xl font-semibold flex-1 min-w-0">Mes cagnottes</h2>
        <button
          type="button"
          className="btn btn-primary btn-circle w-12 h-12 p-0 sm:w-auto sm:h-auto sm:rounded-lg sm:px-4 sm:btn-sm flex-shrink-0"
          onClick={onCreate}
          aria-label="Créer une cagnotte"
        >
          <span className="hidden sm:inline">Créer une cagnotte</span>
          <span className="sm:hidden text-2xl font-bold leading-none">+</span>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => onViewModeChange('list')}
          aria-label="Vue Liste"
        >
          Vue Liste
        </button>
        <button
          type="button"
          className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => onViewModeChange('cards')}
          aria-label="Vue Cartes"
        >
          Vue Cartes
        </button>
      </div>
    </div>
  );
};

