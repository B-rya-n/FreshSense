import { useMemo } from "react";
import { usePersistedState } from "../hooks/usePersistedState";
import { storageKeys } from "../utilitarios/browserStorage";
import { RescueOperationsContext } from "./useRescueOperations";
import {
  isPersistedRescueDecision,
  isPersistedRescueDecisionList,
  migratePersistedRescueDecisions,
  normalizePersistedRescueDecision,
} from "./persistenceMigrations";

export function RescueOperationsProvider({ children }) {
  const [decisions, setDecisions] = usePersistedState(
    storageKeys.rescueDecisions,
    [],
    isPersistedRescueDecisionList,
    migratePersistedRescueDecisions,
  );

  const value = useMemo(
    () => ({
      decisions,
      recordDecision(decision) {
        if (!isPersistedRescueDecision(decision)) return;

        const normalizedDecision = normalizePersistedRescueDecision(decision);
        setDecisions((current) =>
          current.some((item) => item.id === normalizedDecision.id)
            ? current
            : [normalizedDecision, ...current].slice(0, 50),
        );
      },
    }),
    [decisions, setDecisions],
  );

  return (
    <RescueOperationsContext.Provider value={value}>
      {children}
    </RescueOperationsContext.Provider>
  );
}
