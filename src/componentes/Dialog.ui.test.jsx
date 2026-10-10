import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, test } from "vitest";
import { Dialog } from "./Dialog";

function DialogFixture() {
  const [open, setOpen] = useState(true);
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      labelledBy="dialog-title"
    >
      <h2 id="dialog-title">Confirmar operação</h2>
      <button type="button">Confirmar</button>
      <button data-autofocus type="button" onClick={() => setOpen(false)}>
        Cancelar
      </button>
    </Dialog>
  );
}

function TriggeredDialogFixture() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir diálogo
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        labelledBy="triggered-dialog-title"
      >
        <h2 id="triggered-dialog-title">Ações disponíveis</h2>
        <button type="button">Primeira ação</button>
        <button data-autofocus type="button">
          Última ação
        </button>
      </Dialog>
    </>
  );
}

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

describe("Dialog", () => {
  test("bloqueia a página e fecha com Escape", () => {
    render(<DialogFixture />);

    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  test("mantém o foco no painel e o devolve ao acionador", async () => {
    render(<TriggeredDialogFixture />);
    const trigger = screen.getByRole("button", { name: "Abrir diálogo" });
    trigger.focus();
    fireEvent.click(trigger);

    const first = screen.getByRole("button", { name: "Primeira ação" });
    const last = screen.getByRole("button", { name: "Última ação" });
    await waitFor(() => expect(document.activeElement).toBe(last));

    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(first);

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.activeElement).toBe(trigger);
  });
});
