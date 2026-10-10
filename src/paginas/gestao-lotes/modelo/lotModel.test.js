import assert from "node:assert/strict";
import test from "node:test";
import { buildLotRecord, calculateLotRisk, validateLot } from "./lotModel.js";

const validLot = {
  id: "LT-2000",
  product: "Morango",
  category: "Frutas",
  origin: "Atibaia - SP",
  destination: "São Paulo - SP",
  stage: "Transporte",
  location: "Rota SP-01",
  temperature: "5",
  humidity: "80",
  minTemperature: "2",
  maxTemperature: "6",
  sensorId: "TS-900",
  weight: "450",
};

test("calcula o risco conforme a faixa térmica", () => {
  assert.equal(calculateLotRisk(5, 2, 6), "baixo");
  assert.equal(calculateLotRisk(7, 2, 6), "medio");
  assert.equal(calculateLotRisk(9, 2, 6), "alto");
});

test("exige os dados obrigatórios e os valores ambientais", () => {
  const errors = validateLot({ ...validLot, id: "", temperature: "" });
  assert.match(errors.id, /código/i);
  assert.match(errors.temperature, /temperatura/i);
});

test("impede código duplicado durante o cadastro", () => {
  const errors = validateLot(validLot, [{ id: "LT-2000" }]);
  assert.match(errors.id, /já existe/i);
});

test("permite manter o código do lote durante a edição", () => {
  const errors = validateLot(validLot, [{ id: "LT-2000" }], "LT-2000");
  assert.deepEqual(errors, {});
});

test("impede reduzir o peso abaixo do volume já comprometido", () => {
  const errors = validateLot(
    { ...validLot, weight: "59" },
    [{ id: "LT-2000" }],
    "LT-2000",
    60,
  );

  assert.match(errors.weight, /60 kg já comprometidos/);
});

test("normaliza o registro e deriva risco e status", () => {
  const record = buildLotRecord(
    { ...validLot, id: " lt-2000 ", temperature: "9" },
    null,
    new Date("2026-09-22T12:00:00.000Z"),
  );
  assert.equal(record.id, "LT-2000");
  assert.equal(record.temperature, 9);
  assert.equal(record.risk, "alto");
  assert.equal(record.status, "critico");
  assert.equal(record.createdAt, "2026-09-22T12:00:00.000Z");
});
