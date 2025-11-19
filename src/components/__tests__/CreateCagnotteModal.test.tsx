import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CreateCagnotteModal } from '../CreateCagnotteModal';

describe('CreateCagnotteModal', () => {
  const baseProps = {
    currency: 'EUR' as const,
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };

  it('affiche le modal quand isOpen est true', () => {
    render(<CreateCagnotteModal {...baseProps} />);
    expect(screen.getByText('Créer une nouvelle cagnotte')).toBeInTheDocument();
  });

  it('n\'affiche pas le modal quand isOpen est false', () => {
    render(<CreateCagnotteModal {...baseProps} isOpen={false} />);
    expect(screen.queryByText('Créer une nouvelle cagnotte')).not.toBeInTheDocument();
  });

  it('permet de créer une cagnotte avec un nom et un montant', () => {
    const onSubmit = vi.fn();
    render(<CreateCagnotteModal {...baseProps} onSubmit={onSubmit} />);

    const nameInput = screen.getByLabelText(/nom de la cagnotte/i);
    const amountInput = screen.getByLabelText(/montant initial/i);
    const submitButton = screen.getByRole('button', { name: /créer/i });

    fireEvent.change(nameInput, { target: { value: 'Vacances' } });
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith('Vacances', 1000);
  });

  it('affiche une erreur si le nom est vide', () => {
    render(<CreateCagnotteModal {...baseProps} />);

    const amountInput = screen.getByLabelText(/montant initial/i);
    const form = screen.getByRole('button', { name: /créer/i }).closest('form');

    fireEvent.change(amountInput, { target: { value: '1000' } });
    // Utiliser fireEvent.submit pour contourner la validation HTML5
    if (form) {
      fireEvent.submit(form);
    }

    expect(screen.getByText('Le nom de la cagnotte est requis.')).toBeInTheDocument();
  });

  it('affiche une erreur si le montant est invalide', () => {
    render(<CreateCagnotteModal {...baseProps} />);

    const nameInput = screen.getByLabelText(/nom de la cagnotte/i);
    const form = screen.getByRole('button', { name: /créer/i }).closest('form');

    fireEvent.change(nameInput, { target: { value: 'Vacances' } });
    // Utiliser fireEvent.submit pour contourner la validation HTML5
    if (form) {
      fireEvent.submit(form);
    }

    expect(screen.getByText('Le montant initial doit être supérieur à 0.')).toBeInTheDocument();
  });

  it('ferme le modal quand on clique sur Annuler', () => {
    const onClose = vi.fn();
    render(<CreateCagnotteModal {...baseProps} onClose={onClose} />);

    const cancelButton = screen.getByRole('button', { name: /annuler/i });
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

