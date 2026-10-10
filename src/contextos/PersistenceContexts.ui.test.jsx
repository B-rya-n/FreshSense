import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { buildReplayFrames } from "../paginas/resgate-carga/modelo/rescueModel";
import { storageKeys } from "../utilitarios/browserStorage";
import { DestinationsProvider } from "./DestinationsContext";
import { LotesProvider } from "./LotesContext";
import { RescueOperationsProvider } from "./RescueOperationsContext";
import { useDestinations } from "./useDestinations";
import { useLots } from "./useLots";
import { useRescueOperations } from "./useRescueOperations";

const legacyLot = {
  id: "LT-LEGADO",
  product: "Leite",
  category: "Laticínios",
  origin: "Campinas - SP",
  destination: "São Paulo - SP",
  stage: "Transporte",
  location: "Rota SP-04",
  temperature: "9.5",
  humidity: "70",
  minTemperature: "1",
  maxTemperature: "5",
  sensorId: "TS-900",
  weight: "1000",
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
  status: "pendente",
  createdAt: "06/10/2026 10:00",
  origin: legacyLot.origin,
  history: [{ status: "pendente", date: "06/10/2026 10:00" }],
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

function LotsProbe() {
  const { lots } = useLots();
  const lot = lots[0];

  return (
    <output data-testid="lots-probe">
      {[
        typeof lot.temperature,
        typeof lot.humidity,
        typeof lot.minTemperature,
        typeof lot.maxTemperature,
        typeof lot.weight,
        lot.risk,
        lot.status,
      ].join("|")}
    </output>
  );
}

function DestinationsProbe() {
  const { destinations } = useDestinations();
  const destination = destinations[0];

  return (
    <output data-testid="destinations-probe">
      {destination.id}|{typeof destination.quantity}|{destination.pickupDate}
    </output>
  );
}

function RescueProbe() {
  const { decisions } = useRescueOperations();
  const frames = buildReplayFrames(
    { ...legacyLot, temperature: 9.5, humidity: 70 },
    decisions,
    new Date("2026-10-06T16:00:00.000Z"),
  );
  const decisionFrame = frames.find((frame) => frame.id === "DEC-LEGADO");

  return (
    <output data-testid="rescue-probe">
      {typeof decisionFrame.temperature}|{typeof decisionFrame.humidity}|
      {decisionFrame.label}
    </output>
  );
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("contextos persistidos", () => {
  test("LotesProvider restaura números legados como Number", async () => {
    window.localStorage.setItem(storageKeys.lots, JSON.stringify([legacyLot]));

    render(
      <LotesProvider>
        <LotsProbe />
      </LotesProvider>,
    );

    expect(screen.getByTestId("lots-probe").textContent).toBe(
      "number|number|number|number|number|alto|critico",
    );
    await waitFor(() =>
      expect(
        typeof JSON.parse(window.localStorage.getItem(storageKeys.lots))[0]
          .weight,
      ).toBe("number"),
    );
  });

  test("DestinationsProvider migra quantity e descarta data impossível", () => {
    window.localStorage.setItem(
      storageKeys.destinations,
      JSON.stringify([legacyDestination]),
    );
    const { unmount } = render(
      <DestinationsProvider>
        <DestinationsProbe />
      </DestinationsProvider>,
    );

    expect(screen.getByTestId("destinations-probe").textContent).toBe(
      "DST-LEGADO|number|2026-10-08",
    );
    unmount();

    window.localStorage.setItem(
      storageKeys.destinations,
      JSON.stringify([{ ...legacyDestination, pickupDate: "2026-02-31" }]),
    );
    render(
      <DestinationsProvider>
        <DestinationsProbe />
      </DestinationsProvider>,
    );

    expect(screen.getByTestId("destinations-probe").textContent).toContain(
      "DST-2401|number|2026-10-08",
    );
  });

  test("RescueOperationsProvider entrega decisões completas ao replay", () => {
    window.localStorage.setItem(
      storageKeys.rescueDecisions,
      JSON.stringify([legacyDecision]),
    );

    render(
      <RescueOperationsProvider>
        <RescueProbe />
      </RescueOperationsProvider>,
    );

    expect(screen.getByTestId("rescue-probe").textContent).toContain(
      "number|number|Plano executado: Estabilização térmica imediata",
    );
  });
});
