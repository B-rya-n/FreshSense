import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { DestinationForm } from "./DestinationForm";

const lots = [
  {
    id: "LT-9001",
    product: "Leite",
    origin: "Campinas - SP",
    destination: "São Paulo - SP",
    temperature: 9,
    weight: 1000,
    risk: "alto",
  },
  {
    id: "LT-9002",
    product: "Maçã",
    origin: "Jundiaí - SP",
    destination: "Sorocaba - SP",
    temperature: 4,
    weight: 600,
    risk: "baixo",
  },
];

const institutions = [
  {
    id: "INS-01",
    name: "Banco de Alimentos",
    city: "São Paulo - SP",
  },
];

afterEach(cleanup);

describe("DestinationForm", () => {
  test("limpa recomendação e quantidade ao trocar o lote", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DestinationForm
        lots={lots}
        destinations={[]}
        institutions={institutions}
        initialLotId="LT-9001"
        onCreate={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Aplicar sugestão" }));
    const quantityInput = screen.getByRole("spinbutton", {
      name: /Quantidade/i,
    });
    await user.type(quantityInput, "80");

    expect(screen.getByLabelText("Tipo de destinação").value).toBe("doacao");
    expect(quantityInput.value).toBe("80");

    await user.selectOptions(screen.getByLabelText("Lote"), "LT-9002");

    expect(screen.getByLabelText("Tipo de destinação").value).toBe("");
    expect(quantityInput.value).toBe("");
    expect(
      screen.getByText("Rebalancear o estoque entre unidades"),
    ).toBeTruthy();
  });

  test("descreve os erros e foca o primeiro campo inválido", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DestinationForm
        lots={lots}
        destinations={[]}
        institutions={institutions}
        initialLotId=""
        onCreate={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Registrar destinação" }),
    );

    const fields = [
      [screen.getByLabelText(/^Lote/), "destination-lot-error"],
      [screen.getByLabelText(/^Tipo de destinação/), "destination-type-error"],
      [screen.getByLabelText(/^Quantidade/), "destination-quantity-error"],
      [screen.getByLabelText(/^Destino/), "destination-recipient-error"],
      [
        screen.getByLabelText(/^Data prevista/),
        "destination-pickup-date-error",
      ],
      [screen.getByLabelText(/^Responsável/), "destination-responsible-error"],
    ];

    expect(document.activeElement).toBe(fields[0][0]);
    fields.forEach(([field, errorId]) => {
      expect(field.getAttribute("aria-invalid")).toBe("true");
      expect(field.getAttribute("aria-describedby")).toBe(errorId);
      expect(document.getElementById(errorId)).toBeTruthy();
    });
  });
});
