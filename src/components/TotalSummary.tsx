import { Currency } from '../types';
import { formatAmount } from '../utils/format';

type TotalSummaryProps = {
  totalAmount: number;
  currency: Currency;
};

export const TotalSummary = ({ totalAmount, currency }: TotalSummaryProps) => (
  <section className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-lg">
    <h2 className="mb-4 text-xl font-semibold">Total des soldes actuels</h2>
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-bold text-primary">{formatAmount(totalAmount, currency)}</span>
    </div>
  </section>
);
