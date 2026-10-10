import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { LotForm } from "./LotForm";

const lot = {
  id: "LT-2000",
  product: "Morango",
  category: "Frutas",
  origin: "Atibaia - SP",
  destination: "São Paulo - SP",
  stage: "Transporte",
  location: "Rota SP-01",
  temperature: 5,
  humidity: 80,
  minTemperature: 2,
  maxTemperature: 6,
  sensorId: "TS-900",
  weight: 450,
  risk: "baixo",
  status: "estavel",
};

afterEach(cleanup);

describe("LotForm", () => {
  test("exibe a validação quando um campo obrigatório é apagado", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LotForm lots={[lot]} lot={lot} onSave={vi.fn()} />);

    await user.clear(screen.getByLabelText("Produto"));
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));

    expect(screen.getByText("Informe o produto.")).toBeTruthy();
  });

  test("recalcula o risco antes de salvar uma edição", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    renderWithProviders(<LotForm lots={[lot]} lot={lot} onSave={onSave} />);

    const temperature = screen.getByLabelText("Temperatura atual (°C)");
    await user.clear(temperature);
    await user.type(temperature, "9");
    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        risk: "alto",
        status: "critico",
        temperature: 9,
      }),
    );
  });
});
