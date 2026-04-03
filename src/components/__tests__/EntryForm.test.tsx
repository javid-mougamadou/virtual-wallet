import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EntryForm } from '../EntryForm';
import { Cagnotte } from '../../types';

describe('EntryForm', () => {
  beforeEach(() => {
    localStorage.clear();
  });
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

  const expandEntryForm = () => {
    const section = screen.getByRole('heading', { name: /ajouter une entrée/i }).closest('section')!;
    const toggle = within(section).getByRole('button');
    if (toggle.getAttribute('aria-label') === 'Développer') {
      fireEvent.click(toggle);
    }
  };

  it('affiche le formulaire d\'ajout d\'entrée', () => {
    render(<EntryForm {...baseProps} />);
    expect(screen.getByText('Ajouter une entrée')).toBeInTheDocument();
  });

  it('pré-sélectionne la première cagnotte', async () => {
    render(<EntryForm {...baseProps} />);
    expandEntryForm();

    await waitFor(() => {
      const select = screen.getByLabelText(/cagnotte/i) as HTMLSelectElement;
      expect(select.value).toBe('1');
    });
  });

  it('permet d\'ajouter une dépense', async () => {
    const onSubmit = vi.fn();
    render(<EntryForm {...baseProps} onSubmit={onSubmit} />);
    expandEntryForm();

    const amountInput = screen.getByLabelText(/montant/i);
    const submitButton = screen.getByRole('button', { name: /^Ajouter$/ });

    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('1', 'depense', 100, undefined);
    });
  });

  it('permet d\'ajouter une recette avec un label', async () => {
    const onSubmit = vi.fn();
    render(<EntryForm {...baseProps} onSubmit={onSubmit} />);
    expandEntryForm();

    const typeSelect = screen.getByLabelText(/type/i);
    const amountInput = screen.getByLabelText(/montant/i);
    const labelInput = screen.getByLabelText(/label/i);
    const submitButton = screen.getByRole('button', { name: /^Ajouter$/ });

    fireEvent.change(typeSelect, { target: { value: 'recette' } });
    fireEvent.change(amountInput, { target: { value: '200' } });
    fireEvent.change(labelInput, { target: { value: 'Remboursement' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('1', 'recette', 200, 'Remboursement');
    });
  });

  it('affiche une erreur si aucune cagnotte n\'est sélectionnée', async () => {
    render(<EntryForm {...baseProps} />);
    expandEntryForm();

    fireEvent.change(screen.getByLabelText(/cagnotte/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/montant/i), { target: { value: '10' } });
    const submitButton = screen.getByRole('button', { name: /^Ajouter$/ });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Sélectionnez une cagnotte.')).toBeInTheDocument();
    });
  });

  it('affiche une erreur si le montant est invalide', async () => {
    render(<EntryForm {...baseProps} />);
    expandEntryForm();

    const amountInput = screen.getByLabelText(/montant/i);
    const submitButton = screen.getByRole('button', { name: /^Ajouter$/ });

    fireEvent.change(amountInput, { target: { value: '0' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Montant invalide.')).toBeInTheDocument();
    });
  });
});

