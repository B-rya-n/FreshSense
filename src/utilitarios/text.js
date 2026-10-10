export function normalizeSearchTerm(value, locale = "pt-BR") {
  return String(value ?? "")
    .toLocaleLowerCase(locale)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function normalizePath(path) {
  return String(path ?? "").replace(/\/+$/, "") || "/";
}

export function resolveLanguage(language, translations, fallback = "pt") {
  return Object.hasOwn(translations, language) ? language : fallback;
}
