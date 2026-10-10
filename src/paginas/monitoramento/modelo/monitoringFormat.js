export const localeByLanguage = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

export function formatValue(value, locale = "pt-BR", digits = 1) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatMetric(value, unit, locale) {
  const formatted = formatValue(value, locale);
  return unit ? `${formatted} ${unit}` : formatted;
}

export function statusLabel(status) {
  const labels = {
    operacional: "Operacional",
    atencao: "Atenção",
    online: "Online",
    offline: "Sem comunicação",
    "em-rota": "Em rota",
    aberto: "Aberto",
    "em-tratamento": "Em tratamento",
    reconhecido: "Reconhecido",
    resolvido: "Resolvido",
  };

  return labels[status] ?? status;
}
