import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { I18nProvider, Translated } from "./I18nContext";
import { useI18n } from "./useI18n";

function DynamicOperationalCopy() {
  const { t } = useI18n();
  return <span>{t("Estabilização térmica imediata")}</span>;
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("dicionário operacional", () => {
  it("traduz a destinação e os cenários dinâmicos para inglês", () => {
    window.localStorage.setItem("freshsense-language", "en");

    render(
      <I18nProvider>
        <Translated>
          <h1>Destinação inteligente de lotes</h1>
        </Translated>
        <DynamicOperationalCopy />
      </I18nProvider>,
    );

    expect(screen.getByText("Smart lot allocation")).toBeTruthy();
    expect(screen.getByText("Immediate thermal stabilization")).toBeTruthy();
  });

  it("traduz o orçamento térmico para espanhol", () => {
    window.localStorage.setItem("freshsense-language", "es");

    render(
      <I18nProvider>
        <Translated>
          <h1>Quanto da tolerância do lote ainda resta?</h1>
        </Translated>
      </I18nProvider>,
    );

    expect(
      screen.getByText("¿Cuánta tolerancia le queda al lote?"),
    ).toBeTruthy();
  });
});
