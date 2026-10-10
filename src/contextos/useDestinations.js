import { createContext, useContext } from "react";

export const DestinationsContext = createContext(null);

export function useDestinations() {
  const context = useContext(DestinationsContext);

  if (!context) {
    throw new Error(
      "useDestinations deve ser usado dentro de DestinationsProvider.",
    );
  }

  return context;
}
