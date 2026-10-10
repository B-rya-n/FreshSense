import { destinationStatus } from "../../destinacao/modelo/destinationModel.js";
import {
  buildReplayFrames,
  calculateThermalBudget,
} from "../../resgate-carga/modelo/rescueModel.js";
import { clamp } from "../../../utilitarios/number.js";

const STAGE_PROGRESS = Object.freeze({
  Produção: 18,
  Armazenamento: 42,
  Transporte: 72,
  Distribuição: 92,
});

const QUALITY_COPY = Object.freeze({
  approved: {
    title: "Conforme para prosseguir",
    shortLabel: "Conforme",
    detail:
      "As evidências atuais permanecem dentro dos limites configurados para o lote.",
  },
  conditional: {
    title: "Liberação condicionada",
    shortLabel: "Em acompanhamento",
    detail:
      "A condição requer acompanhamento e conferência da equipe de qualidade antes da entrega.",
  },
  review: {
    title: "Retido para avaliação",
    shortLabel: "Em análise",
    detail:
      "O desvio atual exige avaliação da qualidade antes de liberar, destinar ou receber o lote.",
  },
});

function hashText(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

function parseOperationalDate(value, fallback) {
  if (!value) return fallback;
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();

  const brazilianDate = String(value).match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:,?\s+(\d{2}):(\d{2}))?/,
  );
  if (!brazilianDate) return fallback;

  const [, day, month, year, hour = "12", minute = "00"] = brazilianDate;
  return `${year}-${month}-${day}T${hour}:${minute}:00-03:00`;
}

function getEvidenceScore(lot, thermalBudget, traceabilityEvents) {
  const requiredFields = [
    "id",
    "product",
    "category",
    "origin",
    "destination",
    "location",
    "sensorId",
    "temperature",
    "humidity",
    "minTemperature",
    "maxTemperature",
    "weight",
  ];
  const completeness =
    requiredFields.filter(
      (field) =>
        lot[field] !== undefined && lot[field] !== null && lot[field] !== "",
    ).length / requiredFields.length;
  const historyBonus = Math.min(8, traceabilityEvents.length);
  const riskPenalty = { baixo: 0, medio: 5, alto: 12 }[lot.risk] ?? 5;

  return clamp(
    Math.round(
      completeness * 82 +
        historyBonus -
        riskPenalty -
        thermalBudget.spentPercent * 0.05,
    ),
    45,
    99,
  );
}

export function getQualityVerdict(lot, thermalBudget) {
  if (lot.risk === "alto" || thermalBudget.remainingPercent <= 25) {
    return { code: "review", tone: "critical", ...QUALITY_COPY.review };
  }

  if (lot.risk === "medio" || thermalBudget.remainingPercent <= 55) {
    return {
      code: "conditional",
      tone: "attention",
      ...QUALITY_COPY.conditional,
    };
  }

  return { code: "approved", tone: "stable", ...QUALITY_COPY.approved };
}

function buildDestinationEvents(lot, destinations, issuedAt) {
  return destinations
    .filter((destination) => destination.lotId === lot.id)
    .flatMap((destination) =>
      destination.history.map((item, index) => ({
        id: `${destination.id}-${item.status}-${index}`,
        label: destinationStatus[item.status] ?? item.status,
        detail: `${destination.quantity.toLocaleString("pt-BR")} ${destination.unit} · ${destination.recipient}`,
        timestamp: parseOperationalDate(item.date, issuedAt),
        location: destination.recipient,
        stage: "Destinação",
        status:
          item.status === "cancelada"
            ? "critical"
            : item.status === "concluida"
              ? "stable"
              : "warning",
        source: "destination",
      })),
    );
}

export function buildDigitalPassport(
  lot,
  { decisions = [], destinations = [], referenceTime = new Date() } = {},
) {
  if (!lot) return null;

  const thermalBudget = calculateThermalBudget(lot);
  const replayFrames = buildReplayFrames(lot, decisions, referenceTime);
  const latestFrame = replayFrames.at(-1);
  const issuedAt =
    lot.updatedAt ??
    lot.createdAt ??
    latestFrame?.timestamp ??
    referenceTime.toISOString();
  const destinationEvents = buildDestinationEvents(lot, destinations, issuedAt);
  const traceabilityEvents = [
    ...replayFrames.map((frame) => ({ ...frame, source: "telemetry" })),
    ...destinationEvents,
  ].toSorted(
    (left, right) => new Date(left.timestamp) - new Date(right.timestamp),
  );
  const quality = getQualityVerdict(lot, thermalBudget);
  const lotDestinations = destinations.filter(
    (destination) => destination.lotId === lot.id,
  );
  const committedWeight = lotDestinations
    .filter((destination) => destination.status !== "cancelada")
    .reduce(
      (total, destination) => total + Number(destination.quantity || 0),
      0,
    );
  const signaturePayload = JSON.stringify({
    lot: {
      id: lot.id,
      product: lot.product,
      origin: lot.origin,
      destination: lot.destination,
      temperature: lot.temperature,
      humidity: lot.humidity,
      risk: lot.risk,
      status: lot.status,
      updatedAt: lot.updatedAt,
    },
    decisions: decisions
      .filter((decision) => decision.lotId === lot.id)
      .map((decision) => decision.id),
    destinations: lotDestinations.map((destination) => [
      destination.id,
      destination.status,
    ]),
  });
  const digest = hashText(signaturePayload);

  return {
    id: `PPT-${lot.id}`,
    version: "1.0",
    certificateId: `FS-${lot.id}-${digest.slice(0, 6)}`,
    verificationCode: `${digest.slice(0, 4)}-${digest.slice(4)}`,
    issuedAt,
    updatedAt: lot.updatedAt ?? issuedAt,
    quality,
    lot,
    thermalBudget,
    traceabilityEvents,
    evidenceScore: getEvidenceScore(lot, thermalBudget, traceabilityEvents),
    route: {
      origin: lot.origin,
      currentLocation: lot.location,
      destination: lot.destination,
      stage: lot.stage,
      progress: STAGE_PROGRESS[lot.stage] ?? 50,
    },
    custody: {
      sensorId: lot.sensorId,
      recordedEvents: traceabilityEvents.length,
      rescueDecisions: decisions.filter((decision) => decision.lotId === lot.id)
        .length,
      destinations: lotDestinations.length,
    },
    availability: {
      totalWeight: Number(lot.weight) || 0,
      committedWeight,
      availableWeight: Math.max(0, Number(lot.weight || 0) - committedWeight),
    },
  };
}

export function buildPassportUrl(lotId, origin = globalThis.location?.origin) {
  const base = origin || "http://localhost";
  return `${base}/passaporte-lote?lote=${encodeURIComponent(lotId)}`;
}
