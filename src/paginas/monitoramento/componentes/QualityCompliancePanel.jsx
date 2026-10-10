import { Translated } from "../../../traducoes/I18nContext";
import { formatValue } from "../modelo/monitoringFormat";

export function QualityCompliancePanel({ compliance, distribution, metrics }) {
  const total =
    distribution.stable + distribution.attention + distribution.critical;
  const stablePercentage = (distribution.stable / total) * 100;
  const attentionPercentage = (distribution.attention / total) * 100;
  const criticalPercentage = (distribution.critical / total) * 100;

  return (
    <Translated>
      <article className="enterprise-panel quality-compliance-panel">
        <div className="enterprise-panel-heading">
          <div>
            <span className="monitoring-overline">Governança operacional</span>
            <h3>Qualidade e conformidade</h3>
            <p>
              Indicadores para auditoria, rastreabilidade e controle de
              excursões térmicas.
            </p>
          </div>
          <span className="compliance-score">
            <strong>{formatValue(metrics.coldChainCompliance)}%</strong>
            <small>conformidade geral</small>
          </span>
        </div>

        <div className="quality-compliance-layout">
          <div className="quality-distribution-area">
            <div className="quality-total">
              <strong>{total}</strong>
              <span>Lotes ativos avaliados</span>
            </div>
            <div
              className="quality-distribution-bar"
              role="img"
              aria-label={`${distribution.stable} lotes estáveis, ${distribution.attention} em atenção e ${distribution.critical} críticos`}
            >
              <i className="stable" style={{ width: `${stablePercentage}%` }} />
              <i
                className="attention"
                style={{ width: `${attentionPercentage}%` }}
              />
              <i
                className="critical"
                style={{ width: `${criticalPercentage}%` }}
              />
            </div>
            <ul className="quality-legend">
              <li>
                <i className="stable" />
                <span>
                  Estáveis <small>{formatValue(stablePercentage)}%</small>
                </span>
                <strong>{distribution.stable} lotes</strong>
              </li>
              <li>
                <i className="attention" />
                <span>
                  Em atenção <small>{formatValue(attentionPercentage)}%</small>
                </span>
                <strong>{distribution.attention} lotes</strong>
              </li>
              <li>
                <i className="critical" />
                <span>
                  Críticos <small>{formatValue(criticalPercentage)}%</small>
                </span>
                <strong>{distribution.critical} lotes</strong>
              </li>
            </ul>
          </div>

          <div className="compliance-control-grid">
            <div>
              <span>Continuidade dos dados</span>
              <strong>{formatValue(compliance.dataContinuity)}%</strong>
              <small>Meta operacional ≥ 99%</small>
            </div>
            <div>
              <span>Lotes documentados</span>
              <strong>{formatValue(compliance.documentedLots)}%</strong>
              <small>Evidências completas por lote</small>
            </div>
            <div
              className={compliance.excursionMinutes > 18 ? "attention" : ""}
            >
              <span>Excursão térmica acumulada</span>
              <strong>{compliance.excursionMinutes} min</strong>
              <small>Janela operacional analisada</small>
            </div>
            <div>
              <span>Auditorias em aberto</span>
              <strong>{compliance.openAudits}</strong>
              <small>Planos de ação acompanhados</small>
            </div>
            <div>
              <span>Calibrações próximas</span>
              <strong>{compliance.calibrationDue}</strong>
              <small>Dispositivos para revisão</small>
            </div>
            <div>
              <span>Eficiência energética</span>
              <strong>{formatValue(metrics.energyEfficiency)}%</strong>
              <small>Refrigeração versus referência</small>
            </div>
          </div>
        </div>
      </article>
    </Translated>
  );
}
