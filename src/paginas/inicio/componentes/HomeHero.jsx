import { Translated } from "../../../traducoes/I18nContext";
import { LiveReading } from "./LiveReading";
import { valuePillars } from "../dados/homeContent";

export function HomeHero() {
  return (
    <Translated>
      <section className="hero home-hero">
        <div className="container hero-grid">
          <div className="hero-copy reveal">
            <span className="eyebrow">Inteligência para cadeia fria</span>
            <h1>Visibilidade para proteger cada lote, da origem ao destino</h1>
            <p className="lead-text">
              A FreshSense conecta condições ambientais, localização e histórico
              do lote em uma única operação. Detecte desvios em tempo real,
              coordene a resposta e preserve a qualidade antes que o risco se
              transforme em perda.
            </p>

            <div
              className="hero-context"
              aria-label="Diferenciais da plataforma"
            >
              {valuePillars.map((item) => (
                <article key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>

            <div className="button-row">
              <a className="btn-fresh" href="/solucao">
                Conhecer a plataforma
              </a>
              <a className="btn-outline" href="/simulador">
                Analisar um cenário
              </a>
              <a className="btn-outline" href="/publico-alvo">
                Ver para quem é
              </a>
              <a
                className="btn-outline home-pitch-link"
                href="https://youtu.be/HaJsiKlaZM0"
                target="_blank"
                rel="noreferrer"
              >
                <span aria-hidden="true">▶</span>
                Assistir ao pitch
              </a>
            </div>
          </div>

          <a
            className="home-preview reveal"
            href="/fase5"
            aria-label="Abrir Central de Monitoramento"
          >
            <div className="preview-command-bar">
              <div className="preview-title-row">
                <span className="monitoring-product-mark" aria-hidden="true">
                  FS
                </span>
                <div className="preview-head">
                  <span className="monitoring-overline">
                    Central de Monitoramento
                  </span>
                  <h2>Operação ao vivo</h2>
                </div>
              </div>
              <div className="live-connection">
                <i className="live-dot" aria-hidden="true" />
                <strong>Ao vivo</strong>
              </div>
            </div>
            <p className="preview-description">
              Condições, lotes e incidentes em uma única visão
            </p>

            <section className="monitoring-block preview-summary">
              <div className="monitoring-block-heading compact">
                <div>
                  <span className="monitoring-overline">Resumo executivo</span>
                  <h3>Indicadores críticos da operação</h3>
                </div>
              </div>
              <div className="preview-kpis">
                <div className="enterprise-metric-card selected">
                  <span className="enterprise-metric-topline">
                    <span>Temperatura</span>
                    <i className="healthy">Dentro da meta</i>
                  </span>
                  <LiveReading type="temperature" />
                  <span
                    className="enterprise-metric-progress"
                    aria-hidden="true"
                  >
                    <i style={{ width: "82%" }} />
                  </span>
                  <span className="enterprise-metric-footer">
                    <small>Condição térmica da cadeia fria</small>
                    <b className="up">+0,2</b>
                  </span>
                </div>
                <div className="enterprise-metric-card">
                  <span className="enterprise-metric-topline">
                    <span>Umidade</span>
                    <i className="healthy">Dentro da meta</i>
                  </span>
                  <LiveReading type="humidity" />
                  <span
                    className="enterprise-metric-progress"
                    aria-hidden="true"
                  >
                    <i style={{ width: "68%" }} />
                  </span>
                  <span className="enterprise-metric-footer">
                    <small>Estabilidade ambiental</small>
                    <b>—</b>
                  </span>
                </div>
                <div className="enterprise-metric-card">
                  <span className="enterprise-metric-topline">
                    <span>Lotes ativos</span>
                    <i className="healthy">Monitorados</i>
                  </span>
                  <strong>186</strong>
                  <span
                    className="enterprise-metric-progress"
                    aria-hidden="true"
                  >
                    <i style={{ width: "91%" }} />
                  </span>
                  <span className="enterprise-metric-footer">
                    <small>Cobertura da operação</small>
                    <b className="up">+4</b>
                  </span>
                </div>
              </div>
            </section>

            <section className="enterprise-panel preview-telemetry">
              <div className="enterprise-panel-heading">
                <div>
                  <span className="monitoring-overline">Série temporal</span>
                  <h3>Temperatura</h3>
                  <p>Histórico térmico consolidado da cadeia fria.</p>
                </div>
                <div className="telemetry-current-value">
                  <span>Valor atual</span>
                  <LiveReading type="temperature" />
                </div>
              </div>
              <div className="telemetry-chart-wrap">
                <svg
                  className="telemetry-chart home-preview-chart"
                  viewBox="0 0 480 150"
                  role="img"
                  aria-label="Tendência de temperatura dos últimos seis ciclos"
                >
                  <line
                    className="chart-grid-line"
                    x1="20"
                    x2="460"
                    y1="35"
                    y2="35"
                  />
                  <line
                    className="chart-grid-line"
                    x1="20"
                    x2="460"
                    y1="75"
                    y2="75"
                  />
                  <line
                    className="chart-grid-line"
                    x1="20"
                    x2="460"
                    y1="115"
                    y2="115"
                  />
                  <line
                    className="chart-target-line"
                    x1="20"
                    x2="460"
                    y1="48"
                    y2="48"
                  />
                  <text
                    className="chart-target-label"
                    x="455"
                    y="41"
                    textAnchor="end"
                  >
                    Meta 5 °C
                  </text>
                  <polyline
                    className="chart-series-line"
                    points="20,104 108,87 196,93 284,66 372,73 460,54"
                  />
                  {[
                    "20,104",
                    "108,87",
                    "196,93",
                    "284,66",
                    "372,73",
                    "460,54",
                  ].map((point, index) => {
                    const [cx, cy] = point.split(",");
                    return (
                      <circle
                        className={
                          index === 5 ? "chart-point active" : "chart-point"
                        }
                        cx={cx}
                        cy={cy}
                        r={index === 5 ? "5" : "3"}
                        key={point}
                      />
                    );
                  })}
                </svg>
              </div>
            </section>

            <section className="enterprise-panel preview-incident">
              <div className="enterprise-panel-heading">
                <div>
                  <span className="monitoring-overline">
                    Gestão de incidentes
                  </span>
                  <h3>Central de alertas operacionais</h3>
                </div>
                <div className="incident-summary">
                  <strong>1</strong>
                  <span>incidente ativo</span>
                </div>
              </div>
              <div className="incident-card">
                <div className="incident-expand-control">
                  <span
                    className="incident-severity-dot severity-alta"
                    aria-hidden="true"
                  />
                  <span className="incident-compact-copy">
                    <strong>LT-811 em atenção</strong>
                    <small>Laticínios · Limite térmico próximo</small>
                  </span>
                  <span className="incident-status severity-alta">Alta</span>
                  <span className="incident-chevron" aria-hidden="true">
                    +
                  </span>
                </div>
              </div>
            </section>

            <footer className="preview-open-central">
              <span>Explore indicadores, ativos e alertas</span>
              <strong>
                Abrir visão operacional <i aria-hidden="true">→</i>
              </strong>
            </footer>
          </a>
        </div>
      </section>
    </Translated>
  );
}
