import { useEffect, useState } from "react";
import { Translated } from "../../../traducoes/I18nContext";
import { useI18n } from "../../../traducoes/useI18n";

const statusLabels = {
  stable: "Dentro da faixa",
  warning: "Variação detectada",
  critical: "Limite ultrapassado",
};

export function ColdChainReplay({ frames, lot }) {
  const { language, t } = useI18n();
  const locale = language === "pt" ? "pt-BR" : language;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setIsPlaying(false);
  }, [lot.id, frames.length]);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current >= frames.length - 1) {
          setIsPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, 1400);

    return () => window.clearInterval(interval);
  }, [frames.length, isPlaying]);

  const frame = frames[activeIndex];

  return (
    <Translated>
      <div className="cold-chain-replay">
        <section className="replay-stage">
          <header>
            <div>
              <span className="rescue-overline">Linha do tempo interativa</span>
              <h3>Reconstrução da jornada do lote</h3>
            </div>
            <button
              type="button"
              className="replay-play-button"
              onClick={() => {
                if (activeIndex === frames.length - 1) setActiveIndex(0);
                setIsPlaying((current) => !current);
              }}
            >
              <span aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
              {isPlaying ? "Pausar replay" : "Reproduzir jornada"}
            </button>
          </header>

          <div className="replay-route" aria-hidden="true">
            <span style={{ width: `${frame.progress}%` }} />
            {frames.slice(0, 6).map((item, index) => (
              <i
                className={index <= activeIndex ? "is-reached" : ""}
                style={{ left: `${item.progress}%` }}
                key={item.id}
              />
            ))}
          </div>

          <label className="replay-slider">
            <span>
              Evento {activeIndex + 1} de {frames.length}
            </span>
            <input
              type="range"
              min="0"
              max={frames.length - 1}
              value={activeIndex}
              onChange={(event) => {
                setActiveIndex(Number(event.target.value));
                setIsPlaying(false);
              }}
            />
          </label>

          <article className={`replay-active-event status-${frame.status}`}>
            <div className="replay-event-time">
              <strong>
                {new Date(frame.timestamp).toLocaleTimeString(locale, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </strong>
              <span>
                {new Date(frame.timestamp).toLocaleDateString(locale, {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
            <div className="replay-event-copy">
              <span>{t(statusLabels[frame.status])}</span>
              <h4>{t(frame.label)}</h4>
              <p>{t(frame.detail)}</p>
            </div>
            <dl>
              <div>
                <dt>Temperatura</dt>
                <dd>{frame.temperature.toLocaleString(locale)} °C</dd>
              </div>
              <div>
                <dt>Umidade</dt>
                <dd>{frame.humidity}%</dd>
              </div>
            </dl>
          </article>

          <div className="replay-location">
            <span aria-hidden="true">◎</span>
            <div>
              <small>Localização registrada</small>
              <strong>{t(frame.location)}</strong>
            </div>
            <span>{t(frame.stage)}</span>
          </div>
        </section>

        <aside className="replay-event-list">
          <span className="rescue-overline">Eventos registrados</span>
          <h3>Rastro operacional</h3>
          <div>
            {frames.map((item, index) => (
              <button
                type="button"
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => {
                  setActiveIndex(index);
                  setIsPlaying(false);
                }}
                key={item.id}
              >
                <i className={`status-${item.status}`} aria-hidden="true" />
                <span>
                  <strong>{t(item.label)}</strong>
                  <small>
                    {new Date(item.timestamp).toLocaleTimeString(locale, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" · "}
                    {t(item.location)}
                  </small>
                </span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </Translated>
  );
}
