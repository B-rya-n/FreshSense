import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { usePersistedState } from "./usePersistedState";

const storageKey = "freshsense-test-persisted-state";

function PersistedFixture() {
  const [items, setItems] = usePersistedState(
    storageKey,
    ["inicial"],
    Array.isArray,
  );

  return (
    <div>
      <output>{items.join(",")}</output>
      <button
        type="button"
        onClick={() => setItems((current) => [...current, "novo"])}
      >
        Adicionar
      </button>
    </div>
  );
}

function MigratedFixture() {
  const [items] = usePersistedState(
    storageKey,
    ["fallback"],
    (value) => Array.isArray(value) && value.every(Number.isFinite),
    (value) => value.map((item) => item * 2),
  );

  return <output>{items.join(",")}</output>;
}

afterEach(() => {
  cleanup();
  window.localStorage.removeItem(storageKey);
});

describe("usePersistedState", () => {
  test("restaura e persiste atualizações sem efeitos no updater", async () => {
    window.localStorage.setItem(storageKey, JSON.stringify(["salvo"]));
    render(<PersistedFixture />);

    expect(screen.getByText("salvo")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Adicionar" }));

    await waitFor(() =>
      expect(JSON.parse(window.localStorage.getItem(storageKey))).toEqual([
        "salvo",
        "novo",
      ]),
    );
  });

  test("migra dados válidos e rejeita estruturas persistidas inválidas", () => {
    window.localStorage.setItem(storageKey, JSON.stringify([2, 4]));
    const { unmount } = render(<MigratedFixture />);
    expect(screen.getByText("4,8")).toBeTruthy();
    unmount();

    window.localStorage.setItem(
      storageKey,
      JSON.stringify([{ id: "quebrado" }]),
    );
    render(<MigratedFixture />);
    expect(screen.getByText("fallback")).toBeTruthy();
  });
});
