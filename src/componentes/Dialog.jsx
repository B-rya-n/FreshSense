import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function Dialog({
  open,
  onClose,
  labelledBy,
  describedBy,
  role = "dialog",
  className = "",
  layerClassName = "",
  unstyled = false,
  backdrop = null,
  as: Panel = "div",
  children,
}) {
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = () =>
      Array.from(panelRef.current?.querySelectorAll(focusableSelector) ?? []);

    const focusInitial = requestAnimationFrame(() => {
      const preferred = panelRef.current?.querySelector("[data-autofocus]");
      (preferred ?? focusable()[0] ?? panelRef.current)?.focus();
    });

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }

      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusInitial);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [onClose, open]);

  if (!open) return null;

  return createPortal(
    <div
      className={`${unstyled ? "" : "ui-dialog-layer"} ${layerClassName}`.trim()}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      {backdrop}
      <Panel
        ref={panelRef}
        className={`${unstyled ? "" : "ui-dialog-panel"} ${className}`.trim()}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
      >
        {children}
      </Panel>
    </div>,
    document.body,
  );
}
