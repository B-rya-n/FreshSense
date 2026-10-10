import { useCallback, useEffect, useMemo, useState } from "react";
import { Translated } from "../traducoes/I18nContext";
import { normalizeSearchTerm } from "../utilitarios/text";
import { Dialog } from "./Dialog";

export function SiteSearch({ pages, onNavigate }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const close = useCallback(() => setOpen(false), []);
  const results = useMemo(() => {
    const value = normalizeSearchTerm(query.trim());
    return value
      ? pages.filter((page) =>
          normalizeSearchTerm(
            `${page.label} ${page.description} ${page.searchTerms}`,
          ).includes(value),
        )
      : pages;
  }, [pages, query]);

  useEffect(() => {
    const handleKey = (event) => {
      const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(
        document.activeElement?.tagName,
      );
      if (
        event.key === "/" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !isTyping
      ) {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const dialog = (
    <Dialog
      open={open}
      onClose={close}
      labelledBy="searchTitle"
      layerClassName="search-overlay"
      className="search-panel"
      unstyled
      as="section"
    >
      <Translated>
        <div className="search-head">
          <div>
            <span>FreshSense</span>
            <h2 id="searchTitle">Buscar no site</h2>
          </div>
          <button type="button" onClick={close}>
            Fechar
          </button>
        </div>
        <label className="search-field">
          <span>Digite o que procura</span>
          <input
            data-autofocus
            type="search"
            autoComplete="off"
            placeholder="Ex.: sensores, alerta, contato"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="search-scroll-hint" aria-hidden="true">
          <span>Role para consultar todos os resultados</span>
          <i>↓</i>
        </div>
        <div
          className="search-results"
          role="region"
          tabIndex="0"
          aria-label="Resultados da busca. Use a rolagem para ver todos."
        >
          {results.length ? (
            results.map((page) => (
              <a
                href={page.path}
                key={page.path}
                onClick={() => {
                  close();
                  onNavigate();
                }}
              >
                <strong>{page.label}</strong>
                <span>{page.description}</span>
              </a>
            ))
          ) : (
            <p>Nenhum resultado encontrado.</p>
          )}
        </div>
      </Translated>
    </Dialog>
  );

  return (
    <>
      <Translated>
        <li>
          <button
            className="search-button"
            type="button"
            aria-label="Buscar no site"
            onClick={() => setOpen(true)}
          >
            <svg
              className="nav-control-icon"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <span>Buscar</span>
          </button>
        </li>
      </Translated>
      {dialog}
    </>
  );
}
