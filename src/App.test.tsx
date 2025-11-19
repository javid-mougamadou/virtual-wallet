import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('affiche le titre Virtual Wallet', () => {
    render(<App />);
    expect(screen.getByText(/Virtual Wallet/i)).toBeInTheDocument();
  });

  it('affiche le total des soldes actuels', () => {
    render(<App />);
    expect(screen.getByText(/Total des soldes actuels/i)).toBeInTheDocument();
  });

  it('permet de créer une cagnotte', async () => {
    render(<App />);

    // Ouvrir le modal de création
    const createButton = screen.getByRole('button', { name: /créer une cagnotte/i });
    fireEvent.click(createButton);

    // Remplir le formulaire
    const nameInput = screen.getByLabelText(/nom de la cagnotte/i);
    const amountInput = screen.getByLabelText(/montant initial/i);
    const submitButton = screen.getByRole('button', { name: /créer/i });

    fireEvent.change(nameInput, { target: { value: 'Test Cagnotte' } });
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.click(submitButton);

    // Vérifier que la cagnotte apparaît
    await waitFor(() => {
      expect(screen.getByText('Test Cagnotte')).toBeInTheDocument();
    });
  });

  it('permet d\'ajouter une dépense à une cagnotte', async () => {
    render(<App />);

    // Créer une cagnotte d'abord
    const createButton = screen.getByRole('button', { name: /créer une cagnotte/i });
    fireEvent.click(createButton);

    const nameInput = screen.getByLabelText(/nom de la cagnotte/i);
    const amountInput = screen.getByLabelText(/montant initial/i);
    const submitButton = screen.getByRole('button', { name: /créer/i });

    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    // Ajouter une dépense via le formulaire
    const amountField = screen.getByLabelText(/montant/i);
    const addButton = screen.getByRole('button', { name: /ajouter/i });

    fireEvent.change(amountField, { target: { value: '100' } });
    fireEvent.click(addButton);

    // Vérifier que le solde a changé
    await waitFor(() => {
      expect(screen.getByText(/900/)).toBeInTheDocument();
    });
  });
});
