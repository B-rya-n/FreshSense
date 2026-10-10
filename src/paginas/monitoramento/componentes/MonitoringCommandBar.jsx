import { useId } from "react";
import { Translated } from "../../../traducoes/I18nContext";
import { LIVE_UPDATE_INTERVALS } from "../modelo/monitoringModel";

export function MonitoringCommandBar({
  monitoring,
  facilities,
  facilityId,
  onFacilityChange,
  timeWindow,
  onTimeWindowChange,
  onOpenCopilot,
}) {
  const facilityIdControl = useId();
  const timeWindowControl = useId();
  const refreshRateControl = useId();

  return (
    <Translated>
      <header className="monitoring-command-bar">
        <div className="monitoring-command-copy">
          <a className="monitoring-back-link" href="/">
            <span aria-hidden="true">←</span> Voltar ao início
          </a>
          <div className="monitoring-title-row">
            <span className="monitoring-product-mark">FS</span>
            <div>
              <span className="monitoring-overline">
                Inteligência para cadeia fria
              </span>
              <h1>Controle operacional em tempo real</h1>
            </div>
          </div>
          <p>
            Condições ambientais, lotes, unidades, rotas e incidentes conectados
            em uma única visão de resposta.
          </p>
          <div className="monitoring-system-status">
            <span className="system-chip healthy">
              Fluxo de telemetria ativo
            </span>
            <span className="system-chip simulation">
              Ambiente de exploração · dados de exemplo
            </span>
          </div>
        </div>

        <div className="monitoring-live-summary">
          <div
            className={`live-connection ${monitoring.isPaused ? "paused" : ""}`}
            aria-live="polite"
          >
            <span className="live-dot" aria-hidden="true" />
            <strong>{monitoring.isPaused ? "Pausado" : "Ao vivo"}</strong>
          </div>
          <p>
            Última sincronização
            <time dateTime={monitoring.updatedAt.toISOString()}>
              {monitoring.updatedAt.toLocaleTimeString("pt-BR")}
            </time>
          </p>
          <span>Telemetria #{monitoring.tick}</span>
        </div>

        <div className="monitoring-global-filters" aria-label="Filtros globais">
          <label htmlFor={facilityIdControl}>
            <span>Unidade operacional</span>
            <select
              id={facilityIdControl}
              value={facilityId}
              onChange={(event) => onFacilityChange(event.target.value)}
            >
              <option value="todas">Todas as unidades</option>
              {facilities.map((facility) => (
                <option value={facility.id} key={facility.id}>
                  {facility.name}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor={timeWindowControl}>
            <span>Janela do gráfico</span>
            <select
              id={timeWindowControl}
              value={timeWindow}
              onChange={(event) =>
                onTimeWindowChange(Number(event.target.value))
              }
            >
              <option value="10">Últimos 10 ciclos</option>
              <option value="20">Últimos 20 ciclos</option>
              <option value="30">Últimos 30 ciclos</option>
            </select>
          </label>

          <label htmlFor={refreshRateControl}>
            <span>Atualização automática</span>
            <select
              id={refreshRateControl}
              value={monitoring.refreshRate}
              onChange={(event) =>
                monitoring.setRefreshRate(Number(event.target.value))
              }
            >
              {LIVE_UPDATE_INTERVALS.map((interval) => (
                <option key={interval} value={interval}>
                  A cada {interval / 1000}s
                </option>
              ))}
            </select>
          </label>

          <div className="monitoring-command-actions">
            <a className="rescue-launch" href="/resgate-carga">
              Resgate de carga
            </a>
            <button
              type="button"
              className="copilot-launch"
              onClick={onOpenCopilot}
            >
              <span aria-hidden="true">✦</span>
              Abrir Copilot
            </button>
            <button type="button" onClick={monitoring.refreshNow}>
              Atualizar agora
            </button>
            <button
              type="button"
              className="primary"
              onClick={monitoring.togglePaused}
            >
              {monitoring.isPaused ? "Retomar fluxo" : "Pausar fluxo"}
            </button>
          </div>
        </div>
      </header>
    </Translated>
  );
}
