import { useMemo } from "react";
import { initialLots } from "../dados/lotData";
import { usePersistedState } from "../hooks/usePersistedState";
import {
  isPersistedLot,
  isPersistedLotList,
  migratePersistedLots,
  normalizePersistedLot,
} from "./persistenceMigrations";
import { storageKeys } from "../utilitarios/browserStorage";
import { LotesContext } from "./useLots";

export function LotesProvider({ children }) {
  const [lots, setLots] = usePersistedState(
    storageKeys.lots,
    initialLots,
    isPersistedLotList,
    migratePersistedLots,
  );

  const value = useMemo(
    () => ({
      lots,
      addLot(lot) {
        if (!isPersistedLot(lot)) return;

        const normalizedLot = normalizePersistedLot(lot);
        setLots((current) =>
          current.some((item) => item.id === normalizedLot.id)
            ? current
            : [...current, normalizedLot],
        );
      },
      updateLot(id, lot) {
        if (!isPersistedLot(lot) || lot.id !== id) return;

        const normalizedLot = normalizePersistedLot(lot);
        setLots((current) =>
          current.map((currentLot) =>
            currentLot.id === id ? normalizedLot : currentLot,
          ),
        );
      },
      deleteLot(id) {
        setLots((current) => current.filter((lot) => lot.id !== id));
      },
    }),
    [lots, setLots],
  );

  return (
    <LotesContext.Provider value={value}>{children}</LotesContext.Provider>
  );
}
