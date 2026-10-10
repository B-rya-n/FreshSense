import { Translated } from "../../../traducoes/I18nContext";

const evidence = [
  {
    value: "13,3%",
    label:
      "dos alimentos foram perdidos após a colheita e antes do varejo em 2023",
    context: "Escala global",
    detail:
      "A estimativa inclui perdas em transporte, armazenagem, processamento e distribuição — justamente onde visibilidade e resposta operacional fazem diferença.",
    source: "FAO · Indicador ODS 12.3.1",
    href: "https://www.fao.org/sustainable-development-goals-data-portal/data/indicators/1231-global-food-losses/en/",
  },
  {
    value: "526 mi t",
    label: "de alimentos são perdidos por falta de refrigeração eficaz",
    context: "Infraestrutura",
    detail:
      "A estimativa citada pela UNEP evidencia que refrigeração, transporte, energia e gestão precisam funcionar como um sistema contínuo.",
    source: "UNEP · Sustainable Cold Chains",
    href: "https://www.unep.org/topics/food-systems/food-loss-and-waste/sustainable-cold-chains",
  },
  {
    value: "8–10%",
    label:
      "das emissões globais de gases de efeito estufa estão ligadas a perdas e desperdício",
    context: "Impacto climático",
    detail:
      "Reduzir perdas preserva também os recursos incorporados em cada lote: solo, água, energia, embalagem, transporte e refrigeração.",
    source: "FAO · Food Loss & Waste",
    href: "https://www.fao.org/policy-support/policy-themes/food-loss-and-food-waste/fao-policy-series--food-loss---food-waste/en",
  },
];

export function SolutionEvidence() {
  return (
    <Translated>
      <section className="section solution-evidence-section">
        <div className="container">
          <div className="solution-evidence-intro reveal">
            <div className="section-title">
              <span className="tag">A dimensão da oportunidade</span>
              <h2>Proteger qualidade também significa preservar recursos</h2>
            </div>
            <p>
              A tecnologia não elimina sozinha as perdas de alimentos, mas pode
              ampliar a janela de intervenção. Ao conectar condições, lotes e
              responsáveis, a FreshSense ajuda a transformar ocorrências
              invisíveis em respostas coordenadas.
            </p>
          </div>

          <div className="solution-evidence-grid">
            {evidence.map((item, index) => (
              <article
                className="solution-evidence-card reveal"
                key={item.value}
              >
                <div className="solution-evidence-card-head">
                  <span className="solution-evidence-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="solution-evidence-context">
                    {item.context}
                  </span>
                </div>
                <strong className="solution-evidence-value">
                  {item.value}
                </strong>
                <h3>{item.label}</h3>
                <p>{item.detail}</p>
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.source}
                  <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>

          <p className="solution-evidence-note reveal">
            Indicadores globais de contexto. Resultados operacionais dependem do
            produto, da infraestrutura, dos processos e da implantação em cada
            organização.
          </p>
        </div>
      </section>
    </Translated>
  );
}
