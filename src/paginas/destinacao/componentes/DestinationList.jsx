import { useMemo, useState } from "react";
import { Translated } from "../../../traducoes/I18nContext";
import { useI18n } from "../../../traducoes/useI18n";
import {
  advanceDestination,
  destinationStatus,
  destinationTypes,
  formatPickupDate,
  getNextDestinationStatus,
} from "../modelo/destinationModel";

const filters = [
  "todos",
  "pendente",
  "aprovada",
  "transporte",
  "concluida",
  "cancelada",
];

export function DestinationList({ destinations, onUpdate }) {
  const { language, t } = useI18n();
  const locale = language === "pt" ? "pt-BR" : language;
  const [filter, setFilter] = useState("todos");
  const [expanded, setExpanded] = useState(destinations[0]?.id ?? null);
  const visible = useMemo(
    () =>
      filter === "todos"
        ? destinations
        : destinations.filter((item) => item.status === filter),
    [destinations, filter],
  );

  function advance(item) {
    const status = getNextDestinationStatus(item.status);
    if (status) onUpdate(advanceDestination(item, status));
  }

  function cancel(item) {
    onUpdate(advanceDestination(item, "cancelada"));
  }

  return (
    <Translated>
      <article className="destination-panel destination-list-panel">
        <div className="destination-panel-heading">
          <span>Acompanhamento</span>
          <h2>Destinações registradas</h2>
          <p>Avance cada operação e mantenha um histórico auditável.</p>
        </div>

        <div className="destination-filters" aria-label="Filtrar destinações">
          {filters.map((status) => (
            <button
              key={status}
              type="button"
              className={filter === status ? "active" : ""}
              aria-pressed={filter === status}
              onClick={() => setFilter(status)}
            >
              {status === "todos" ? t("Todas") : t(destinationStatus[status])}
            </button>
          ))}
        </div>

        <div className="destination-list" aria-live="polite">
          {visible.map((item) => {
            const isExpanded = expanded === item.id;
            const upcomingStatus = getNextDestinationStatus(item.status);
            const canAdvance = Boolean(upcomingStatus);

            return (
              <article
                className={`destination-item status-${item.status}`}
                key={item.id}
              >
                <button
                  type="button"
                  className="destination-item-summary"
                  aria-expanded={isExpanded}
                  onClick={() => setExpanded(isExpanded ? null : item.id)}
                >
                  <span className="destination-status-dot" aria-hidden="true" />
                  <span>
                    <strong>
                      {t(item.product)} · {item.quantity.toLocaleString(locale)}{" "}
                      {item.unit}
                    </strong>
                    <small>
                      {item.id} · {t(destinationTypes[item.type])}
                    </small>
                  </span>
                  <em>{t(destinationStatus[item.status])}</em>
                  <b aria-hidden="true">{isExpanded ? "−" : "+"}</b>
                </button>

                {isExpanded && (
                  <div className="destination-item-details">
                    <dl>
                      <div>
                        <dt>Lote</dt>
                        <dd>{item.lotId}</dd>
                      </div>
                      <div>
                        <dt>Destino</dt>
                        <dd>{item.recipient}</dd>
                      </div>
                      <div>
                        <dt>Responsável</dt>
                        <dd>{item.responsible}</dd>
                      </div>
                      <div>
                        <dt>Data prevista</dt>
                        <dd>{formatPickupDate(item.pickupDate, locale)}</dd>
                      </div>
                    </dl>

                    {item.notes && (
                      <p className="destination-item-notes">{item.notes}</p>
                    )}

                    <div
                      className="destination-timeline"
                      aria-label={`${t("Histórico da destinação")} ${item.id}`}
                    >
                      {item.history.map((entry, index) => (
                        <div key={`${entry.status}-${entry.date}-${index}`}>
                          <i aria-hidden="true" />
                          <span>
                            <strong>
                              {t(destinationStatus[entry.status])}
                            </strong>
                            <small>{entry.date}</small>
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="destination-actions">
                      {canAdvance && (
                        <button type="button" onClick={() => advance(item)}>
                          {t("Avançar para")}{" "}
                          {t(destinationStatus[upcomingStatus])}
                        </button>
                      )}
                      {!["concluida", "cancelada"].includes(item.status) && (
                        <button
                          type="button"
                          className="cancel"
                          onClick={() => cancel(item)}
                        >
                          Cancelar operação
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}

          {!visible.length && (
            <div className="destination-empty">
              <strong>Nenhuma destinação encontrada</strong>
              <p>Altere o filtro ou registre um novo plano.</p>
            </div>
          )}
        </div>
      </article>
    </Translated>
  );
}
