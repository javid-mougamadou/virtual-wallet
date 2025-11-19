# Virtual Wallet — Explanation

This document summarizes the internal workings of the application, including the business logic, custom hooks, and utilities.

## General Architecture

The main application (`src/App.tsx`) orchestrates the interface by relying on section components (`src/components/` folder) that each encapsulate part of the flow:

- `HeaderSection`: title, currency selector, light/dark theme toggle.
- `TotalSummary`: displays the total of all current wallet balances.
- `CagnotteSection`: displays and manages virtual wallets (cagnottes) in card or list view.
- `EntryForm`: form for adding expenses (dépenses) or income (recettes) entries.
- `EntriesSection`: displays the history of all entries grouped by wallet.
- `CreateCagnotteModal`: modal for creating new virtual wallets.
- `AppFooter`: attribution to DaisyUI and author.

Shared types are in `src/types.ts`, while business utilities (`format`, `cagnottes`) are grouped in `src/utils/`.

## Hooks

### usePersistentState (`src/hooks/usePersistentState.ts`)
Generic hook to store state in `localStorage` in addition to React state:

- Parameters: `key`, `defaultValue`, optional serialization/deserialization.
- Returns `[state, setState, reset]` with support for functional setters (like `useState`).
- Automatic save on each change (except reset) and restoration on initialization.
- Used for:
  - Cagnottes (virtual wallets)
  - Entries (expenses and income)
  - Currency selection
  - Theme (light/dark)
  - Collapsible sections state

### useAnalytics (`src/hooks/useAnalytics.ts`)
Hook for Google Analytics tracking:

- `usePageTracking`: tracks page views
- `useAnalytics`: provides `trackEvent` function for custom events
- Only active in production builds

## Business Logic

### Cagnotte Management (`src/utils/cagnottes.ts`)
Utility functions for managing virtual wallets:

- `calculateCagnotteBalance`: calculates current balance based on entries
- Helper functions for wallet operations

### Formatting (`src/utils/format.ts`)
- `formatAmount`: formats currency amounts with proper locale formatting (EUR, CAD, USD)

## Data Flow

1. **Cagnotte Creation**: User creates a wallet with a name and initial amount (targetAmount)
2. **Entry Addition**: User adds expenses or income entries to wallets
3. **Balance Calculation**: Current balance is automatically updated when entries are added/removed
4. **Total Calculation**: Sum of all current balances across all wallets

## State Management

All state is persisted in `localStorage` using `usePersistentState`:
- Cagnottes and entries survive page refreshes
- Theme preference is saved
- Currency selection is saved
- Collapsible sections state is saved
