export const storageKeys = Object.freeze({
  destinations: "freshsense-destinations",
  favorites: "freshsense-favorites",
  language: "freshsense-language",
  lots: "freshsense-lots",
  monitoringRefreshRate: "freshsense-monitoring-refresh-rate",
  rescueDecisions: "freshsense-rescue-decisions",
  theme: "freshsense-theme",
});

export function readStoredValue(key, fallback = null) {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStoredValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // A aplicação continua funcional quando o navegador bloqueia armazenamento local.
  }
}

export function readStoredJson(key, fallback) {
  try {
    const value = JSON.parse(readStoredValue(key, "null"));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}
