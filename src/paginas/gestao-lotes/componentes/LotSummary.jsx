import { Translated } from "../../../traducoes/I18nContext";

export function LotSummary({ total, stable, attention, critical }) {
  const metrics = [
    { label: "Total cadastrado", value: total, tone: "" },
    { label: "Estáveis", value: stable, tone: "stable" },
    { label: "Em atenção", value: attention, tone: "attention" },
    { label: "Críticos", value: critical, tone: "critical" },
  ];

  return (
    <Translated>
      <div className="lot-management-stats" aria-label="Resumo dos lotes">
        {metrics.map((metric) => (
          <article className={metric.tone || undefined} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>
    </Translated>
  );
}
