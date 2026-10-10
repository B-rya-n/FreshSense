import { openSiteCopilot } from "../../../componentes/copilot/siteCopilotEvents";
import { Translated } from "../../../traducoes/I18nContext";

const capabilities = [
  [
    "01",
    "Entende o contexto",
    "Adapta sugestões à página e à decisão em análise.",
  ],
  [
    "02",
    "Conecta os módulos",
    "Direciona para monitoramento, lotes ou cenários.",
  ],
  [
    "03",
    "Orienta o próximo passo",
    "Transforma dúvidas em caminhos objetivos dentro da plataforma.",
  ],
];

export function CopilotSpotlight() {
  return (
    <Translated>
      <section
        className="section home-copilot-spotlight"
        aria-labelledby="home-copilot-title"
      >
        <div className="container home-copilot-grid">
          <div className="home-copilot-copy reveal">
            <span className="home-copilot-tag">
              <i aria-hidden="true">✦</i> Nova inteligência FreshSense
            </span>
            <h2 id="home-copilot-title">
              Um Copilot para toda a jornada operacional.
            </h2>
            <p>
              Pergunte, compreenda o contexto e avance para a ferramenta certa.
              O FreshSense Copilot agora conecta conteúdo, monitoramento, lotes
              e análise de cenários em uma experiência contínua.
            </p>

            <div className="home-copilot-capabilities">
              {capabilities.map(([number, title, description]) => (
                <article key={number}>
                  <span>{number}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="home-copilot-actions">
              <button type="button" onClick={openSiteCopilot}>
                <span aria-hidden="true">✦</span> Conversar com o Copilot
              </button>
              <a href="/fase5">
                Ver análise operacional <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div
            className="home-copilot-preview reveal"
            aria-label="Prévia do FreshSense Copilot"
          >
            <header>
              <div>
                <span aria-hidden="true">✦</span>
                <div>
                  <small>Assistente inteligente</small>
                  <strong>FreshSense Copilot</strong>
                </div>
              </div>
              <i>
                <span aria-hidden="true" /> Disponível
              </i>
            </header>
            <div className="home-copilot-preview-context">
              <span>Contexto reconhecido</span>
              <strong>Visão geral da plataforma</strong>
            </div>
            <div className="home-copilot-preview-body">
              <p className="home-copilot-preview-question">
                Preciso investigar um lote com desvio. Por onde começo?
              </p>
              <div className="home-copilot-preview-answer">
                <span aria-hidden="true">✦</span>
                <div>
                  <small>Rota recomendada</small>
                  <strong>Comece pela busca de lotes.</strong>
                  <p>
                    Localize o lote por código, produto ou condição. Depois,
                    confronte o histórico com os sinais atuais da Central.
                  </p>
                  <div>
                    <span>01 · Buscar lote</span>
                    <span>02 · Revisar telemetria</span>
                    <span>03 · Avaliar resposta</span>
                  </div>
                </div>
              </div>
            </div>
            <footer>
              <span>
                <i aria-hidden="true" /> Contexto da página
              </span>
              <span>Orientação imediata</span>
            </footer>
          </div>
        </div>
      </section>
    </Translated>
  );
}
