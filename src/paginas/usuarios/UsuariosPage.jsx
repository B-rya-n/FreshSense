import { PageHero } from "../../componentes/PageHero";
import { ProfileJourney } from "./componentes/ProfileJourney";
import { Translated } from "../../traducoes/I18nContext";
import "./usuarios.css";

const personas = [
  {
    image: "producer",
    tag: "Origem",
    title: "Produção e cooperativas",
    text: "Registram origem, produto, faixa esperada e condição de saída para iniciar a jornada com contexto confiável.",
  },
  {
    image: "driver",
    tag: "Transporte",
    title: "Logística e torre de controle",
    text: "Acompanham rotas, exceções e prazos de resposta para intervir durante o transporte, não apenas depois da entrega.",
  },
  {
    image: "storage",
    tag: "Distribuição",
    title: "Armazéns e centros de distribuição",
    text: "Priorizam recebimento, conferência e armazenagem conforme a condição acumulada e a sensibilidade de cada lote.",
  },
  {
    image: "institution",
    tag: "Planejamento",
    title: "Abastecimento e planejamento",
    text: "Comparam disponibilidade, risco e destino para reduzir remanejamentos tardios e proteger o nível de serviço.",
  },
  {
    image: "market",
    tag: "Varejo",
    title: "Varejo e operações comerciais",
    text: "Consultam histórico de recebimento e condição para apoiar giro, priorização de estoque e tratamento de ocorrências.",
  },
  {
    image: "quality",
    tag: "Qualidade",
    title: "Qualidade e segurança dos alimentos",
    text: "Investigam excursões, verificam registros e sustentam decisões técnicas com uma trilha organizada de evidências.",
  },
  {
    image: "social",
    tag: "Sustentabilidade",
    title: "ESG e redução de perdas",
    text: "Acompanham causas recorrentes, volume potencialmente protegido e oportunidades de melhoria com metodologia transparente.",
  },
  {
    image: "integration",
    tag: "Liderança",
    title: "Gestão operacional",
    text: "Enxerga desempenho, criticidade, disponibilidade de ativos e tempos de resposta em uma visão consolidada da rede.",
    highlighted: true,
  },
];

const sharedJourney = [
  {
    number: "1",
    title: "Contextualizar",
    text: "Identidade, produto, origem, destino, condição esperada e sensor.",
  },
  {
    number: "2",
    title: "Observar",
    text: "Leituras e eventos atualizam a condição do lote ao longo da jornada.",
  },
  {
    number: "3",
    title: "Responder",
    text: "Alertas conectam criticidade, responsável e procedimento de tratamento.",
  },
  {
    number: "4",
    title: "Aprimorar",
    text: "Indicadores revelam recorrências, gargalos e oportunidades de melhoria.",
  },
];

export function UsuariosPage() {
  return (
    <Translated>
      <PageHero
        className="users-hero"
        eyebrow="Uma plataforma, decisões diferentes"
        title="Contexto compartilhado para todas as equipes que protegem o lote"
        text="Da expedição ao recebimento, a FreshSense entrega a cada perfil a visão necessária para agir — sem fragmentar dados, responsabilidades ou histórico."
      />

      <section className="section surface">
        <div className="container">
          <div className="section-title reveal">
            <span className="tag">Experiência orientada por função</span>
            <h2>A mesma verdade operacional, apresentada para cada decisão</h2>
            <p>
              Indicadores executivos, alertas em rota, condição dos ativos e
              evidências de qualidade permanecem conectados, mas ganham o nível
              de detalhe certo para cada responsabilidade.
            </p>
          </div>
          <div className="persona-grid">
            {personas.map((persona) => (
              <article
                className={`persona-card card reveal${persona.highlighted ? " persona-highlight" : ""}`}
                key={persona.title}
              >
                <div className={`persona-img ${persona.image}`} />
                <span className="tag">{persona.tag}</span>
                <h3>{persona.title}</h3>
                <p>{persona.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProfileJourney />

      <section className="section dark">
        <div className="container">
          <div className="section-title centered reveal">
            <span className="tag">Uma jornada compartilhada</span>
            <h2>Do primeiro registro à melhoria contínua</h2>
          </div>
          <div className="flow-grid">
            {sharedJourney.map((step) => (
              <article className="card reveal" key={step.number}>
                <span className="tag">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Translated>
  );
}
