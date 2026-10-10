import { useState } from "react";
import { Translated } from "../../../traducoes/I18nContext";

const causes = {
  temperatura: [
    "Excursão de temperatura",
    "Intensidade e duração determinam a urgência da resposta.",
    "Condição térmica",
    "Uma leitura fora da faixa só ganha significado quando é analisada com duração, produto, etapa da cadeia e confiabilidade do sensor.",
  ],
  umidade: [
    "Umidade fora do perfil",
    "O efeito varia conforme produto, embalagem e ambiente.",
    "Equilíbrio ambiental",
    "Umidade inadequada pode afetar perda de massa, textura, condensação e conservação. A resposta precisa respeitar a referência de cada produto.",
  ],
  rota: [
    "Exposição logística",
    "Atrasos e transferências reduzem a margem para intervenção.",
    "Tempo e localização",
    "Paradas, abertura de portas e mudanças de veículo importam porque alteram o tempo de exposição e o ponto em que a equipe ainda pode agir.",
  ],
};

export function CauseExplorer() {
  const [active, setActive] = useState("temperatura");
  const cause = causes[active];

  return (
    <Translated>
      <section className="section dark">
        <div className="container problem-split">
          <div className="section-title reveal">
            <span className="tag">Da leitura ao contexto</span>
            <h2>
              O problema não é apenas detectar o desvio. É entendê-lo a tempo.
            </h2>
            <p>
              Dados isolados geram ruído. A operação precisa saber qual lote foi
              afetado, por quanto tempo, em que local e com qual impacto
              potencial para coordenar uma resposta proporcional.
            </p>
            <div className="button-row">
              <a className="btn-fresh" href="/solucao">
                Conhecer a plataforma
              </a>
            </div>
          </div>
          <div className="cause-list reveal">
            {Object.entries(causes).map(([key, value]) => (
              <button
                key={key}
                type="button"
                className={`cause-item ${active === key ? "active" : ""}`}
                aria-pressed={active === key}
                onClick={() => setActive(key)}
              >
                <strong>{value[0]}</strong>
                <span>{value[1]}</span>
              </button>
            ))}
            <div className="cause-detail" aria-live="polite">
              <span>{cause[2]}</span>
              <p>{cause[3]}</p>
            </div>
          </div>
        </div>
      </section>
    </Translated>
  );
}
