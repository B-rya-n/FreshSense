import { Translated } from "../../../traducoes/I18nContext";
import { useI18n } from "../../../traducoes/useI18n";

const statusLabels = {
  stable: "Conforme",
  warning: "Acompanhamento",
  critical: "Ocorrência crítica",
};

export function PassportTimeline({ events }) {
  const { language, t } = useI18n();
  const locale = language === "pt" ? "pt-BR" : language;
  const visibleEvents = events.toReversed().slice(0, 7);

  return (
    <Translated>
      <section className="passport-timeline" aria-labelledby="passportTrail">
        <div className="passport-section-heading">
          <div>
            <span>Trilha de evidências</span>
            <h3 id="passportTrail">Eventos mais recentes</h3>
          </div>
          <strong>{events.length} registros</strong>
        </div>

        <ol>
          {visibleEvents.map((event) => (
            <li key={event.id}>
              <i className={`status-${event.status}`} aria-hidden="true" />
              <time dateTime={event.timestamp}>
                <strong>
                  {new Date(event.timestamp).toLocaleDateString(locale, {
                    day: "2-digit",
                    month: "short",
                  })}
                </strong>
                <span>
                  {new Date(event.timestamp).toLocaleTimeString(locale, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </time>
              <div>
                <span>{t(statusLabels[event.status])}</span>
                <strong>{t(event.label)}</strong>
                <small>
                  {t(event.location)} · {t(event.stage)}
                </small>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </Translated>
  );
}
