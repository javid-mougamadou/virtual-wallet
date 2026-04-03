import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TotalSummary } from '../TotalSummary';

describe('TotalSummary', () => {
  it('affiche le total des soldes actuels', () => {
    render(<TotalSummary totalAmount={2500} currency="EUR" currencyPair="EUR-CAD" />);
    expect(screen.getByText('Total des soldes actuels')).toBeInTheDocument();
    expect(screen.getByText(/pour 100 eur/i)).toBeInTheDocument();
    expect(screen.getByText(/équivalent du total/i)).toBeInTheDocument();
    expect(screen.getByText(/2\s*500/)).toBeInTheDocument();
  });

  it('affiche le montant formaté avec la devise CAD', () => {
    render(<TotalSummary totalAmount={1000} currency="CAD" currencyPair="EUR-CAD" />);
    // Le montant est stocké en EUR (1000), converti en CAD (1000 * 1.61 = 1610)
    // Le formatage utilise maximumFractionDigits: 0
    // Format CAD: 1 610 $ ou 1,610 $ selon la locale
    const amountText = screen.getByText(/1[,\s]?610/);
    expect(amountText).toBeInTheDocument();
  });

  it('affiche le montant formaté avec la devise YEN', () => {
    render(<TotalSummary totalAmount={1000} currency="YEN" currencyPair="EUR-YEN" />);
    // 1000 EUR × (18 394,70 / 100) ≈ 183 947 ¥ (taux fixe dans format.ts)
    expect(screen.getByText(/183[,\s]?947/)).toBeInTheDocument();
  });

  it('affiche 0 quand le total est 0', () => {
    render(<TotalSummary totalAmount={0} currency="EUR" currencyPair="EUR-CAD" />);
    const panel = screen.getByRole('heading', { name: /total des soldes actuels/i }).closest('section')!;
    const primary = panel.querySelector('.text-4xl');
    expect(primary).toBeTruthy();
    expect(primary).toHaveTextContent(/0/);
  });

  it('affiche les montants négatifs', () => {
    render(<TotalSummary totalAmount={-500} currency="EUR" currencyPair="EUR-CAD" />);
    expect(screen.getByText(/-500/)).toBeInTheDocument();
  });
});

