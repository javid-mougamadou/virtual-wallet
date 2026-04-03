import { Currency, CurrencyPair } from '../types';
import { formatAmount } from '../utils/format';

type TotalSummaryProps = {
  totalAmount: number;
  currency: Currency;
  currencyPair: CurrencyPair;
};

const quotedFromPair = (pair: CurrencyPair): Exclude<Currency, 'EUR'> =>
  pair === 'EUR-CAD' ? 'CAD' : 'YEN';

export const TotalSummary = ({ totalAmount, currency, currencyPair }: TotalSummaryProps) => {
  const quoted = quotedFromPair(currencyPair);
  const otherCurrency: Currency = currency === 'EUR' ? quoted : 'EUR';
  const otherLabel = currency === 'EUR' ? quoted : 'EUR';

  return (
    <section className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-lg">
      <h2 className="mb-3 text-xl font-semibold">Total des soldes actuels</h2>

      <div className="space-y-2">
        <p className="text-base text-base-content/80" role="status">
          <span className="font-medium text-base-content">Pour 100 EUR</span>
          <span className="text-base-content/70"> (arrondi, {quoted})</span>
          {' : '}
          <span className="font-semibold tabular-nums text-base-content">
            {formatAmount(100, quoted)}
          </span>
          <span className="mx-2 text-base-content/50">·</span>
          <span className="font-medium text-base-content">équivalent du total</span>
          <span className="text-base-content/70"> ({otherLabel})</span>
          {' : '}
          <span className="font-semibold tabular-nums text-base-content">
            {formatAmount(totalAmount, otherCurrency)}
          </span>
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-primary">
            {formatAmount(totalAmount, currency)}
          </span>
        </div>
      </div>
    </section>
  );
};
