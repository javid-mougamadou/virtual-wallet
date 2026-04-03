import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HeaderSection } from '../HeaderSection';

describe('HeaderSection', () => {
  const baseProps = {
    currencyPair: 'EUR-CAD' as const,
    onCurrencyPairChange: vi.fn(),
    currency: 'EUR' as const,
    onCurrencyChange: vi.fn(),
    theme: 'dark' as const,
    onToggleTheme: vi.fn(),
  };

  it('affiche le titre Virtual Wallet', () => {
    render(<HeaderSection {...baseProps} />);
    expect(screen.getByText('Virtual Wallet')).toBeInTheDocument();
  });

  it('affiche le logo', () => {
    render(<HeaderSection {...baseProps} />);
    const logo = screen.getByAltText(/Virtual Wallet Logo/i);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/favicon-32x32.png');
  });

  it('affiche le bouton de thème et déclenche le toggle', () => {
    const onToggleTheme = vi.fn();

    render(<HeaderSection {...baseProps} onToggleTheme={onToggleTheme} />);

    const button = screen.getByRole('button', { name: 'Mode clair' });
    fireEvent.click(button);

    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('permet de changer la devise', () => {
    const onCurrencyChange = vi.fn();
    render(<HeaderSection {...baseProps} onCurrencyChange={onCurrencyChange} />);

    const select = screen.getByLabelText(/sélectionner la devise/i);
    fireEvent.change(select, { target: { value: 'CAD' } });

    expect(onCurrencyChange).toHaveBeenCalledWith('CAD');
  });

  it('affiche le sélecteur de couple et la devise cotée CAD pour EUR–CAD', () => {
    render(<HeaderSection {...baseProps} />);

    const pairSelect = screen.getByLabelText(/sélectionner le couple de devises/i);
    expect(pairSelect).toHaveValue('EUR-CAD');

    const currencySelect = screen.getByLabelText(/sélectionner la devise/i);
    expect(currencySelect).toHaveDisplayValue('EUR');
    expect(screen.getByRole('option', { name: 'CAD' })).toBeInTheDocument();
  });

  it('propose YEN comme devise cotée pour EUR–YEN', () => {
    render(<HeaderSection {...baseProps} currencyPair="EUR-YEN" />);

    expect(screen.getByRole('option', { name: 'YEN' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'CAD' })).not.toBeInTheDocument();
  });

  it('appelle onCurrencyPairChange lors du changement de couple', () => {
    const onCurrencyPairChange = vi.fn();
    render(<HeaderSection {...baseProps} onCurrencyPairChange={onCurrencyPairChange} />);

    const pairSelect = screen.getByLabelText(/sélectionner le couple de devises/i);
    fireEvent.change(pairSelect, { target: { value: 'EUR-YEN' } });

    expect(onCurrencyPairChange).toHaveBeenCalledWith('EUR-YEN');
  });
});
