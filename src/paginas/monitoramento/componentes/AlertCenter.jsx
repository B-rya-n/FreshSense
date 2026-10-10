import { useMemo, useState } from "react";
import { Translated } from "../../../traducoes/I18nContext";
import { statusLabel } from "../modelo/monitoringFormat";

const alertFilters = [
  ["todos", "Todos"],
  ["pendentes", "Pendentes"],
  ["crítica", "Críticos"],
  ["alta", "Alta prioridade"],
  ["resolvido", "Resolvidos"],
];

export function AlertCenter({
  events,
  onAcknowledge,
  onAssign,
  onResolve,
  onAnalyze,
}) {
  const [filter, setFilter] = useState("pendentes");
  const [expandedEventId, setExpandedEventId] = useState(null);
  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        if (filter === "todos") return true;
        if (filter === "pendentes") return event.status !== "resolvido";
        if (filter === "resolvido") return event.status === "resolvido";
        return event.severity === filter;
      }),
    [events, filter],
  );
  const unresolvedCount = events.filter(
    (event) => event.tone === "warning" && event.status !== "resolvido",
  ).length;

  return (
    <Translated>
      <article className="enterprise-panel alert-center-panel">
        <div className="enterprise-panel-heading">
          <div>
            <span className="monitoring-overline">Gestão de incidentes</span>
            <h3>Central de alertas operacionais</h3>
            <p>
              Contexto, severidade, recomendação e fluxo de resposta em um só
              lugar.
            </p>
          </div>
          <div className="incident-summary">
            <strong>{unresolvedCount}</strong>
            <span>incidentes ativos</span>
          </div>
        </div>

        <div className="alert-filter-tabs" aria-label="Filtrar incidentes">
          {alertFilters.map(([key, label]) => (
            <button
              type="button"
              key={key}
              className={filter === key ? "active" : ""}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="incident-list" aria-live="polite">
          {filteredEvents.map((event) => {
            const isExpanded = expandedEventId === event.id;

            return (
              <article
                className={`incident-card tone-${event.tone} status-${event.status} ${isExpanded ? "expanded" : ""}`}
                key={event.id}
              >
                <button
                  type="button"
                  className="incident-expand-control"
                  aria-expanded={isExpanded}
                  aria-controls={`incident-details-${event.id}`}
                  onClick={() =>
                    setExpandedEventId((current) =>
                      current === event.id ? null : event.id,
                    )
                  }
                >
                  <span
                    className={`incident-severity-dot severity-${event.severity}`}
                    aria-hidden="true"
                  />
                  <span className="incident-compact-copy">
                    <strong>{event.title}</strong>
                    <small>
                      {event.incidentId} · {event.location} · {event.time}
                    </small>
                  </span>
                  <span className={`incident-status status-${event.status}`}>
                    {statusLabel(event.status)}
                  </span>
                  <span className="incident-chevron" aria-hidden="true">
                    {isExpanded ? "−" : "+"}
                  </span>
                </button>

                {isExpanded && (
                  <div id={`incident-details-${event.id}`}>
                    <div className="incident-card-body">
                      <div className="incident-expanded-heading">
                        <span
                          className={`severity-badge severity-${event.severity}`}
                        >
                          {event.severity}
                        </span>
                        <p>{event.text}</p>
                      </div>
                      <dl className="incident-details">
                        <div>
                          <dt>Origem</dt>
                          <dd>{event.source}</dd>
                        </div>
                        <div>
                          <dt>Categoria</dt>
                          <dd>{event.category}</dd>
                        </div>
                        <div>
                          <dt>Responsável</dt>
                          <dd>{event.owner ?? "Não atribuído"}</dd>
                        </div>
                      </dl>
                      <div className="incident-recommendation">
                        <span>Procedimento recomendado</span>
                        <strong>{event.recommendation}</strong>
                      </div>
                    </div>
                    <div className="incident-actions">
                      <button
                        type="button"
                        className="analyze"
                        onClick={() => onAnalyze(event)}
                      >
                        <span aria-hidden="true">✦</span> Analisar com IA
                      </button>
                      <button
                        type="button"
                        disabled={
                          Boolean(event.owner) || event.status === "resolvido"
                        }
                        onClick={() => onAssign(event.id)}
                      >
                        {event.owner ? "Atribuído" : "Assumir incidente"}
                      </button>
                      <button
                        type="button"
                        disabled={
                          event.acknowledged || event.status === "resolvido"
                        }
                        onClick={() => onAcknowledge(event.id)}
                      >
                        {event.acknowledged ? "Reconhecido" : "Reconhecer"}
                      </button>
                      <button
                        type="button"
                        className="resolve"
                        disabled={event.status === "resolvido"}
                        onClick={() => onResolve(event.id)}
                      >
                        {event.status === "resolvido"
                          ? "Resolvido"
                          : "Marcar como resolvido"}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
          {!filteredEvents.length && (
            <p className="monitoring-empty-state">
              Nenhum incidente corresponde ao filtro selecionado.
            </p>
          )}
        </div>
      </article>
    </Translated>
  );
}
