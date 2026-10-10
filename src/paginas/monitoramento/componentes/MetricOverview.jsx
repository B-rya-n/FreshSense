import { Translated } from "../../../traducoes/I18nContext";
import { useI18n } from "../../../traducoes/useI18n";
import { formatMetric, localeByLanguage } from "../modelo/monitoringFormat";
import { metricDefinitions } from "../modelo/monitoringModel";

function MetricCard({ definition, value, previousValue, selected, onSelect }) {
  const { language, t } = useI18n();
  const locale = localeByLanguage[language] ?? localeByLanguage.pt;
  const difference = value - previousValue;
  const improved = definition.inverse ? difference < 0 : difference > 0;
  const onTarget = definition.inverse
    ? value <= definition.target
    : value >= definition.target;
  const progress = definition.inverse
    ? Math.min((definition.target / Math.max(value, 0.1)) * 100, 100)
    : Math.min((value / definition.maximum) * 100, 100);

  return (
    <button
      type="button"
      className={`enterprise-metric-card ${selected ? "selected" : ""}`}
      aria-pressed={selected}
      aria-label={`${t("Abrir análise de")} ${t(definition.label)}`}
      onClick={() => onSelect(definition.key)}
    >
      <span className="enterprise-metric-topline">
        <span>{t(definition.label)}</span>
        <i className={onTarget ? "healthy" : "attention"}>
          {onTarget ? t("Dentro da meta") : t("Requer atenção")}
        </i>
      </span>
      <strong>{formatMetric(value, definition.unit, locale)}</strong>
      <span className="enterprise-metric-progress" aria-hidden="true">
        <i style={{ width: `${progress}%` }} />
      </span>
      <span className="enterprise-metric-footer">
        <small>{t(definition.description)}</small>
        <b
          className={
            Math.abs(difference) < 0.1 ? "stable" : improved ? "up" : "down"
          }
        >
          {Math.abs(difference) < 0.1
            ? "—"
            : `${difference > 0 ? "+" : "−"}${formatMetric(Math.abs(difference), definition.unit, locale)}`}
        </b>
      </span>
    </button>
  );
}

export function MetricOverview({ metrics, history, selectedMetric, onSelect }) {
  const previousMetrics = history.at(-2) ?? metrics;

  return (
    <Translated>
      <section
        className="monitoring-block"
        aria-labelledby="operational-summary-title"
      >
        <div className="monitoring-block-heading compact">
          <div>
            <span className="monitoring-overline">Resumo executivo</span>
            <h3 id="operational-summary-title">
              Indicadores críticos da operação
            </h3>
          </div>
          <p>
            Selecione um indicador para investigar tendência, meta e eventos.
          </p>
        </div>
        <div className="enterprise-metrics-grid" aria-live="polite">
          {metricDefinitions.map((definition) => (
            <MetricCard
              key={definition.key}
              definition={definition}
              value={metrics[definition.key]}
              previousValue={previousMetrics[definition.key]}
              selected={selectedMetric === definition.key}
              onSelect={onSelect}
            />
          ))}
        </div>
      </section>
    </Translated>
  );
}
