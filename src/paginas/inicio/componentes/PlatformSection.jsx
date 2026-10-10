import { Translated } from "../../../traducoes/I18nContext";
import { platformAreas } from "../dados/homeContent";

export function PlatformSection() {
  return (
    <Translated>
      <section className="section dark">
        <div className="container">
          <div className="section-title centered reveal">
            <span className="tag">Conheça a FreshSense</span>
            <h2>Entenda o desafio, a tecnologia e o impacto na operação</h2>
            <p>
              Explore a visão completa da plataforma e descubra como diferentes
              equipes podem atuar com mais velocidade, consistência e evidência.
            </p>
          </div>
          <div className="flow-grid">
            {platformAreas.map((area) => (
              <a className="card reveal" href={area.href} key={area.number}>
                <span className="tag">{area.number}</span>
                <h3>{area.title}</h3>
                <p>{area.text}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </Translated>
  );
}
