import { useState } from "react";
import { Translated } from "../../../traducoes/I18nContext";

const stages = [
  {
    id: "capture",
    number: "01",
    label: "Capturar",
    title: "Criar uma leitura confiável da operação",
    description:
      "Sensores e registros de campo transformam o ambiente físico em eventos digitais com identidade, tempo e localização.",
    question: "A leitura é válida e pertence ao ativo correto?",
    points: [
      "Temperatura, umidade e tempo de exposição",
      "Identificação do sensor, unidade e localização",
      "Continuidade, bateria e qualidade da transmissão",
    ],
    flow: ["Sensores e rotas", "Validação contínua", "Dados confiáveis"],
    href: "/fase5",
    action: "Ver sensores na central",
    output: "Evento de telemetria validado",
  },
  {
    id: "context",
    number: "02",
    label: "Contextualizar",
    title: "Relacionar cada evento ao lote e ao processo",
    description:
      "A leitura ganha significado ao ser associada ao produto, ao lote, à origem, à rota e à etapa da cadeia.",
    question: "O que aconteceu, quando, onde e em qual etapa?",
    points: [
      "Código, produto, origem e destino do lote",
      "Momento e local exato do evento observado",
      "Histórico preservado para consulta e auditoria",
    ],
    flow: ["Evento validado", "Contexto operacional", "Trilha do lote"],
    href: "/buscar-lotes",
    action: "Localizar um lote",
    output: "Histórico rastreável por lote",
  },
  {
    id: "prioritize",
    number: "03",
    label: "Priorizar",
    title: "Transformar desvio em risco explicável",
    description:
      "Regras combinam faixa térmica, duração, confiabilidade da leitura e impacto do lote para indicar o que merece atenção primeiro.",
    question: "Qual ocorrência exige resposta primeiro — e por quê?",
    points: [
      "Limite esperado para cada tipo de produto",
      "Duração, intensidade e recorrência do desvio",
      "Peso, condição logística e impacto potencial",
    ],
    flow: ["Leitura + contexto", "Motor de regras", "Fila priorizada"],
    href: "/simulador",
    action: "Comparar um cenário de risco",
    output: "Prioridade com justificativa",
  },
  {
    id: "act",
    number: "04",
    label: "Agir",
    title: "Direcionar a equipe e registrar a decisão",
    description:
      "Alertas acionáveis conectam a prioridade ao responsável, ao procedimento recomendado e ao resultado obtido.",
    question: "Quem deve agir, em quanto tempo e com qual evidência?",
    points: [
      "Responsável e prazo para atendimento",
      "Procedimento recomendado para o cenário",
      "Histórico rastreável da ação executada",
    ],
    flow: ["Alerta priorizado", "Ação da equipe", "Resultado registrado"],
    href: "/fase5",
    action: "Abrir gestão de incidentes",
    output: "Resposta documentada e verificável",
  },
];

export function SolutionJourney() {
  const [activeStage, setActiveStage] = useState(stages[0].id);
  const stage =
    stages.find((candidate) => candidate.id === activeStage) ?? stages[0];

  function handleTabKey(event, index) {
    const direction = ["ArrowRight", "ArrowDown"].includes(event.key)
      ? 1
      : ["ArrowLeft", "ArrowUp"].includes(event.key)
        ? -1
        : 0;
    if (!direction) return;

    event.preventDefault();
    const nextStage =
      stages[(index + direction + stages.length) % stages.length];
    setActiveStage(nextStage.id);
    requestAnimationFrame(() =>
      document.getElementById(`solution-stage-tab-${nextStage.id}`)?.focus(),
    );
  }

  return (
    <Translated>
      <section className="section solution-journey-section">
        <div className="container">
          <div className="section-title reveal">
            <span className="tag">Fluxo operacional</span>
            <h2>Quatro movimentos transformam telemetria em resposta</h2>
            <p>
              Cada evento avança com identidade, contexto e responsabilidade.
              Assim, a equipe entende não apenas que algo mudou, mas por que
              importa e qual decisão precisa ser registrada.
            </p>
          </div>

          <div className="solution-journey reveal">
            <div
              className="solution-journey-tabs"
              role="tablist"
              aria-label="Etapas da solução"
            >
              {stages.map((item, index) => (
                <button
                  type="button"
                  role="tab"
                  id={`solution-stage-tab-${item.id}`}
                  aria-selected={activeStage === item.id}
                  aria-current={activeStage === item.id ? "step" : undefined}
                  aria-controls={`solution-stage-${item.id}`}
                  tabIndex={activeStage === item.id ? 0 : -1}
                  className={activeStage === item.id ? "active" : ""}
                  key={item.id}
                  onClick={() => setActiveStage(item.id)}
                  onKeyDown={(event) => handleTabKey(event, index)}
                >
                  <span>{item.number}</span>
                  <strong>{item.label}</strong>
                </button>
              ))}
            </div>

            <article
              className="solution-journey-panel"
              id={`solution-stage-${stage.id}`}
              role="tabpanel"
              aria-labelledby={`solution-stage-tab-${stage.id}`}
              key={stage.id}
            >
              <div className="solution-journey-copy">
                <span className="solution-stage-label">
                  Etapa {stage.number} · {stage.label}
                </span>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
                <div className="solution-stage-question">
                  <span>Pergunta operacional</span>
                  <strong>{stage.question}</strong>
                </div>
                <ul>
                  {stage.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <a href={stage.href}>
                  {stage.action} <i aria-hidden="true">→</i>
                </a>
              </div>

              <div
                className="solution-journey-flow"
                aria-label={`Fluxo da etapa ${stage.label}`}
              >
                {stage.flow.map((item, index) => (
                  <div key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{item}</strong>
                    {index < stage.flow.length - 1 && (
                      <i aria-hidden="true">→</i>
                    )}
                  </div>
                ))}
                <div className="solution-flow-output">
                  <span>Saída da etapa</span>
                  <strong>{stage.output}</strong>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </Translated>
  );
}
