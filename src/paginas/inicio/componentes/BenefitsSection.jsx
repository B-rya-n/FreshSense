import { Translated } from "../../../traducoes/I18nContext";
import { benefits } from "../dados/homeContent";

export function BenefitsSection() {
  return (
    <Translated>
      <section className="section surface">
        <div className="container">
          <div className="section-title centered reveal">
            <span className="tag">Valor operacional</span>
            <h2>Da visibilidade à ação, sem perder contexto</h2>
          </div>
          <div className="benefit-grid">
            {benefits.map((benefit) => (
              <article className="card reveal" key={benefit.label}>
                <span className="tag">{benefit.label}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Translated>
  );
}
