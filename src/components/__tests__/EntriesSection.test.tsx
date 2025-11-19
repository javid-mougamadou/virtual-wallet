import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { EntriesSection } from '../EntriesSection';
import { Entry, Cagnotte } from '../../types';

describe('EntriesSection', () => {
  const mockCagnottes: Cagnotte[] = [
    {
      id: '1',
      name: 'Transport',
      targetAmount: 2000,
      currentAmount: 1900,
      createdAt: new Date().toISOString(),
    },
  ];

  const mockEntries: Entry[] = [
    {
      id: 'e1',
      cagnotteId: '1',
      type: 'depense',
      amount: 100,
      label: 'Taxi Montreal',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'e2',
      cagnotteId: '1',
      type: 'recette',
      amount: 200,
      label: 'Remb Taxi',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const baseProps = {
    entries: mockEntries,
    cagnottes: mockCagnottes,
    currency: 'EUR' as const,
    onDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('affiche la section historique des entrées', () => {
    render(<EntriesSection {...baseProps} />);
    expect(screen.getByText('Historique des entrées')).toBeInTheDocument();
  });

  it('affiche un message quand il n\'y a pas d\'entrées', () => {
    render(<EntriesSection {...baseProps} entries={[]} />);
    // Ouvrir la section d'abord pour voir le message
    const toggleButton = screen.getByRole('button', { name: /développer/i });
    fireEvent.click(toggleButton);
    expect(screen.getByText(/Aucune entrée enregistrée/i)).toBeInTheDocument();
  });

  it('affiche les entrées groupées par cagnotte après ouverture', async () => {
    render(<EntriesSection {...baseProps} />);
    
    // Ouvrir la section d'abord
    const toggleButton = screen.getByRole('button', { name: /développer/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Transport')).toBeInTheDocument();
    });
  });

  it('affiche les dépenses et recettes', async () => {
    render(<EntriesSection {...baseProps} />);
    
    // Ouvrir la section d'abord
    const toggleButton = screen.getByRole('button', { name: /développer/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Dépense')).toBeInTheDocument();
      expect(screen.getByText('Recette')).toBeInTheDocument();
    });
  });

  it('affiche les labels des entrées', async () => {
    render(<EntriesSection {...baseProps} />);
    
    // Ouvrir la section d'abord
    const toggleButton = screen.getByRole('button', { name: /développer/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Taxi Montreal')).toBeInTheDocument();
      expect(screen.getByText('Remb Taxi')).toBeInTheDocument();
    });
  });

  it('affiche le total par cagnotte', async () => {
    render(<EntriesSection {...baseProps} />);
    
    // Ouvrir la section d'abord
    const toggleButton = screen.getByRole('button', { name: /développer/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      // Total = 200 (recette) - 100 (dépense) = 100
      expect(screen.getByText(/Total:/)).toBeInTheDocument();
    });
  });

  it('permet de supprimer une entrée', async () => {
    const onDelete = vi.fn();
    render(<EntriesSection {...baseProps} onDelete={onDelete} />);

    // Ouvrir la section d'abord
    const toggleButton = screen.getByRole('button', { name: /développer/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i });
      fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith('e1');
    });
  });

  it('peut être réduite/développée', async () => {
    render(<EntriesSection {...baseProps} />);
    
    // Ouvrir d'abord
    const toggleButton = screen.getByRole('button', { name: /développer/i });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Transport')).toBeInTheDocument();
    });

    // Puis fermer
    const closeButton = screen.getByRole('button', { name: /réduire/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Transport')).not.toBeInTheDocument();
    });
  });
});

