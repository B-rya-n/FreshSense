import assert from "node:assert/strict";
import test from "node:test";
import { buildReplayFrames } from "../paginas/resgate-carga/modelo/rescueModel.js";
import {
  isPersistedDestinationList,
  isPersistedLotList,
  isPersistedRescueDecisionList,
  migratePersistedDestinations,
  migratePersistedLots,
  migratePersistedRescueDecisions,
} from "./persistenceMigrations.js";

const legacyLot = {
  id: "LT-LEGADO",
  product: "Leite",
  category: "Laticínios",
  origin: "Campinas - SP",
  destination: "São Paulo - SP",
  stage: "Etapa legada",
  location: "Rota SP-04",
  temperature: "9.5",
  humidity: "70",
  minTemperature: "1",
  maxTemperature: "5",
  sensorId: "TS-900",
  weight: "1000",
  risk: "baixo",
  status: "estavel",
};

const legacyDestination = {
  id: "DST-LEGADO",
  lotId: legacyLot.id,
  product: legacyLot.product,
  type: "doacao",
  quantity: "25.5",
  unit: "kg",
  recipient: "Banco de Alimentos",
  responsible: "Ana Souza",
  pickupDate: "2026-10-08",
  notes: "Retirada refrigerada",
  status: "aprovada",
  createdAt: "06/10/2026 10:00",
  origin: legacyLot.origin,
  history: [
    { status: "pendente", date: "06/10/2026 10:00" },
    { status: "aprovada", date: "06/10/2026 10:30" },
  ],
};

const legacyDecision = {
  id: "DEC-LEGADO",
  lotId: legacyLot.id,
  scenarioId: "stabilize",
  scenarioTitle: "Estabilização térmica imediata",
  createdAt: "2026-10-06T15:00:00.000Z",
  operator: "Equipe FreshSense",
  lossPercent: "7.5",
  riskBefore: "alto",
  riskAfter: "baixo",
  targetTemperature: "3",
  location: "Zona de estabilização térmica",
  lotSnapshot: legacyLot,
};

test("normaliza todos os campos numéricos do lote e recompõe dados derivados", () => {
  assert.equal(isPersistedLotList([legacyLot]), true);

  const [lot] = migratePersistedLots([legacyLot]);

  for (const field of [
    "temperature",
    "humidity",
    "minTemperature",
    "maxTemperature",
    "weight",
  ]) {
    assert.equal(typeof lot[field], "number");
  }
  assert.equal(lot.stage, "Armazenamento");
  assert.equal(lot.risk, "alto");
  assert.equal(lot.status, "critico");
});

test("rejeita lotes com números vazios ou limites incoerentes", () => {
  assert.equal(isPersistedLotList([{ ...legacyLot, temperature: "" }]), false);
  assert.equal(
    isPersistedLotList([
      { ...legacyLot, minTemperature: "5", maxTemperature: "5" },
    ]),
    false,
  );
  assert.equal(isPersistedLotList([{ ...legacyLot, humidity: 101 }]), false);
  assert.equal(isPersistedLotList([{ ...legacyLot, weight: 0 }]), false);
});

test("migra quantidade de destinação para Number", () => {
  assert.equal(isPersistedDestinationList([legacyDestination]), true);

  const [destination] = migratePersistedDestinations([legacyDestination]);

  assert.equal(destination.quantity, 25.5);
  assert.equal(typeof destination.quantity, "number");
});

test("rejeita schema, data, tipo, status e histórico inválidos", () => {
  const invalidDestinations = [
    { ...legacyDestination, product: undefined },
    { ...legacyDestination, pickupDate: "2026-02-31" },
    { ...legacyDestination, type: "desconhecido" },
    { ...legacyDestination, status: "desconhecido" },
    {
      ...legacyDestination,
      history: [{ status: "aprovada", date: "06/10/2026 10:30" }],
    },
    {
      ...legacyDestination,
      history: [
        { status: "pendente", date: "06/10/2026 10:00" },
        { status: "concluida", date: "06/10/2026 10:30" },
      ],
    },
  ];

  for (const destination of invalidDestinations) {
    assert.equal(isPersistedDestinationList([destination]), false);
  }
});

test("migra uma decisão completa e mantém o replay renderizável", () => {
  assert.equal(isPersistedRescueDecisionList([legacyDecision]), true);

  const [decision] = migratePersistedRescueDecisions([legacyDecision]);
  const [lot] = migratePersistedLots([legacyLot]);
  const frames = buildReplayFrames(
    lot,
    [decision],
    new Date("2026-10-06T16:00:00.000Z"),
  );

  assert.equal(typeof decision.lossPercent, "number");
  assert.equal(typeof decision.targetTemperature, "number");
  assert.equal(typeof decision.lotSnapshot.temperature, "number");
  assert.equal(frames.at(-1).id, decision.id);
  assert.ok(
    frames.every(
      (frame) =>
        Number.isFinite(frame.temperature) &&
        Number.isFinite(frame.humidity) &&
        Number.isFinite(Date.parse(frame.timestamp)),
    ),
  );
});

test("rejeita decisões incompletas antes que cheguem ao replay", () => {
  const invalidDecisions = [
    { ...legacyDecision, operator: undefined },
    { ...legacyDecision, createdAt: "data inválida" },
    { ...legacyDecision, targetTemperature: "" },
    { ...legacyDecision, riskAfter: "critico" },
    {
      ...legacyDecision,
      lotSnapshot: { ...legacyLot, id: "OUTRO-LOTE" },
    },
  ];

  for (const decision of invalidDecisions) {
    assert.equal(isPersistedRescueDecisionList([decision]), false);
  }
});
