import { createMonitoringEvent } from "./monitoringModel.js";

export function monitoringReducer(state, action) {
  switch (action.type) {
    case "advance": {
      const tick = state.tick + 1;

      return {
        ...state,
        tick,
        updatedAt: action.updatedAt,
        events: [
          createMonitoringEvent(tick, action.updatedAt),
          ...state.events,
        ].slice(0, 10),
      };
    }
    case "toggle-pause":
      return { ...state, isPaused: !state.isPaused };
    case "set-refresh-rate":
      return { ...state, refreshRate: action.refreshRate };
    case "acknowledge-event":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.id
            ? { ...event, acknowledged: true, status: "reconhecido" }
            : event,
        ),
      };
    case "assign-event":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.id
            ? { ...event, owner: action.owner, status: "em-tratamento" }
            : event,
        ),
      };
    case "resolve-event":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.id
            ? {
                ...event,
                acknowledged: true,
                status: "resolvido",
                resolvedAt: action.resolvedAt,
              }
            : event,
        ),
      };
    default:
      return state;
  }
}
