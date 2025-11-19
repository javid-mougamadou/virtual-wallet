import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HeaderSection } from '../HeaderSection';

describe('HeaderSection', () => {
  const baseProps = {
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
    const logo = screen.getByAltText('Virtual Wallet Logo');
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
    fireEvent.change(select, { target: { value: 'USD' } });

    expect(onCurrencyChange).toHaveBeenCalledWith('USD');
  });
});
