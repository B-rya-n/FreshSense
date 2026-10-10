import { Translated } from "../../../traducoes/I18nContext";

const phases = [
  {
    number: "01",
    label: "Diagnosticar",
    title: "Mapear o que precisa ser protegido",
    description:
      "A operação define produtos críticos, pontos de controle, rotas, ativos e responsáveis antes de configurar qualquer alerta.",
    deliverables: ["Mapa da cadeia e dos lotes", "Linha de base operacional"],
    criterion: "Escopo e responsabilidades aprovados",
  },
  {
    number: "02",
    label: "Validar",
    title: "Validar em um recorte controlado",
    description:
      "Uma rota, unidade ou categoria de produto valida sensores, qualidade dos dados, limites, notificações e procedimentos de resposta.",
    deliverables: ["Telemetria confiável", "Fluxo de incidentes testado"],
    criterion: "Dados e resposta considerados consistentes",
  },
  {
    number: "03",
    label: "Escalar",
    title: "Conectar unidades, rotas e equipes",
    description:
      "O modelo aprovado é expandido com regras por produto, perfis de acesso e integrações necessárias para a rotina.",
    deliverables: [
      "Cobertura operacional ampliada",
      "Papéis e regras padronizados",
    ],
    criterion: "Operação incorporada ao processo diário",
  },
  {
    number: "04",
    label: "Evoluir",
    title: "Revisar resultados e aperfeiçoar controles",
    description:
      "Indicadores, desvios, tempos de resposta e evidências orientam ajustes periódicos sem perder o histórico das decisões.",
    deliverables: ["Revisão de desempenho", "Plano de melhoria contínua"],
    criterion: "Ciclo de revisão e governança ativo",
  },
];

const foundations = [
  {
    title: "Pessoas",
    text: "Responsáveis, níveis de acesso e critérios claros de escalonamento.",
  },
  {
    title: "Processos",
    text: "Procedimentos de resposta, verificação, registro e encerramento.",
  },
  {
    title: "Dados",
    text: "Identidade, qualidade, contexto, retenção e rastreabilidade dos eventos.",
  },
];

export function SolutionDeployment() {
  return (
    <Translated>
      <section className="section solution-deployment-section">
        <div className="container">
          <div className="solution-deployment-heading reveal">
            <div>
              <span className="tag">Da estratégia à escala</span>
              <h2>
                Implantação orientada por risco, dados e rotina operacional
              </h2>
            </div>
            <p>
              A tecnologia gera valor quando dados confiáveis encontram
              processos claros e pessoas preparadas para responder. A adoção
              evolui por etapas, com entregas verificáveis e critérios objetivos
              para ampliar a cobertura.
            </p>
          </div>

          <div className="solution-deployment-roadmap">
            {phases.map((phase) => (
              <article
                className="solution-deployment-phase reveal"
                key={phase.number}
              >
                <div className="solution-deployment-phase-head">
                  <span>{phase.number}</span>
                  <small>{phase.label}</small>
                </div>
                <h3>{phase.title}</h3>
                <p>{phase.description}</p>
                <ul>
                  {phase.deliverables.map((deliverable) => (
                    <li key={deliverable}>{deliverable}</li>
                  ))}
                </ul>
                <footer>
                  <span>Critério de avanço</span>
                  <strong>{phase.criterion}</strong>
                </footer>
              </article>
            ))}
          </div>

          <div className="solution-deployment-bottom reveal">
            <div className="solution-deployment-foundations">
              <span className="solution-stage-label">Base de sustentação</span>
              <div>
                {foundations.map((foundation) => (
                  <article key={foundation.title}>
                    <strong>{foundation.title}</strong>
                    <p>{foundation.text}</p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="solution-deployment-cta">
              <span>Próximo passo</span>
              <h3>Explore a FreshSense a partir da sua próxima decisão</h3>
              <p>
                Acompanhe a visão operacional completa ou compare como medidas
                de controle alteram a prioridade de um cenário.
              </p>
              <div>
                <a href="/fase5">
                  Explorar a Central <i aria-hidden="true">→</i>
                </a>
                <a href="/simulador">Analisar um cenário</a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Translated>
  );
}
