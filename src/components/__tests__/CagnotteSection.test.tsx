import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CagnotteSection } from '../cagnottes';
import { Cagnotte, Entry } from '../../types';

describe('CagnotteSection', () => {
  const mockCagnottes: Cagnotte[] = [
    {
      id: '1',
      name: 'Transport',
      targetAmount: 2000,
      currentAmount: 2000,
      createdAt: new Date().toISOString(),
    },
  ];

  const mockEntries: Entry[] = [];

  const baseProps = {
    cagnottes: mockCagnottes,
    entries: mockEntries,
    currency: 'EUR' as const,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onCreate: vi.fn(),
    onAddEntry: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('affiche la section des cagnottes', () => {
    render(<CagnotteSection {...baseProps} />);
    expect(screen.getByText('Mes cagnottes')).toBeInTheDocument();
  });

  it('affiche un message quand il n\'y a pas de cagnotte', () => {
    render(<CagnotteSection {...baseProps} cagnottes={[]} />);
    expect(screen.getByText(/Aucune cagnotte créée/)).toBeInTheDocument();
  });

  it('affiche les cagnottes en vue cartes par défaut', () => {
    render(<CagnotteSection {...baseProps} />);
    expect(screen.getByText('Transport')).toBeInTheDocument();
  });

  it('permet de basculer entre vue cartes et vue liste', async () => {
    render(<CagnotteSection {...baseProps} />);

    const listViewButton = screen.getByRole('button', { name: /vue liste/i });
    fireEvent.click(listViewButton);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  it('appelle onCreate quand on clique sur créer une cagnotte', () => {
    const onCreate = vi.fn();
    render(<CagnotteSection {...baseProps} onCreate={onCreate} />);

    const createButton = screen.getByRole('button', { name: /créer une cagnotte/i });
    fireEvent.click(createButton);

    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('affiche les boutons d\'action pour chaque cagnotte', () => {
    render(<CagnotteSection {...baseProps} />);
    expect(screen.getByRole('button', { name: /modifier/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /supprimer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ajouter une entrée/i })).toBeInTheDocument();
  });
});

