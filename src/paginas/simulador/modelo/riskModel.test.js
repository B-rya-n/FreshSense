import assert from "node:assert/strict";
import test from "node:test";
import { normalizeRiskValues, validateRiskValues } from "./riskModel.js";

test("campos numéricos vazios não são convertidos silenciosamente em zero", () => {
  const values = normalizeRiskValues({
    temperatura: "",
    umidade: "   ",
    tempo: "8",
    atraso: "0",
    peso: "480",
    vidaUtil: "72",
  });
  const errors = validateRiskValues(values);

  assert.equal(Number.isNaN(values.temperatura), true);
  assert.equal(Number.isNaN(values.umidade), true);
  assert.ok(errors.includes("Temperatura deve estar entre -10°C e 40°C."));
  assert.ok(errors.includes("Umidade deve estar entre 0% e 100%."));
});

test("zero continua válido nos campos cujas regras permitem zero", () => {
  const values = normalizeRiskValues({
    temperatura: "0",
    umidade: "0",
    tempo: "8",
    atraso: "0",
    peso: "480",
    vidaUtil: "0",
  });

  assert.deepEqual(validateRiskValues(values), []);
});
