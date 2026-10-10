import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { renderWithProviders } from "../test/renderWithProviders";
import { SiteSearch } from "./SiteSearch";

const pages = [
  {
    path: "/monitoramento",
    label: "Monitoramento",
    description: "Acompanhe sensores e alertas.",
    searchTerms: "sensor alerta",
  },
];

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

describe("SiteSearch", () => {
  test("bloqueia a rolagem, recebe foco e o devolve ao fechar", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    renderWithProviders(
      <ul>
        <SiteSearch pages={pages} onNavigate={onNavigate} />
      </ul>,
    );

    const trigger = screen.getByRole("button", { name: "Buscar no site" });
    await user.click(trigger);

    const search = screen.getByRole("searchbox", {
      name: "Digite o que procura",
    });
    await waitFor(() => expect(document.activeElement).toBe(search));
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(trigger);
  });
});
