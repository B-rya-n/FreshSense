import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clamp, round } from "./number.js";

describe("number utilities", () => {
  it("limits values to the configured interval", () => {
    assert.equal(clamp(-2, 0, 10), 0);
    assert.equal(clamp(4, 0, 10), 4);
    assert.equal(clamp(12, 0, 10), 10);
  });

  it("rounds values with the requested precision", () => {
    assert.equal(round(4.567, 2), 4.57);
    assert.equal(round(4.54), 4.5);
  });
});
