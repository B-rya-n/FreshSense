import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, test } from "vitest";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { OperationsCopilot } from "./OperationsCopilot";

const context = {
  metrics: { coldChainCompliance: 99, avgResponse: 3 },
  events: [],
  lots: [],
  sensors: [],
  routes: [],
  facilities: [],
  facility: null,
  updatedAt: new Date("2026-10-06T12:00:00"),
  selectedIncident: null,
};

function CopilotFixture() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir Copilot operacional
      </button>
      <OperationsCopilot
        open={open}
        onClose={() => setOpen(false)}
        context={context}
      />
    </>
  );
}

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

describe("OperationsCopilot", () => {
  test("prende o foco, bloqueia a rolagem e retorna ao acionador", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CopilotFixture />);

    const trigger = screen.getByRole("button", {
      name: "Abrir Copilot operacional",
    });
    await user.click(trigger);

    const close = screen.getByRole("button", {
      name: "Fechar FreshSense Copilot",
    });
    await waitFor(() => expect(document.activeElement).toBe(close));
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(
      screen.getByRole("textbox", {
        name: "Faça uma pergunta sobre a operação",
      }),
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(trigger);
  });
});
