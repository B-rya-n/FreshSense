import { Translated } from "../../../traducoes/I18nContext";
import { operationalSteps } from "../dados/homeContent";

export function OperationsSection() {
  return (
    <Translated>
      <section className="section surface">
        <div className="container">
          <div className="section-title reveal">
            <span className="tag">Ciclo de controle</span>
            <h2>Uma rotina contínua para transformar sinais em melhoria</h2>
          </div>
          <div className="operations-grid">
            {operationalSteps.map((step) => (
              <article className="card reveal" key={step.title}>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Translated>
  );
}
