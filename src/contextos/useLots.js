import { createContext, useContext } from "react";

export const LotesContext = createContext(null);

export function useLots() {
  const context = useContext(LotesContext);
  if (!context)
    throw new Error("useLots deve ser utilizado dentro de LotesProvider.");
  return context;
}
