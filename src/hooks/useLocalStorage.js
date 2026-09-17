import { useState, useCallback } from "react";

/**
 * Drop-in replacement for useState that mirrors state to localStorage.
 *
 * @param {string} key         - localStorage key
 * @param {*}      initialValue - value used when nothing is stored yet
 * @returns {[value, setValue, clearValue]}
 *   - value:      current state (hydrated from localStorage on first render)
 *   - setValue:   updater — accepts a value or an updater function, just like useState
 *   - clearValue: removes the key from localStorage and resets to initialValue
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Quota exceeded or private-browsing restriction — state still updates
        }
        return next;
      });
    },
    [key],
  );

  const clearValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, clearValue];
}
