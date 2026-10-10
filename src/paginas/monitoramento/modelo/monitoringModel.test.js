import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateLotRisk,
  riskToStatus,
} from "../../gestao-lotes/modelo/lotModel.js";
import { createOperationsSnapshot } from "./monitoringModel.js";

test("mantém risco e status coerentes com cada leitura simulada", () => {
  for (let tick = 0; tick <= 100; tick += 1) {
    const snapshot = createOperationsSnapshot(tick);

    snapshot.lots.forEach((lot) => {
      const risk = calculateLotRisk(
        lot.temperature,
        lot.minTemperature,
        lot.maxTemperature,
      );
      assert.equal(lot.risk, risk);
      assert.equal(lot.status, riskToStatus(risk));
    });
  }
});

test("deriva o estoque consolidado do peso dos lotes cadastrados", () => {
  const lots = [
    {
      id: "A-1",
      weight: 400,
      temperature: 4,
      humidity: 80,
      minTemperature: 2,
      maxTemperature: 6,
    },
    {
      id: "B-2",
      weight: 650,
      temperature: 8,
      humidity: 70,
      minTemperature: 3,
      maxTemperature: 7,
    },
  ];
  const snapshot = createOperationsSnapshot(0, lots);

  assert.equal(snapshot.metrics.stock, 1050);
  assert.ok(snapshot.metricHistory.every((point) => point.stock === 1050));
});
