import test from "node:test";
import assert from "node:assert/strict";
import { initialLots } from "../../../dados/lotData.js";
import {
  buildDigitalPassport,
  buildPassportUrl,
  getQualityVerdict,
} from "./passportModel.js";
import { calculateThermalBudget } from "../../resgate-carga/modelo/rescueModel.js";

test("gera um certificado estável e uma trilha para o lote", () => {
  const lot = initialLots.find((item) => item.id === "PX-332");
  const referenceTime = new Date("2026-10-07T12:00:00-03:00");
  const first = buildDigitalPassport(lot, { referenceTime });
  const second = buildDigitalPassport(lot, { referenceTime });

  assert.equal(first.certificateId, second.certificateId);
  assert.match(first.certificateId, /^FS-PX-332-[A-F0-9]{6}$/);
  assert.equal(first.quality.code, "review");
  assert.ok(first.traceabilityEvents.length >= 6);
  assert.equal(first.route.origin, lot.origin);
  assert.equal(first.route.destination, lot.destination);
});

test("incorpora destinações no saldo e na trilha auditável", () => {
  const lot = initialLots.find((item) => item.id === "LT-1038");
  const destination = {
    id: "DST-TEST",
    lotId: lot.id,
    quantity: 60,
    unit: "kg",
    recipient: "Rede Solidária",
    status: "aprovada",
    history: [
      { status: "pendente", date: "06/10/2026 10:00" },
      { status: "aprovada", date: "06/10/2026 11:00" },
    ],
  };
  const passport = buildDigitalPassport(lot, {
    destinations: [destination],
    referenceTime: new Date("2026-10-07T12:00:00-03:00"),
  });

  assert.equal(passport.availability.committedWeight, 60);
  assert.equal(passport.availability.availableWeight, lot.weight - 60);
  assert.equal(
    passport.traceabilityEvents.filter(
      (event) => event.source === "destination",
    ).length,
    2,
  );
});

test("classifica a liberação conforme risco e orçamento térmico", () => {
  const stableLot = initialLots.find((item) => item.id === "LT-1031");
  const criticalLot = initialLots.find((item) => item.id === "PX-332");

  assert.equal(
    getQualityVerdict(stableLot, calculateThermalBudget(stableLot)).code,
    "approved",
  );
  assert.equal(
    getQualityVerdict(criticalLot, calculateThermalBudget(criticalLot)).code,
    "review",
  );
});

test("gera URL compartilhável com o código do lote", () => {
  assert.equal(
    buildPassportUrl("PX-332", "https://freshsense.example"),
    "https://freshsense.example/passaporte-lote?lote=PX-332",
  );
});
