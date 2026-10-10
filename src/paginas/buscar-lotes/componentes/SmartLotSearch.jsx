import { useDeferredValue, useId, useMemo, useState } from "react";
import { useLots } from "../../../contextos/useLots";
import { lotStages, riskLabels } from "../../../dados/lotData";
import { Translated } from "../../../traducoes/I18nContext";
import { defaultLotFilters, filterLots } from "../modelo/lotSearchData";

function LotResultCard({ lot }) {
  return (
    <article className={`lot-search-card risk-${lot.risk}`}>
      <div className="lot-search-card-heading">
        <div>
          <span className="lot-search-code">{lot.id}</span>
          <h3>{lot.product}</h3>
        </div>
        <span className={`lot-risk-badge risk-${lot.risk}`}>
          <i aria-hidden="true" /> Risco {riskLabels[lot.risk]}
        </span>
      </div>
      <dl className="lot-search-details">
        <div>
          <dt>Categoria</dt>
          <dd>{lot.category}</dd>
        </div>
        <div>
          <dt>Temperatura</dt>
          <dd>{lot.temperature.toLocaleString("pt-BR")} °C</dd>
        </div>
        <div>
          <dt>Etapa da cadeia</dt>
          <dd>{lot.stage}</dd>
        </div>
        <div>
          <dt>Origem</dt>
          <dd>{lot.origin}</dd>
        </div>
      </dl>
    </article>
  );
}

export function SmartLotSearch() {
  const { lots } = useLots();
  const [filters, setFilters] = useState(defaultLotFilters);
  const deferredQuery = useDeferredValue(filters.query);
  const searchId = useId();
  const categoryId = useId();
  const riskId = useId();
  const temperatureId = useId();
  const stageId = useId();
  const categories = useMemo(
    () => [...new Set(lots.map((lot) => lot.category))].sort(),
    [lots],
  );
  const results = useMemo(
    () =>
      filterLots(lots, {
        query: deferredQuery,
        category: filters.category,
        risk: filters.risk,
        temperature: filters.temperature,
        stage: filters.stage,
      }),
    [
      deferredQuery,
      filters.category,
      filters.risk,
      filters.stage,
      filters.temperature,
      lots,
    ],
  );

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function clearFilters() {
    setFilters(defaultLotFilters);
  }

  return (
    <Translated>
      <section className="section lot-search-section">
        <div className="container">
          <div className="lot-search-context">
            <div>
              <span>Consulta operacional</span>
              <strong>
                Do código do lote ao contexto que orienta a decisão
              </strong>
            </div>
            <p>
              Combine filtros para reduzir o universo de análise e chegar
              rapidamente aos lotes que exigem atenção.
            </p>
          </div>

          <div className="lot-search-filter-panel">
            <div className="lot-search-filter-grid">
              <label className="lot-search-main-field" htmlFor={searchId}>
                <span>Buscar lote, produto ou origem</span>
                <input
                  id={searchId}
                  type="search"
                  placeholder="Ex.: tomate, LT-1042, Jundiaí..."
                  value={filters.query}
                  onChange={(event) =>
                    updateFilter("query", event.target.value)
                  }
                />
              </label>

              <label htmlFor={categoryId}>
                <span>Produto</span>
                <select
                  id={categoryId}
                  value={filters.category}
                  onChange={(event) =>
                    updateFilter("category", event.target.value)
                  }
                >
                  <option value="todos">Todos</option>
                  {categories.map((category) => (
                    <option value={category} key={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor={riskId}>
                <span>Risco</span>
                <select
                  id={riskId}
                  value={filters.risk}
                  onChange={(event) => updateFilter("risk", event.target.value)}
                >
                  <option value="todos">Todos</option>
                  {Object.entries(riskLabels).map(([risk, label]) => (
                    <option value={risk} key={risk}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor={temperatureId}>
                <span>Temperatura</span>
                <select
                  id={temperatureId}
                  value={filters.temperature}
                  onChange={(event) =>
                    updateFilter("temperature", event.target.value)
                  }
                >
                  <option value="todas">Todas</option>
                  <option value="ate5">Até 5 °C</option>
                  <option value="5a8">De 5 °C a 8 °C</option>
                  <option value="acima8">Acima de 8 °C</option>
                </select>
              </label>

              <label htmlFor={stageId}>
                <span>Etapa da cadeia</span>
                <select
                  id={stageId}
                  value={filters.stage}
                  onChange={(event) =>
                    updateFilter("stage", event.target.value)
                  }
                >
                  <option value="todas">Todas</option>
                  {lotStages.map((stage) => (
                    <option value={stage} key={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="lot-search-summary">
              <p aria-live="polite">
                <strong>{results.length}</strong>{" "}
                {results.length === 1 ? "lote encontrado" : "lotes encontrados"}
                {filters.query !== deferredQuery && (
                  <small>Atualizando resultados...</small>
                )}
              </p>
              <div className="lot-search-summary-actions">
                <a href="/gestao-lotes">Gerenciar lotes</a>
                <button type="button" onClick={clearFilters}>
                  <span aria-hidden="true">↻</span> Limpar filtros
                </button>
              </div>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="lot-search-results" aria-live="polite">
              {results.map((lot) => (
                <LotResultCard key={lot.id} lot={lot} />
              ))}
            </div>
          ) : (
            <div className="lot-search-empty" aria-live="polite">
              <span aria-hidden="true">⌕</span>
              <h2>Nenhum lote encontrado</h2>
              <p>
                Ajuste os filtros ou pesquise por outro código, produto ou
                origem.
              </p>
              <button type="button" onClick={clearFilters}>
                Mostrar todos os lotes
              </button>
            </div>
          )}
        </div>
      </section>
    </Translated>
  );
}
