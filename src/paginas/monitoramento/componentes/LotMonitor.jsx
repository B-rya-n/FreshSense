import { useDeferredValue, useMemo, useState } from "react";
import { lots as defaultLots, statusLabels } from "../../../dados/lotData";
import { usePersistedState } from "../../../hooks/usePersistedState";
import { Translated } from "../../../traducoes/I18nContext";
import { storageKeys } from "../../../utilitarios/browserStorage";

export function LotMonitor({ lots = defaultLots }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [status, setStatus] = useState("todos");
  const [favorites, setFavorites] = usePersistedState(
    storageKeys.favorites,
    [],
    (value) =>
      Array.isArray(value) && value.every((item) => typeof item === "string"),
  );
  const filteredLots = useMemo(
    () =>
      lots.filter((lot) => {
        const matchesStatus = status === "todos" || lot.status === status;
        const searchText =
          `${lot.id} ${lot.product} ${lot.location}`.toLowerCase();
        return (
          matchesStatus && searchText.includes(deferredQuery.toLowerCase())
        );
      }),
    [deferredQuery, lots, status],
  );

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <Translated>
      <article className="enterprise-panel lot-registry-panel">
        <div className="enterprise-panel-heading">
          <div>
            <span className="monitoring-overline">Rastreabilidade</span>
            <h3>Registro de lotes em tempo real</h3>
            <p>
              Leituras ambientais, localização, condição e favoritos da equipe.
            </p>
          </div>
          <div className="lot-panel-heading-actions">
            <span className="panel-count" aria-live="polite">
              {filteredLots.length} lotes
            </span>
            <a href="/buscar-lotes">Busca avançada</a>
            <a href="/gestao-lotes">Gerenciar</a>
          </div>
        </div>

        <div className="sensor-filter-bar lot-filter-bar">
          <label>
            <span>Buscar lote</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Código, produto ou local"
            />
          </label>
          <label>
            <span>Status do lote</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {Object.entries(statusLabels).map(([key, label]) => (
                <option value={key} key={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <span className="filter-processing">
            {query !== deferredQuery
              ? "Atualizando busca..."
              : "Filtro atualizado"}
          </span>
        </div>

        <div className="enterprise-table-wrap">
          <table className="enterprise-table lot-table">
            <thead>
              <tr>
                <th aria-label="Favorito" />
                <th>Lote / produto</th>
                <th>Localização</th>
                <th>Temperatura</th>
                <th>Umidade</th>
                <th>Condição</th>
              </tr>
            </thead>
            <tbody>
              {filteredLots.map((lot) => {
                const isFavorite = favorites.includes(lot.id);
                return (
                  <tr key={lot.id}>
                    <td>
                      <button
                        type="button"
                        className={`favorite-button ${isFavorite ? "active" : ""}`}
                        onClick={() => toggleFavorite(lot.id)}
                        aria-pressed={isFavorite}
                        aria-label={`${isFavorite ? "Remover" : "Adicionar"} ${lot.id} dos favoritos`}
                      >
                        {isFavorite ? "★" : "☆"}
                      </button>
                    </td>
                    <td>
                      <strong>{lot.id}</strong>
                      <span>{lot.product}</span>
                    </td>
                    <td>{lot.location}</td>
                    <td>
                      <strong>
                        {lot.temperature.toLocaleString("pt-BR")}°C
                      </strong>
                    </td>
                    <td>{lot.humidity}% UR</td>
                    <td>
                      <span className={`asset-status status-${lot.status}`}>
                        {statusLabels[lot.status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!filteredLots.length && (
          <p className="monitoring-empty-state">
            Nenhum lote corresponde aos filtros.
          </p>
        )}
      </article>
    </Translated>
  );
}
