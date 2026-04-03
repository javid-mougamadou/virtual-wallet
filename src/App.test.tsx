import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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
    const submitButton = screen.getByRole('button', { name: /^Créer$/ });

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
    const submitButton = screen.getByRole('button', { name: /^Créer$/ });

    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    const entrySection = screen.getByRole('heading', { name: /ajouter une entrée/i }).closest('section')!;
    const entryToggle = within(entrySection).getByRole('button');
    if (entryToggle.getAttribute('aria-label') === 'Développer') {
      fireEvent.click(entryToggle);
    }

    await waitFor(() => {
      expect(screen.getByLabelText(/montant \(eur\)/i)).toBeInTheDocument();
    });

    const amountField = screen.getByLabelText(/montant \(eur\)/i);
    const addButton = screen.getByRole('button', { name: /^Ajouter$/ });

    fireEvent.change(amountField, { target: { value: '100' } });
    fireEvent.click(addButton);

    const totalPanel = screen.getByRole('heading', { name: /total des soldes actuels/i }).closest('section')!;
    await waitFor(() => {
      const primary = totalPanel.querySelector('.text-4xl');
      expect(primary).toBeTruthy();
      expect(primary).toHaveTextContent(/900/);
    });
  });
});
