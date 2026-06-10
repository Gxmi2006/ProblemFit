import { useCallback, useEffect, useState } from "react";

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const update = useCallback((next: T | ((current: T) => T)) => {
    setValue((current) => (typeof next === "function" ? (next as (current: T) => T)(current) : next));
  }, []);

  return [value, update] as const;
}
