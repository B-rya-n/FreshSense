import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizePath, normalizeSearchTerm, resolveLanguage } from "./text.js";

describe("text utilities", () => {
  it("normalizes case and accents for every search experience", () => {
    assert.equal(normalizeSearchTerm("  MAÇÃ  ").trim(), "maca");
    assert.equal(normalizeSearchTerm("São José"), "sao jose");
  });

  it("normalizes application paths", () => {
    assert.equal(normalizePath("/gestao-lotes/"), "/gestao-lotes");
    assert.equal(normalizePath("/"), "/");
  });

  it("falls back when a language is unavailable", () => {
    const translations = { pt: {}, en: {} };
    assert.equal(resolveLanguage("en", translations), "en");
    assert.equal(resolveLanguage("fr", translations), "pt");
  });
});
