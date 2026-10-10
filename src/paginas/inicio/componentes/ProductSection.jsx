import { Translated } from "../../../traducoes/I18nContext";
import { productModules } from "../dados/homeContent";

export function ProductSection() {
  return (
    <Translated>
      <section className="section product-section">
        <div className="container product-grid">
          <div className="section-title reveal">
            <span className="tag">Controle operacional unificado</span>
            <h2>
              Uma única visão para saber o que aconteceu e o que fazer agora
            </h2>
            <p>
              A plataforma conecta sinais ambientais ao contexto de cada lote.
              Assim, a equipe deixa de interpretar dados isolados e passa a
              trabalhar com prioridades, responsáveis e evidências claras.
            </p>
          </div>
          <div
            className="product-map reveal"
            aria-label="Módulos da plataforma"
          >
            {productModules.map((module) => (
              <article
                className={module.featured ? "active" : undefined}
                key={module.number}
              >
                <span>{module.number}</span>
                <strong>{module.title}</strong>
                <p>{module.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Translated>
  );
}
