import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  readStoredValue,
  storageKeys,
  writeStoredValue,
} from "../utilitarios/browserStorage";
import { I18nContext, useI18n } from "./useI18n";
import { commonTranslations } from "./dicionarios/comum/index";
import { editorialTranslations } from "./dicionarios/editorial/index";
import { monitoringTranslations } from "./dicionarios/monitoramento/index";
import { operationalTranslations } from "./dicionarios/operacional/index";
import { passportTranslations } from "./dicionarios/passaporte/index";
import { riskTranslations } from "./dicionarios/risco/index";

const supportedLanguages = ["pt", "en", "es"];
const normalize = (text) => String(text).replace(/\s+/g, " ").trim();

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = readStoredValue(storageKeys.language);
    return supportedLanguages.includes(saved) ? saved : "pt";
  });

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : language;
    writeStoredValue(storageKeys.language, language);
  }, [language]);

  const setLanguage = useCallback((next) => {
    if (supportedLanguages.includes(next)) setLanguageState(next);
  }, []);

  const t = useCallback(
    (text) => {
      if (typeof text !== "string" || language === "pt") return text;
      const key = normalize(text);
      const translated =
        operationalTranslations[language]?.[key] ??
        passportTranslations[language]?.[key] ??
        editorialTranslations[language]?.[key] ??
        riskTranslations[language]?.[key] ??
        monitoringTranslations[language]?.[key] ??
        commonTranslations[language]?.[key];
      if (!translated) return text;
      const leading = text.match(/^\s*/)?.[0] ?? "";
      const trailing = text.match(/\s*$/)?.[0] ?? "";
      return `${leading}${translated}${trailing}`;
    },
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

const translatedAttributes = ["aria-label", "placeholder", "title"];

function translateNode(node, t) {
  if (typeof node === "string") return t(node);
  if (
    !isValidElement(node) ||
    (typeof node.type !== "string" && node.type !== Fragment)
  )
    return node;
  const translatedProps = {};
  translatedAttributes.forEach((attribute) => {
    if (typeof node.props[attribute] === "string")
      translatedProps[attribute] = t(node.props[attribute]);
  });
  if (node.props.children == null) return cloneElement(node, translatedProps);
  const children = Children.map(node.props.children, (child) =>
    translateNode(child, t),
  );
  return cloneElement(node, translatedProps, children);
}

export function Translated({ children }) {
  const { t } = useI18n();
  return <>{Children.map(children, (child) => translateNode(child, t))}</>;
}
