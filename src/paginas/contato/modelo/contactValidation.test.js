import assert from "node:assert/strict";
import test from "node:test";
import { validateContact } from "./contactValidation.js";

const validContact = {
  nome: "Ana Silva",
  email: "ana@email.com",
  mensagem: "Gostaria de saber mais sobre a plataforma.",
};

test("exige nome completo com pelo menos duas letras em cada parte", () => {
  assert.match(validateContact({ ...validContact, nome: "" }).nome, /nome/i);
  assert.match(
    validateContact({ ...validContact, nome: "Ana" }).nome,
    /nome e sobrenome/i,
  );
  assert.match(
    validateContact({ ...validContact, nome: "A Silva" }).nome,
    /2 letras/i,
  );
});

test("exige um e-mail preenchido e válido", () => {
  assert.match(
    validateContact({ ...validContact, email: "" }).email,
    /e-mail/i,
  );
  assert.match(
    validateContact({ ...validContact, email: "ana@" }).email,
    /e-mail válido/i,
  );
});

test("exige uma mensagem de até 500 caracteres", () => {
  assert.match(
    validateContact({ ...validContact, mensagem: "" }).mensagem,
    /mensagem/i,
  );
  assert.match(
    validateContact({ ...validContact, mensagem: "x".repeat(501) }).mensagem,
    /500 caracteres/i,
  );
});

test("aceita dados válidos", () => {
  assert.deepEqual(validateContact(validContact), {});
});
