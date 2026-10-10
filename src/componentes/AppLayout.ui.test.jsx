import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { renderWithProviders } from "../test/renderWithProviders";
import { AppLayout } from "./AppLayout";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("AppLayout", () => {
  test("move o foco para o conteúdo somente após uma troca de rota", async () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { rerender } = renderWithProviders(
      <AppLayout currentPath="/primeira" routes={[]}>
        <h1>Primeira página</h1>
      </AppLayout>,
    );

    const main = screen.getByRole("main");
    expect(main.tabIndex).toBe(-1);
    expect(document.activeElement).not.toBe(main);

    rerender(
      <AppLayout currentPath="/segunda" routes={[]}>
        <h1>Segunda página</h1>
      </AppLayout>,
    );

    await waitFor(() => expect(document.activeElement).toBe(main));
  });

  test("separa navegação e ações sem perder o contexto operacional", () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const routes = [
      { path: "/", label: "Início" },
      {
        path: "/gestao-lotes",
        label: "Lotes",
        navigationLabel: "Operação",
        navigationHref: "/fase5",
        section: "operations",
      },
      {
        path: "/destinacao",
        label: "Destinação",
        section: "operations",
        showInNavigation: false,
      },
      { path: "/contato", label: "Fale Conosco", isCallToAction: true },
    ];

    renderWithProviders(
      <AppLayout currentPath="/destinacao" routes={routes}>
        <h1>Destinação</h1>
      </AppLayout>,
    );

    const primaryNavigation = screen.getByRole("list", {
      name: "Páginas institucionais",
    });
    const siteActions = screen.getByRole("list", { name: "Ações do site" });
    const operationLink = within(primaryNavigation).getByRole("link", {
      name: "Operação",
    });

    expect(operationLink.getAttribute("href")).toBe("/fase5");
    expect(operationLink.getAttribute("aria-current")).toBe("location");
    expect(
      within(siteActions).getByRole("link", { name: "Fale Conosco" }),
    ).not.toBeNull();
    expect(
      within(siteActions).getByRole("group", { name: "Idioma" }),
    ).not.toBeNull();
  });

  test("fecha o menu com Escape e devolve o foco ao controle", async () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const user = userEvent.setup();

    renderWithProviders(
      <AppLayout currentPath="/" routes={[]}>
        <h1>Início</h1>
      </AppLayout>,
    );

    const openMenuButton = screen.getByRole("button", { name: "Abrir menu" });
    await user.click(openMenuButton);
    expect(
      screen
        .getByRole("button", { name: "Fechar menu" })
        .getAttribute("aria-expanded"),
    ).toBe("true");

    await user.keyboard("{Escape}");

    const closedMenuButton = screen.getByRole("button", { name: "Abrir menu" });
    expect(closedMenuButton.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(closedMenuButton);
  });
});
