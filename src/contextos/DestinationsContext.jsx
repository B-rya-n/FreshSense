import { useMemo } from "react";
import { usePersistedState } from "../hooks/usePersistedState";
import { initialDestinations } from "../paginas/destinacao/modelo/destinationModel";
import { storageKeys } from "../utilitarios/browserStorage";
import { DestinationsContext } from "./useDestinations";
import {
  isPersistedDestination,
  isPersistedDestinationList,
  migratePersistedDestinations,
  normalizePersistedDestination,
} from "./persistenceMigrations";

export function DestinationsProvider({ children }) {
  const [destinations, setDestinations] = usePersistedState(
    storageKeys.destinations,
    initialDestinations,
    isPersistedDestinationList,
    migratePersistedDestinations,
  );

  const value = useMemo(
    () => ({
      destinations,
      addDestination(destination) {
        if (!isPersistedDestination(destination)) return;

        const normalizedDestination =
          normalizePersistedDestination(destination);
        setDestinations((current) =>
          current.some((item) => item.id === normalizedDestination.id)
            ? current
            : [normalizedDestination, ...current],
        );
      },
      updateDestination(destination) {
        if (!isPersistedDestination(destination)) return;

        const normalizedDestination =
          normalizePersistedDestination(destination);
        setDestinations((current) =>
          current.map((item) =>
            item.id === normalizedDestination.id ? normalizedDestination : item,
          ),
        );
      },
    }),
    [destinations, setDestinations],
  );

  return (
    <DestinationsContext.Provider value={value}>
      {children}
    </DestinationsContext.Provider>
  );
}
