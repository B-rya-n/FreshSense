import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useRouter } from "./useRouter";

function RouterProbe() {
  const location = useRouter();

  return (
    <div>
      <output data-testid="location">
        {location.pathname}
        {location.search}
      </output>
      <a href="/destinacao?lote=LT-1042">Primeiro lote</a>
      <a href="/destinacao?lote=PX-332">Segundo lote</a>
    </div>
  );
}

describe("useRouter", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/destinacao?lote=inicial");
  });

  afterEach(() => {
    cleanup();
    window.history.replaceState({}, "", "/");
  });

  it("reage quando somente a query string muda", () => {
    render(<RouterProbe />);

    expect(screen.getByTestId("location").textContent).toBe(
      "/destinacao?lote=inicial",
    );

    fireEvent.click(screen.getByRole("link", { name: "Primeiro lote" }));
    expect(screen.getByTestId("location").textContent).toBe(
      "/destinacao?lote=LT-1042",
    );

    fireEvent.click(screen.getByRole("link", { name: "Segundo lote" }));
    expect(screen.getByTestId("location").textContent).toBe(
      "/destinacao?lote=PX-332",
    );
  });
});
