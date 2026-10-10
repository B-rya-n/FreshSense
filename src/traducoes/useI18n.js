import { createContext, useContext } from "react";

export const I18nContext = createContext(null);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context)
    throw new Error("useI18n deve ser usado dentro de I18nProvider.");
  return context;
}
