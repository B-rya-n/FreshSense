import { lotStages } from "../dados/lotData.js";
import {
  calculateLotRisk,
  riskToStatus,
} from "../paginas/gestao-lotes/modelo/lotModel.js";
import {
  destinationStatus,
  destinationTypes,
} from "../paginas/destinacao/modelo/destinationModel.js";

const lotNumericFields = [
  "temperature",
  "humidity",
  "minTemperature",
  "maxTemperature",
  "weight",
];

const destinationTransitions = Object.freeze({
  pendente: ["aprovada", "cancelada"],
  aprovada: ["transporte", "cancelada"],
  transporte: ["concluida", "cancelada"],
  concluida: [],
  cancelada: [],
});

const destinationTypeIds = new Set(Object.keys(destinationTypes));
const destinationStatusIds = new Set(Object.keys(destinationStatus));
const rescueRiskIds = new Set(["baixo", "medio", "alto"]);

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumberLike(value) {
  if (typeof value !== "number" && typeof value !== "string") return false;
  if (typeof value === "string" && value.trim() === "") return false;
  return Number.isFinite(Number(value));
}

function isValidTimestamp(value) {
  return isNonEmptyString(value) && Number.isFinite(Date.parse(value));
}

function isValidCalendarDate(value) {
  if (typeof value !== "string") return false;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function hasValidOptionalTimestamp(value, field) {
  return value[field] === undefined || isValidTimestamp(value[field]);
}

export function isPersistedLot(value) {
  if (!isRecord(value)) return false;

  const requiredTextFields = [
    "id",
    "product",
    "category",
    "origin",
    "destination",
    "stage",
    "location",
    "sensorId",
  ];

  if (!requiredTextFields.every((field) => isNonEmptyString(value[field]))) {
    return false;
  }

  if (!lotNumericFields.every((field) => isFiniteNumberLike(value[field]))) {
    return false;
  }

  const humidity = Number(value.humidity);
  const minimum = Number(value.minTemperature);
  const maximum = Number(value.maxTemperature);
  const weight = Number(value.weight);

  return (
    humidity >= 0 &&
    humidity <= 100 &&
    minimum < maximum &&
    weight > 0 &&
    hasValidOptionalTimestamp(value, "createdAt") &&
    hasValidOptionalTimestamp(value, "updatedAt") &&
    (value.rescuePlan === undefined || isNonEmptyString(value.rescuePlan))
  );
}

export function isPersistedLotList(value) {
  return Array.isArray(value) && value.every(isPersistedLot);
}

export function normalizePersistedLot(lot) {
  const normalizedNumbers = Object.fromEntries(
    lotNumericFields.map((field) => [field, Number(lot[field])]),
  );
  const risk = calculateLotRisk(
    normalizedNumbers.temperature,
    normalizedNumbers.minTemperature,
    normalizedNumbers.maxTemperature,
  );

  return {
    ...lot,
    ...normalizedNumbers,
    stage: lotStages.includes(lot.stage) ? lot.stage : "Armazenamento",
    risk,
    status: riskToStatus(risk),
  };
}

export function migratePersistedLots(lots) {
  return lots.map(normalizePersistedLot);
}

function hasValidDestinationHistory(history, currentStatus) {
  if (!Array.isArray(history) || history.length === 0) return false;
  if (
    !history.every(
      (entry) =>
        isRecord(entry) &&
        destinationStatusIds.has(entry.status) &&
        isNonEmptyString(entry.date),
    )
  ) {
    return false;
  }

  if (history[0].status !== "pendente") return false;

  const hasValidTransitions = history
    .slice(1)
    .every((entry, index) =>
      destinationTransitions[history[index].status].includes(entry.status),
    );

  return hasValidTransitions && history.at(-1).status === currentStatus;
}

export function isPersistedDestination(value) {
  if (!isRecord(value)) return false;

  const requiredTextFields = [
    "id",
    "lotId",
    "product",
    "unit",
    "recipient",
    "responsible",
    "createdAt",
    "origin",
  ];

  if (!requiredTextFields.every((field) => isNonEmptyString(value[field]))) {
    return false;
  }

  return (
    destinationTypeIds.has(value.type) &&
    destinationStatusIds.has(value.status) &&
    isFiniteNumberLike(value.quantity) &&
    Number(value.quantity) > 0 &&
    isValidCalendarDate(value.pickupDate) &&
    typeof value.notes === "string" &&
    value.notes.length <= 240 &&
    hasValidDestinationHistory(value.history, value.status)
  );
}

export function isPersistedDestinationList(value) {
  return Array.isArray(value) && value.every(isPersistedDestination);
}

export function normalizePersistedDestination(destination) {
  return {
    ...destination,
    quantity: Number(destination.quantity),
    history: destination.history.map((entry) => ({ ...entry })),
  };
}

export function migratePersistedDestinations(destinations) {
  return destinations.map(normalizePersistedDestination);
}

export function isPersistedRescueDecision(value) {
  if (!isRecord(value)) return false;

  const requiredTextFields = [
    "id",
    "lotId",
    "scenarioId",
    "scenarioTitle",
    "operator",
    "location",
  ];

  if (!requiredTextFields.every((field) => isNonEmptyString(value[field]))) {
    return false;
  }

  if (
    !isValidTimestamp(value.createdAt) ||
    !rescueRiskIds.has(value.riskBefore) ||
    !rescueRiskIds.has(value.riskAfter) ||
    !isFiniteNumberLike(value.lossPercent) ||
    Number(value.lossPercent) < 0 ||
    Number(value.lossPercent) > 100 ||
    !isFiniteNumberLike(value.targetTemperature)
  ) {
    return false;
  }

  return (
    value.lotSnapshot === undefined ||
    (isPersistedLot(value.lotSnapshot) && value.lotSnapshot.id === value.lotId)
  );
}

export function isPersistedRescueDecisionList(value) {
  return Array.isArray(value) && value.every(isPersistedRescueDecision);
}

export function normalizePersistedRescueDecision(decision) {
  return {
    ...decision,
    lossPercent: Number(decision.lossPercent),
    targetTemperature: Number(decision.targetTemperature),
    ...(decision.lotSnapshot
      ? { lotSnapshot: normalizePersistedLot(decision.lotSnapshot) }
      : {}),
  };
}

export function migratePersistedRescueDecisions(decisions) {
  return decisions.map(normalizePersistedRescueDecision).slice(0, 50);
}
