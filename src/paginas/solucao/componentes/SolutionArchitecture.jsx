import { useState } from "react";
import { Translated } from "../../../traducoes/I18nContext";

const layers = [
  {
    id: "field",
    number: "01",
    label: "Conectar",
    title: "Telemetria e registros de campo",
    description:
      "A camada de entrada recebe sinais dos ambientes monitorados e registros informados pela operação.",
    receives: "Temperatura, umidade, bateria, posição e apontamentos",
    checks: "Identidade, intervalo, faixa física e continuidade",
    delivers: "Evento validado e associado à origem",
    example: "Sensor FS-024 · Câmara 02 · 08:42:15",
  },
  {
    id: "context",
    number: "02",
    label: "Contextualizar",
    title: "Lotes, produtos, locais e processos",
    description:
      "O evento técnico ganha significado operacional ao ser vinculado ao lote, à etapa da cadeia e às condições esperadas.",
    receives: "Evento validado, cadastro do lote, rota e produto",
    checks: "Vínculo temporal, localização e regra aplicável",
    delivers: "Histórico rastreável e pronto para consulta",
    example: "LT-1042 · Laticínios · Expedição refrigerada",
  },
  {
    id: "decision",
    number: "03",
    label: "Decidir",
    title: "Regras, risco e prioridade operacional",
    description:
      "As leituras são avaliadas com duração, severidade e impacto potencial para reduzir ruído e organizar a resposta operacional.",
    receives: "Contexto do lote, limites e histórico recente",
    checks: "Persistência do desvio, criticidade e confiabilidade",
    delivers: "Prioridade, justificativa e ação recomendada",
    example: "Prioridade alta · confirmar carga em até 15 min",
  },
  {
    id: "experience",
    number: "04",
    label: "Comprovar",
    title: "Ação humana e evidência auditável",
    description:
      "A interface leva a ocorrência ao responsável, registra a resposta e preserva o histórico necessário para análise posterior.",
    receives: "Alerta priorizado, procedimento e responsável",
    checks: "Prazo, status, justificativa e encerramento",
    delivers: "Ação documentada e aprendizado operacional",
    example: "Ocorrência reconhecida · contenção registrada",
  },
];

export function SolutionArchitecture() {
  const [activeLayer, setActiveLayer] = useState(layers[0].id);
  const layer =
    layers.find((candidate) => candidate.id === activeLayer) ?? layers[0];

  function handleLayerKey(event, index) {
    const direction = ["ArrowRight", "ArrowDown"].includes(event.key)
      ? 1
      : ["ArrowLeft", "ArrowUp"].includes(event.key)
        ? -1
        : 0;
    if (!direction) return;

    event.preventDefault();
    const nextLayer =
      layers[(index + direction + layers.length) % layers.length];
    setActiveLayer(nextLayer.id);
    requestAnimationFrame(() =>
      document.getElementById(`solution-layer-tab-${nextLayer.id}`)?.focus(),
    );
  }

  return (
    <Translated>
      <section className="section solution-architecture-section">
        <div className="container">
          <div className="section-title reveal">
            <span className="tag">Informação confiável por design</span>
            <h2>Do dado bruto à evidência que sustenta uma decisão</h2>
            <p>
              A FreshSense preserva contexto em cada camada. Veja como os dados
              são recebidos, validados, relacionados e convertidos em uma ação
              verificável.
            </p>
          </div>

          <div className="solution-architecture reveal">
            <div
              className="solution-layer-list"
              role="tablist"
              aria-label="Camadas da arquitetura"
            >
              {layers.map((item, index) => (
                <button
                  type="button"
                  role="tab"
                  id={`solution-layer-tab-${item.id}`}
                  aria-selected={activeLayer === item.id}
                  aria-controls={`solution-layer-${item.id}`}
                  tabIndex={activeLayer === item.id ? 0 : -1}
                  className={activeLayer === item.id ? "active" : ""}
                  onClick={() => setActiveLayer(item.id)}
                  onKeyDown={(event) => handleLayerKey(event, index)}
                  key={item.id}
                >
                  <span>{item.number}</span>
                  <strong>{item.label}</strong>
                  <i aria-hidden="true">→</i>
                </button>
              ))}
            </div>

            <article
              className="solution-layer-panel"
              id={`solution-layer-${layer.id}`}
              role="tabpanel"
              aria-labelledby={`solution-layer-tab-${layer.id}`}
              key={layer.id}
            >
              <span className="solution-stage-label">
                Camada {layer.number} · {layer.label}
              </span>
              <h3>{layer.title}</h3>
              <p>{layer.description}</p>

              <dl className="solution-layer-contract">
                <div>
                  <dt>Dados recebidos</dt>
                  <dd>{layer.receives}</dd>
                </div>
                <div>
                  <dt>Controles aplicados</dt>
                  <dd>{layer.checks}</dd>
                </div>
                <div>
                  <dt>Resultado produzido</dt>
                  <dd>{layer.delivers}</dd>
                </div>
              </dl>

              <div className="solution-layer-example">
                <span>Exemplo de saída</span>
                <strong>{layer.example}</strong>
              </div>
            </article>
          </div>

          <div className="solution-standards-grid">
            <article className="solution-standard-card reveal">
              <div>
                <span className="solution-standard-mark">GS1</span>
                <span className="solution-standard-type">Rastreabilidade</span>
              </div>
              <h3>Rastreabilidade descreve eventos, não apenas produtos</h3>
              <p>
                O modelo segue conceitualmente as dimensões do EPCIS: o quê,
                quando, onde, por quê e, quando aplicável, como aconteceu.
              </p>
              <a
                href="https://ref.gs1.org/standards/epcis/2.0.1/"
                target="_blank"
                rel="noreferrer"
              >
                Consultar GS1 EPCIS 2.0.1 <span aria-hidden="true">↗</span>
              </a>
            </article>

            <article className="solution-standard-card reveal">
              <div>
                <span className="solution-standard-mark">HACCP</span>
                <span className="solution-standard-type">
                  Controle preventivo
                </span>
              </div>
              <h3>Monitorar, corrigir, verificar e manter registros</h3>
              <p>
                A jornada de monitorar, detectar desvios, executar ação
                corretiva e verificar registros é alinhada aos princípios do
                Codex/FAO.
              </p>
              <a
                href="https://www.fao.org/good-hygiene-practices-haccp-toolbox/haccp/step-9-monitoring-critical-limits/en"
                target="_blank"
                rel="noreferrer"
              >
                Consultar orientação FAO/HACCP <span aria-hidden="true">↗</span>
              </a>
            </article>
          </div>

          <p className="solution-standards-note reveal">
            As referências orientam a arquitetura de informação e os fluxos de
            controle. A conformidade depende da configuração, da validação e dos
            procedimentos adotados por cada organização.
          </p>
        </div>
      </section>
    </Translated>
  );
}
