import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TotalSummary } from '../TotalSummary';

describe('TotalSummary', () => {
  it('affiche le total des soldes actuels', () => {
    render(<TotalSummary totalAmount={2500} currency="EUR" />);
    expect(screen.getByText('Total des soldes actuels')).toBeInTheDocument();
    expect(screen.getByText(/2\s*500/)).toBeInTheDocument();
  });

  it('affiche le montant formaté avec la devise CAD', () => {
    render(<TotalSummary totalAmount={1000} currency="CAD" />);
    // Le montant est stocké en EUR (1000), converti en CAD (1000 * 1.61 = 1610)
    // Le formatage utilise maximumFractionDigits: 0
    // Format CAD: 1 610 $ ou 1,610 $ selon la locale
    const amountText = screen.getByText(/1[,\s]?610/);
    expect(amountText).toBeInTheDocument();
  });

  it('affiche 0 quand le total est 0', () => {
    render(<TotalSummary totalAmount={0} currency="EUR" />);
    expect(screen.getByText(/0/)).toBeInTheDocument();
  });

  it('affiche les montants négatifs', () => {
    render(<TotalSummary totalAmount={-500} currency="EUR" />);
    expect(screen.getByText(/-500/)).toBeInTheDocument();
  });
});

