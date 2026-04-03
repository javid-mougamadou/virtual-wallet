import { useEffect, useRef, useState } from 'react';

export type PersistentStateOptions<T> = {
  key: string;
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
};

const noop = () => undefined;

type Updater<T> = T | ((prevState: T) => T);

export function usePersistentState<T>(
  options: PersistentStateOptions<T>,
): [T, (value: Updater<T>) => void, () => void] {
  const { key, defaultValue, serialize = JSON.stringify, deserialize = JSON.parse } = options;

  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) {
        return defaultValue;
      }

      return deserialize(raw) as T;
    } catch (error) {
      console.warn(`Impossible de désérialiser la clé ${key} :`, error);
      return defaultValue;
    }
  });

  const isResettingRef = useRef<boolean>(false);

  const persist = (next: T) => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(key, serialize(next));
    } catch (error) {
      console.warn(`Impossible de sérialiser la clé ${key} :`, error);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return noop;
    }

    if (isResettingRef.current) {
      isResettingRef.current = false;
      return noop;
    }

    persist(state);

    return noop;
  }, [key, serialize, state]);

  const update = (value: Updater<T>) => {
    setState((prevState) => {
      const nextState =
        typeof value === 'function'
          ? (value as (prev: T) => T)(prevState)
          : value;
      // Écriture immédiate (mobile : l’onglet peut être suspendu avant le useEffect)
      persist(nextState);
      return nextState;
    });
  };

  const reset = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }

    isResettingRef.current = true;
    setState(defaultValue);
  };

  return [state, update, reset];
}
