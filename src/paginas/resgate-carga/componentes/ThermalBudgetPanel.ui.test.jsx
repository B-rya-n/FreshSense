import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { calculateThermalBudget } from "../modelo/rescueModel";
import { ThermalBudgetPanel } from "./ThermalBudgetPanel";

const lots = [
  {
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
  },
  {
    id: "LT-9002",
    product: "Maçã",
    category: "Frutas",
    origin: "Jundiaí - SP",
    destination: "Sorocaba - SP",
    stage: "Armazenamento",
    location: "Câmara A",
    temperature: 4,
    humidity: 80,
    minTemperature: 2,
    maxTemperature: 6,
    sensorId: "TS-901",
    weight: 600,
    risk: "baixo",
    status: "estavel",
  },
];

afterEach(cleanup);

describe("ThermalBudgetPanel", () => {
  test("permite selecionar outro lote na própria aba", async () => {
    const user = userEvent.setup();
    const onSelectLot = vi.fn();

    renderWithProviders(
      <ThermalBudgetPanel
        lot={lots[0]}
        lots={lots}
        budget={calculateThermalBudget(lots[0])}
        selectedLotId={lots[0].id}
        onSelectLot={onSelectLot}
      />,
    );

    await user.click(screen.getByRole("button", { name: /LT-9002/i }));

    expect(onSelectLot).toHaveBeenCalledWith("LT-9002");
  });

  test("filtra a carteira por risco e por texto", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ThermalBudgetPanel
        lot={lots[0]}
        lots={lots}
        budget={calculateThermalBudget(lots[0])}
        selectedLotId={lots[0].id}
        onSelectLot={vi.fn()}
      />,
    );

    await user.selectOptions(
      screen.getByLabelText("Filtrar por risco"),
      "baixo",
    );
    expect(screen.queryByRole("button", { name: /LT-9001/i })).toBeNull();
    expect(screen.getByRole("button", { name: /LT-9002/i })).toBeTruthy();

    await user.type(
      screen.getByLabelText("Buscar lote"),
      "produto inexistente",
    );
    expect(
      screen.getByText(
        "Nenhum lote corresponde à busca e ao risco selecionados.",
      ),
    ).toBeTruthy();
  });
});
