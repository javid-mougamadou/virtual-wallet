import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EntryForm } from '../EntryForm';
import { Cagnotte } from '../../types';

describe('EntryForm', () => {
  const mockCagnottes: Cagnotte[] = [
    {
      id: '1',
      name: 'Transport',
      targetAmount: 2000,
      currentAmount: 2000,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Nourriture',
      targetAmount: 500,
      currentAmount: 500,
      createdAt: new Date().toISOString(),
    },
  ];

  const baseProps = {
    cagnottes: mockCagnottes,
    currency: 'EUR' as const,
    onSubmit: vi.fn(),
  };

  it('affiche le formulaire d\'ajout d\'entrée', () => {
    render(<EntryForm {...baseProps} />);
    expect(screen.getByText('Ajouter une entrée')).toBeInTheDocument();
  });

  it('pré-sélectionne la première cagnotte', async () => {
    render(<EntryForm {...baseProps} />);
    
    await waitFor(() => {
      const select = screen.getByLabelText(/cagnotte/i) as HTMLSelectElement;
      expect(select.value).toBe('1');
    });
  });

  it('permet d\'ajouter une dépense', async () => {
    const onSubmit = vi.fn();
    render(<EntryForm {...baseProps} onSubmit={onSubmit} />);

    const amountInput = screen.getByLabelText(/montant/i);
    const submitButton = screen.getByRole('button', { name: /ajouter/i });

    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('1', 'depense', 100, undefined);
    });
  });

  it('permet d\'ajouter une recette avec un label', async () => {
    const onSubmit = vi.fn();
    render(<EntryForm {...baseProps} onSubmit={onSubmit} />);

    const typeSelect = screen.getByLabelText(/type/i);
    const amountInput = screen.getByLabelText(/montant/i);
    const labelInput = screen.getByLabelText(/label/i);
    const submitButton = screen.getByRole('button', { name: /ajouter/i });

    fireEvent.change(typeSelect, { target: { value: 'recette' } });
    fireEvent.change(amountInput, { target: { value: '200' } });
    fireEvent.change(labelInput, { target: { value: 'Remboursement' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('1', 'recette', 200, 'Remboursement');
    });
  });

  it('affiche une erreur si aucune cagnotte n\'est sélectionnée', async () => {
    render(<EntryForm {...baseProps} cagnottes={[]} />);

    const submitButton = screen.getByRole('button', { name: /ajouter/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Sélectionnez une cagnotte.')).toBeInTheDocument();
    });
  });

  it('affiche une erreur si le montant est invalide', async () => {
    render(<EntryForm {...baseProps} />);

    const amountInput = screen.getByLabelText(/montant/i);
    const submitButton = screen.getByRole('button', { name: /ajouter/i });

    fireEvent.change(amountInput, { target: { value: '-10' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Montant invalide.')).toBeInTheDocument();
    });
  });
});

