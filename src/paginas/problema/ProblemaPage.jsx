import { PageHero } from "../../componentes/PageHero";
import { CauseExplorer } from "./componentes/CauseExplorer";
import { Translated } from "../../traducoes/I18nContext";
import "./problema.css";

const lossIndicators = [
  {
    value: "13,3%",
    text: "dos alimentos foram perdidos globalmente após a colheita e antes do varejo em 2023.",
    source: "Fonte: FAO · Indicador 12.3.1",
    href: "https://www.fao.org/sustainable-development-goals-data-portal/data/indicators/1231-global-food-losses/en/",
  },
  {
    value: "25,4%",
    text: "das frutas e hortaliças foram perdidas antes do varejo, a maior taxa entre os grupos de alimentos.",
    source: "Fonte: FAO · estimativa de 2023",
    href: "https://www.fao.org/sustainable-development-goals-data-portal/data/indicators/1231-global-food-losses/en/",
  },
  {
    value: "526 mi t",
    text: "de alimentos são perdidos por falta de refrigeração eficaz, segundo estimativa citada pela UNEP.",
    source: "Fonte: UNEP · Sustainable Cold Chains",
    href: "https://www.unep.org/topics/food-systems/food-loss-and-waste/sustainable-cold-chains",
  },
  {
    value: "8–10%",
    text: "das emissões globais de gases de efeito estufa estão associadas a perdas e desperdício de alimentos.",
    source: "Fonte: FAO · Food Loss & Waste",
    href: "https://www.fao.org/policy-support/policy-themes/food-loss-and-food-waste/fao-policy-series--food-loss---food-waste/en",
  },
];

const visibilityGaps = [
  {
    image: "harvest",
    label: "Origem e expedição",
    title: "O lote inicia a jornada sem uma referência confiável de condição.",
  },
  {
    image: "cold",
    label: "Armazenagem",
    title:
      "Oscilações de ambiente e falhas de equipamento passam sem contexto.",
  },
  {
    image: "route",
    label: "Rota e recebimento",
    title:
      "Atrasos e transferências encurtam a janela para preservar a qualidade.",
  },
];

const chainImpacts = [
  {
    label: "Abastecimento",
    title: "Menos produto aproveitável",
    text: "Cada perda reduz a quantidade de alimento que chega em condição adequada a mercados, serviços e comunidades.",
  },
  {
    label: "Ambiental",
    title: "Impacto incorporado",
    text: "Água, solo, energia, refrigeração, embalagem e transporte também são desperdiçados quando o produto não é aproveitado.",
  },
  {
    label: "Operacional",
    title: "Custo e resposta tardia",
    text: "Sem alerta contextualizado, aumenta o esforço para investigar, priorizar, reprogramar e tratar a ocorrência.",
  },
  {
    label: "Qualidade",
    title: "Integridade sob incerteza",
    text: "Sem histórico confiável, fica mais difícil avaliar a exposição acumulada e sustentar uma decisão técnica sobre o lote.",
  },
];

export function ProblemaPage() {
  return (
    <Translated>
      <PageHero
        className="problem-hero"
        eyebrow="O custo da falta de visibilidade"
        title="A cadeia fria se rompe nos pontos que a operação não consegue enxergar"
        text="Entre a origem e o destino, atrasos, variações térmicas e falhas de registro reduzem a janela de resposta. Sem contexto em tempo real, a equipe descobre o desvio quando a qualidade já pode estar comprometida."
      />

      <section className="section surface">
        <div className="container">
          <div
            className="stat-grid reveal"
            aria-label="Indicadores globais de perdas de alimentos"
          >
            {lossIndicators.map((indicator) => (
              <article className="card stat-card" key={indicator.value}>
                <strong>{indicator.value}</strong>
                <span>{indicator.text}</span>
                <a href={indicator.href} target="_blank" rel="noreferrer">
                  {indicator.source} <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title reveal">
            <span className="tag">Onde a visibilidade se perde</span>
            <h2>O risco cresce nos intervalos entre uma etapa e outra</h2>
            <p>
              A cadeia fria é uma sequência de responsabilidades. Quando dados,
              ativos e equipes não permanecem conectados, pequenos desvios se
              acumulam sem dono, sem prioridade e sem resposta.
            </p>
          </div>
          <div className="problem-media-grid">
            {visibilityGaps.map((gap) => (
              <article
                className={`media-card reveal ${gap.image}`}
                key={gap.label}
              >
                <div>
                  <span>{gap.label}</span>
                  <h3>{gap.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section surface">
        <div className="container impact-layout">
          <div className="section-title reveal">
            <span className="tag">Impacto em cadeia</span>
            <h2>Uma excursão não tratada afeta produto, margem e confiança</h2>
            <p>
              A falta de evidência transforma um desvio operacional em uma
              investigação lenta: equipes procuram registros, decisões são
              adiadas e o destino do lote fica mais incerto.
            </p>
          </div>
          <div className="impact-matrix reveal">
            {chainImpacts.map((impact) => (
              <article key={impact.label}>
                <span>{impact.label}</span>
                <strong>{impact.title}</strong>
                <p>{impact.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CauseExplorer />
    </Translated>
  );
}
