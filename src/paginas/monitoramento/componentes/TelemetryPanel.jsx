import { useId, useMemo } from "react";
import { Translated } from "../../../traducoes/I18nContext";
import { useI18n } from "../../../traducoes/useI18n";
import {
  formatMetric,
  formatValue,
  localeByLanguage,
} from "../modelo/monitoringFormat";
import { metricDefinitions } from "../modelo/monitoringModel";

const chart = {
  width: 900,
  height: 300,
  left: 52,
  right: 24,
  top: 24,
  bottom: 42,
};

export function TelemetryPanel({ history, selectedMetric, timeWindow }) {
  const { language, t } = useI18n();
  const locale = localeByLanguage[language] ?? localeByLanguage.pt;
  const gradientId = useId().replaceAll(":", "");
  const definition =
    metricDefinitions.find((metric) => metric.key === selectedMetric) ??
    metricDefinitions[0];
  const visibleHistory = useMemo(
    () => history.slice(-timeWindow),
    [history, timeWindow],
  );
  const values = visibleHistory.map((point) => point[definition.key]);
  const minimum = Math.min(...values, definition.target);
  const maximum = Math.max(...values, definition.target);
  const padding = Math.max((maximum - minimum) * 0.16, 1);
  const lowerBound = minimum - padding;
  const upperBound = maximum + padding;
  const range = upperBound - lowerBound;
  const plotWidth = chart.width - chart.left - chart.right;
  const plotHeight = chart.height - chart.top - chart.bottom;
  const points = values.map((value, index) => ({
    x: chart.left + (index / Math.max(values.length - 1, 1)) * plotWidth,
    y: chart.top + ((upperBound - value) / range) * plotHeight,
    value,
    point: visibleHistory[index],
  }));
  const linePoints = points.map(({ x, y }) => `${x},${y}`).join(" ");
  const areaPoints = `${chart.left},${chart.top + plotHeight} ${linePoints} ${chart.left + plotWidth},${chart.top + plotHeight}`;
  const targetY =
    chart.top + ((upperBound - definition.target) / range) * plotHeight;
  const average =
    values.reduce((total, value) => total + value, 0) / values.length;
  const current = values.at(-1);

  return (
    <Translated>
      <article className="enterprise-panel telemetry-panel">
        <div className="enterprise-panel-heading">
          <div>
            <span className="monitoring-overline">Série temporal</span>
            <h3>{t(definition.label)}</h3>
            <p>{t(definition.description)}</p>
          </div>
          <div className="telemetry-current-value">
            <span>Valor atual</span>
            <strong>{formatMetric(current, definition.unit, locale)}</strong>
          </div>
        </div>

        <div className="telemetry-chart-wrap">
          <svg
            className="telemetry-chart"
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            role="img"
            aria-label={`${t("Histórico de")} ${t(definition.label)}`}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#31c985" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#31c985" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = chart.top + plotHeight * ratio;
              const label = upperBound - range * ratio;
              return (
                <g key={ratio}>
                  <line
                    className="chart-grid-line"
                    x1={chart.left}
                    x2={chart.left + plotWidth}
                    y1={y}
                    y2={y}
                  />
                  <text className="chart-axis-label" x="4" y={y + 4}>
                    {formatValue(label, locale)}
                  </text>
                </g>
              );
            })}
            <line
              className="chart-target-line"
              x1={chart.left}
              x2={chart.left + plotWidth}
              y1={targetY}
              y2={targetY}
            />
            <text
              className="chart-target-label"
              x={chart.left + plotWidth - 4}
              y={targetY - 7}
              textAnchor="end"
            >
              Meta {formatMetric(definition.target, definition.unit, locale)}
            </text>
            <polygon points={areaPoints} fill={`url(#${gradientId})`} />
            <polyline className="chart-series-line" points={linePoints} />
            {points.map(({ x, y, value, point }, index) => (
              <g key={point.slot}>
                {point.annotation && (
                  <line
                    className="chart-annotation-line"
                    x1={x}
                    x2={x}
                    y1={chart.top}
                    y2={chart.top + plotHeight}
                  />
                )}
                <circle
                  className={
                    index === points.length - 1
                      ? "chart-point active"
                      : "chart-point"
                  }
                  cx={x}
                  cy={y}
                  r={index === points.length - 1 ? 6 : 3}
                >
                  <title>
                    Ciclo {point.cycle}:{" "}
                    {formatMetric(value, definition.unit, locale)}
                    {point.annotation ? ` · ${point.annotation}` : ""}
                  </title>
                </circle>
              </g>
            ))}
          </svg>
        </div>

        <div className="telemetry-stat-row">
          <div>
            <span>Mínimo</span>
            <strong>
              {formatMetric(Math.min(...values), definition.unit, locale)}
            </strong>
          </div>
          <div>
            <span>Média</span>
            <strong>{formatMetric(average, definition.unit, locale)}</strong>
          </div>
          <div>
            <span>Máximo</span>
            <strong>
              {formatMetric(Math.max(...values), definition.unit, locale)}
            </strong>
          </div>
          <div>
            <span>Pontos analisados</span>
            <strong>{visibleHistory.length}</strong>
          </div>
        </div>
      </article>
    </Translated>
  );
}
