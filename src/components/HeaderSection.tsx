import { Currency, CurrencyPair } from '../types';

type HeaderSectionProps = {
  currencyPair: CurrencyPair;
  onCurrencyPairChange: (pair: CurrencyPair) => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

const quotedCurrency = (pair: CurrencyPair): Exclude<Currency, 'EUR'> =>
  pair === 'EUR-CAD' ? 'CAD' : 'YEN';

export const HeaderSection = ({
  currencyPair,
  onCurrencyPairChange,
  currency,
  onCurrencyChange,
  theme,
  onToggleTheme,
}: HeaderSectionProps) => {
  const quoted = quotedCurrency(currencyPair);
  return (
  <header className="flex flex-col gap-4 text-base-content md:flex-row md:items-center md:justify-between">
    <div>
      <div className="flex items-center gap-3">
        <img
          src="/favicon-32x32.png"
          alt="Virtual Wallet Logo - Application de gestion de cagnottes virtuelles par Javid Mougamadou"
          className="w-8 h-8 md:w-10 md:h-10"
          width="32"
          height="32"
        />
        <h1 className="text-3xl font-semibold md:text-4xl">Virtual Wallet</h1>
      </div>
      <p className="mt-1 text-base-content/70">
        Gérez vos cagnottes virtuelles, suivez vos dépenses et recettes. Créé par{' '}
        <strong>Javid Mougamadou</strong>.
      </p>
      <h2 className="mt-2 italic">Application en Reactjs PWA Mobile - fonctionne hors ligne</h2>
    </div>
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
      <select
        className="select select-bordered w-full sm:w-auto"
        value={currencyPair}
        onChange={(e: { target: { value: string } }) =>
          onCurrencyPairChange(e.target.value as CurrencyPair)
        }
        aria-label="Sélectionner le couple de devises"
      >
        <option value="EUR-CAD">EUR – CAD</option>
        <option value="EUR-YEN">EUR – YEN</option>
      </select>
      <select
        className="select select-bordered w-full sm:w-auto"
        value={currency}
        onChange={(e: { target: { value: string } }) => onCurrencyChange(e.target.value as Currency)}
        aria-label="Sélectionner la devise"
      >
        <option value="EUR">EUR</option>
        <option value={quoted}>{quoted}</option>
      </select>
      <button type="button" className="btn w-full sm:w-auto" onClick={onToggleTheme}>
        {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
      </button>
    </div>
  </header>
  );
};