import { createContext, useContext } from "react";

export const RescueOperationsContext = createContext(null);

export function useRescueOperations() {
  const context = useContext(RescueOperationsContext);

  if (!context) {
    throw new Error(
      "useRescueOperations deve ser usado dentro de RescueOperationsProvider.",
    );
  }

  return context;
}
