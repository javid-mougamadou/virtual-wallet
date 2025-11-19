import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TotalSummary } from '../TotalSummary';

describe('TotalSummary', () => {
  it('affiche le total des soldes actuels', () => {
    render(<TotalSummary totalAmount={2500} currency="EUR" />);
    expect(screen.getByText('Total des soldes actuels')).toBeInTheDocument();
    expect(screen.getByText(/2\s*500/)).toBeInTheDocument();
  });

  it('affiche le montant formaté avec la devise', () => {
    render(<TotalSummary totalAmount={1500.5} currency="USD" />);
    // Le formatage utilise maximumFractionDigits: 0, donc 1500.5 devient 1501
    // Format USD: $1,501
    const amountText = screen.getByText(/\$1[,\s]?50[01]/);
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

