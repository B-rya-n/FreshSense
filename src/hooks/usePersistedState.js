import { useEffect, useState } from "react";
import {
  readStoredJson,
  writeStoredValue,
} from "../utilitarios/browserStorage";

export function usePersistedState(
  storageKey,
  initialValue,
  isValid = (value) => value !== null,
  migrate = (value) => value,
) {
  const [value, setValue] = useState(() => {
    const fallback =
      typeof initialValue === "function" ? initialValue() : initialValue;
    const storedValue = readStoredJson(storageKey, null);
    try {
      return isValid(storedValue) ? migrate(storedValue) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    writeStoredValue(storageKey, JSON.stringify(value));
  }, [storageKey, value]);

  return [value, setValue];
}
