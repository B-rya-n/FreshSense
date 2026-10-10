import assert from "node:assert/strict";
import test from "node:test";
import {
  applyRescueScenario,
  buildReplayFrames,
  buildRescueScenarios,
  calculateThermalBudget,
} from "./rescueModel.js";
import { lotStages } from "../../../dados/lotData.js";

const criticalLot = {
  id: "LT-9001",
  product: "Leite",
  category: "Laticínios",
  origin: "Campinas - SP",
  destination: "São Paulo - SP",
  stage: "Transporte",
  location: "Rota SP-04",
  temperature: 9,
  humidity: 70,
  minTemperature: 1,
  maxTemperature: 5,
  sensorId: "TS-900",
  weight: 1000,
  risk: "alto",
  status: "critico",
};

test("reduz o orçamento térmico quando o lote está fora da faixa", () => {
  const criticalBudget = calculateThermalBudget(criticalLot);
  const stableBudget = calculateThermalBudget({
    ...criticalLot,
    temperature: 3,
    risk: "baixo",
    status: "estavel",
  });

  assert.ok(criticalBudget.remainingPercent < stableBudget.remainingPercent);
  assert.ok(criticalBudget.degreeHours > 0);
  assert.equal(stableBudget.deviation, 0);
});

test("gera três cenários e apenas uma recomendação", () => {
  const scenarios = buildRescueScenarios(criticalLot);

  assert.equal(scenarios.length, 3);
  assert.equal(scenarios.filter((scenario) => scenario.recommended).length, 1);
  assert.ok(
    scenarios.every(
      (scenario) =>
        scenario.savedWeight >= 0 && scenario.savedWeight <= criticalLot.weight,
    ),
  );
  assert.ok(
    scenarios.every((scenario) => lotStages.includes(scenario.stageAfter)),
  );
});

test("aplica o plano escolhido ao mesmo registro de lote", () => {
  const scenario = buildRescueScenarios(criticalLot).find(
    (item) => item.id === "stabilize",
  );
  const updated = applyRescueScenario(
    criticalLot,
    scenario,
    new Date("2026-10-02T15:00:00.000Z"),
  );

  assert.equal(updated.id, criticalLot.id);
  assert.equal(updated.risk, "baixo");
  assert.equal(updated.status, "estavel");
  assert.equal(updated.rescuePlan, "stabilize");
  assert.equal(updated.updatedAt, "2026-10-02T15:00:00.000Z");
});

test("inclui decisões registradas no replay em ordem cronológica", () => {
  const decision = {
    id: "DEC-1",
    lotId: criticalLot.id,
    scenarioTitle: "Estabilização térmica imediata",
    createdAt: "2026-10-02T16:00:00.000Z",
    location: "Zona de estabilização térmica",
    targetTemperature: 3,
    riskAfter: "baixo",
    operator: "Equipe FreshSense",
    lossPercent: 6,
  };
  const frames = buildReplayFrames(criticalLot, [decision]);

  assert.equal(frames.at(-1).id, decision.id);
  assert.ok(
    frames.every((frame) => frame.progress >= 0 && frame.progress <= 100),
  );
  assert.deepEqual(
    frames.map((frame) => frame.timestamp),
    frames
      .map((frame) => frame.timestamp)
      .toSorted((a, b) => new Date(a) - new Date(b)),
  );
});

test("não cria eventos de replay no futuro para um lote recém-cadastrado", () => {
  const now = new Date("2026-10-06T15:00:00.000Z");
  const frames = buildReplayFrames(
    { ...criticalLot, id: "NOVO-1", createdAt: now.toISOString() },
    [],
    now,
  );

  assert.ok(
    frames.every(
      (frame) => new Date(frame.timestamp).getTime() <= now.getTime(),
    ),
  );
});

test("preserva o histórico anterior quando um plano altera o lote", () => {
  const now = new Date("2026-10-06T15:00:00.000Z");
  const scenario = buildRescueScenarios(criticalLot).find(
    (item) => item.id === "stabilize",
  );
  const updatedLot = applyRescueScenario(criticalLot, scenario, now);
  const decision = {
    id: "DEC-SNAPSHOT",
    lotId: criticalLot.id,
    scenarioTitle: scenario.title,
    createdAt: now.toISOString(),
    location: scenario.locationAfter,
    targetTemperature: scenario.targetTemperature,
    riskAfter: scenario.riskAfter,
    operator: "Equipe FreshSense",
    lossPercent: scenario.lossPercent,
    lotSnapshot: { ...criticalLot },
  };

  const before = buildReplayFrames(criticalLot, [], now);
  const after = buildReplayFrames(updatedLot, [decision], now);

  assert.deepEqual(
    after.slice(0, before.length).map(({ temperature, status }) => ({
      temperature,
      status,
    })),
    before.map(({ temperature, status }) => ({ temperature, status })),
  );
  assert.equal(after.at(-1).id, decision.id);
});
