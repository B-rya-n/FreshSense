import { Translated } from "../../../traducoes/I18nContext";
import { impactMetrics } from "../dados/homeContent";

export function ImpactStrip() {
  return (
    <Translated>
      <section className="impact-strip" aria-label="Indicadores FreshSense">
        <div className="container impact-strip-grid">
          {impactMetrics.map((metric) => (
            <article key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <p>{metric.text}</p>
            </article>
          ))}
        </div>
      </section>
    </Translated>
  );
}
