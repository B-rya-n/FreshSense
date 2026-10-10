import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useLots } from "../../../contextos/useLots";
import {
  readStoredValue,
  storageKeys,
  writeStoredValue,
} from "../../../utilitarios/browserStorage";
import {
  createMonitoringEvent,
  createOperationsSnapshot,
  DEFAULT_LIVE_UPDATE_INTERVAL,
  LIVE_UPDATE_INTERVALS,
} from "../modelo/monitoringModel";
import { monitoringReducer } from "../modelo/monitoringReducer";

function readRefreshRate() {
  const savedRate = Number(
    readStoredValue(
      storageKeys.monitoringRefreshRate,
      DEFAULT_LIVE_UPDATE_INTERVAL,
    ),
  );

  return LIVE_UPDATE_INTERVALS.includes(savedRate)
    ? savedRate
    : DEFAULT_LIVE_UPDATE_INTERVAL;
}

function createInitialClock() {
  const updatedAt = new Date();

  return {
    tick: 0,
    updatedAt,
    events: Array.from({ length: 6 }, (_, index) =>
      createMonitoringEvent(
        index,
        new Date(updatedAt.getTime() - index * 90000),
      ),
    ),
    isPaused: false,
    refreshRate: readRefreshRate(),
  };
}

export function useLiveMonitoring() {
  const { lots } = useLots();
  const [clock, dispatch] = useReducer(
    monitoringReducer,
    undefined,
    createInitialClock,
  );
  const refreshNow = useCallback(() => {
    dispatch({ type: "advance", updatedAt: new Date() });
  }, []);

  useEffect(() => {
    if (clock.isPaused) return undefined;

    const interval = window.setInterval(refreshNow, clock.refreshRate);

    return () => window.clearInterval(interval);
  }, [clock.isPaused, clock.refreshRate, refreshNow]);

  useEffect(() => {
    writeStoredValue(
      storageKeys.monitoringRefreshRate,
      String(clock.refreshRate),
    );
  }, [clock.refreshRate]);

  const snapshot = useMemo(
    () => createOperationsSnapshot(clock.tick, lots),
    [clock.tick, lots],
  );
  const pendingAlertCount = useMemo(
    () =>
      clock.events.filter(
        (event) =>
          event.tone === "warning" &&
          !event.acknowledged &&
          event.status !== "resolvido",
      ).length,
    [clock.events],
  );
  const togglePaused = useCallback(
    () => dispatch({ type: "toggle-pause" }),
    [],
  );
  const setRefreshRate = useCallback(
    (refreshRate) => dispatch({ type: "set-refresh-rate", refreshRate }),
    [],
  );
  const acknowledgeEvent = useCallback(
    (id) => dispatch({ type: "acknowledge-event", id }),
    [],
  );
  const assignEvent = useCallback(
    (id) =>
      dispatch({
        type: "assign-event",
        id,
        owner: "Equipe de Qualidade",
      }),
    [],
  );
  const resolveEvent = useCallback(
    (id) => dispatch({ type: "resolve-event", id, resolvedAt: new Date() }),
    [],
  );

  return {
    ...snapshot,
    updatedAt: clock.updatedAt,
    events: clock.events,
    isPaused: clock.isPaused,
    refreshRate: clock.refreshRate,
    pendingAlertCount,
    refreshNow,
    togglePaused,
    setRefreshRate,
    acknowledgeEvent,
    assignEvent,
    resolveEvent,
  };
}
