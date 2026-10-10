import { describe, expect, it } from "vitest";
import {
  createScopedHistory,
  createScopedInventory,
  createScopedMetrics,
} from "../modelo/monitoringScope";

const facility = {
  production: 64,
  productionShare: 0.46,
  alertCount: 0,
  onlineSensors: 23,
  totalSensors: 24,
};

const lots = [
  { category: "Frutas", weight: 2400 },
  { category: "Frutas", weight: 600 },
  { category: "Laticínios", weight: 280 },
];

it("mantém KPI, histórico e inventário com o mesmo estoque da unidade", () => {
  const metrics = createScopedMetrics(
    {
      stock: 9000,
      production: 140,
      availability: 98,
      coldChainCompliance: 99,
      sensorCoverage: 100,
      quality: 96,
      wasteAvoided: 500,
      avgResponse: 10,
      activeLots: 12,
      shipments: 20,
    },
    facility,
    lots,
  );
  const history = createScopedHistory(
    [
      { stock: 9000, production: 140 },
      { stock: 9000, production: 138 },
    ],
    facility,
    lots,
  );
  const inventory = createScopedInventory(
    [
      {
        category: "Frutas",
        amount: 4200,
        capacity: 5000,
        freshness: 95,
        turnoverHours: 18,
      },
      {
        category: "Laticínios",
        amount: 1800,
        capacity: 3500,
        freshness: 92,
        turnoverHours: 14,
      },
    ],
    facility,
    lots,
  );

  const inventoryTotal = inventory.reduce(
    (total, item) => total + item.amount,
    0,
  );

  expect(metrics.stock).toBe(3280);
  expect(history.every((point) => point.stock === metrics.stock)).toBe(true);
  expect(inventoryTotal).toBe(metrics.stock);
});

describe("escopo consolidado", () => {
  it("preserva os dados globais quando nenhuma unidade está selecionada", () => {
    const inventory = [{ category: "Frutas", amount: 4200 }];
    const history = [{ stock: 4200 }];

    expect(createScopedInventory(inventory, null, lots)).toBe(inventory);
    expect(createScopedHistory(history, null, lots)).toBe(history);
  });
});
