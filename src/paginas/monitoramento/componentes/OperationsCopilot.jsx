import { useEffect, useMemo, useState } from "react";
import { Dialog } from "../../../componentes/Dialog";
import { Translated } from "../../../traducoes/I18nContext";
import { useI18n } from "../../../traducoes/useI18n";
import {
  answerCopilotQuestion,
  buildCopilotAnalysis,
  getCopilotPrompts,
} from "../modelo/copilotModel";

export function OperationsCopilot({ open, onClose, context }) {
  const { language, t } = useI18n();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const localizedContext = useMemo(() => {
    const localizeIncident = (incident) =>
      incident
        ? {
            ...incident,
            title: t(incident.title),
            location: t(incident.location),
            recommendation: t(incident.recommendation),
          }
        : null;

    return {
      ...context,
      facility: context.facility
        ? { ...context.facility, name: t(context.facility.name) }
        : null,
      events: context.events.map(localizeIncident),
      lots: context.lots.map((lot) => ({
        ...lot,
        product: t(lot.product),
        location: t(lot.location),
      })),
      sensors: context.sensors.map((sensor) => ({
        ...sensor,
        location: t(sensor.location),
      })),
      selectedIncident: localizeIncident(context.selectedIncident),
    };
  }, [context, t]);
  const analysis = useMemo(
    () => buildCopilotAnalysis(localizedContext, language),
    [language, localizedContext],
  );
  const prompts = useMemo(() => getCopilotPrompts(language), [language]);

  useEffect(() => {
    setMessages([]);
    setQuestion("");
  }, [context.facility?.id, context.selectedIncident?.id]);

  if (!open) return null;

  const ask = (prompt, label = prompt) => {
    const response = answerCopilotQuestion(prompt, localizedContext, language);
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-${current.length}`, question: label, response },
    ]);
    setQuestion("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedQuestion = question.trim();
    if (normalizedQuestion) ask(normalizedQuestion);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy="copilot-title"
      layerClassName="copilot-layer"
      className="copilot-drawer"
      unstyled
      as="aside"
      backdrop={
        <div
          className="copilot-backdrop"
          aria-hidden="true"
          onMouseDown={onClose}
        />
      }
    >
      <Translated>
        <header className="copilot-header">
          <div className="copilot-brand">
            <span className="copilot-mark" aria-hidden="true">
              ✦
            </span>
            <div>
              <span>Inteligência operacional</span>
              <h2 id="copilot-title">FreshSense Copilot</h2>
            </div>
          </div>
          <div className="copilot-header-actions">
            <span className="copilot-live-status">
              <i aria-hidden="true" /> Dados ao vivo
            </span>
            <button
              type="button"
              className="copilot-close"
              aria-label="Fechar FreshSense Copilot"
              onClick={onClose}
              data-autofocus
            >
              ×
            </button>
          </div>
        </header>

        <div className="copilot-context">
          <div>
            <span>Escopo analisado</span>
            <strong>{analysis.scope}</strong>
          </div>
          <div>
            <span>Atualização</span>
            <strong>{analysis.updatedAt}</strong>
          </div>
          {analysis.primaryIncident && (
            <div>
              <span>Incidente em foco</span>
              <strong>{analysis.primaryIncident.incidentId}</strong>
            </div>
          )}
        </div>

        <div className="copilot-scroll-area">
          <section className={`copilot-brief priority-${analysis.priorityKey}`}>
            <div className="copilot-priority-row">
              <span className="copilot-priority">
                Prioridade {analysis.priority}
              </span>
              <span className="copilot-confidence">
                <strong>{analysis.confidence}%</strong>
                confiança analítica
              </span>
            </div>
            <span className="copilot-section-label">Leitura executiva</span>
            <h3>{analysis.headline}</h3>
            <p>{analysis.summary}</p>
          </section>

          <section
            className="copilot-section"
            aria-labelledby="copilot-evidence-title"
          >
            <div className="copilot-section-heading">
              <div>
                <span className="copilot-section-label">Evidências</span>
                <h3 id="copilot-evidence-title">
                  Sinais considerados nesta análise
                </h3>
              </div>
              <span>{analysis.evidence.length} fontes correlacionadas</span>
            </div>
            <div className="copilot-evidence-grid">
              {analysis.evidence.map((item) => (
                <article
                  className={`copilot-evidence tone-${item.tone}`}
                  key={item.label}
                >
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            className="copilot-section"
            aria-labelledby="copilot-actions-title"
          >
            <div className="copilot-section-heading">
              <div>
                <span className="copilot-section-label">Próximas ações</span>
                <h3 id="copilot-actions-title">
                  Plano sugerido para revisão humana
                </h3>
              </div>
            </div>
            <ol className="copilot-action-list">
              {analysis.actions.map((action, index) => (
                <li key={`${action.title}-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{action.title}</strong>
                    <p>{action.detail}</p>
                    <small>
                      {action.owner} · {action.deadline}
                    </small>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section
            className="copilot-section copilot-conversation"
            aria-labelledby="copilot-conversation-title"
          >
            <div className="copilot-section-heading">
              <div>
                <span className="copilot-section-label">
                  Pergunte ao Copilot
                </span>
                <h3 id="copilot-conversation-title">
                  Explore o contexto da operação
                </h3>
              </div>
            </div>
            <div className="copilot-prompt-list">
              {prompts.map((prompt) => (
                <button
                  type="button"
                  key={prompt.id}
                  onClick={() => ask(prompt.id, prompt.label)}
                >
                  <span aria-hidden="true">↗</span> {prompt.label}
                </button>
              ))}
            </div>

            <div className="copilot-messages" aria-live="polite">
              {messages.map((message) => (
                <article className="copilot-message" key={message.id}>
                  <span className="copilot-user-question">
                    {message.question}
                  </span>
                  <div className="copilot-answer">
                    <span className="copilot-answer-mark" aria-hidden="true">
                      ✦
                    </span>
                    <div>
                      <strong>{message.response.title}</strong>
                      <p>{message.response.message}</p>
                      {!!message.response.points.length && (
                        <ul>
                          {message.response.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      )}
                      <small>
                        Fontes: {message.response.sources.join(" · ")}
                      </small>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <form className="copilot-question-form" onSubmit={handleSubmit}>
              <label htmlFor="copilot-question">
                Faça uma pergunta sobre a operação
              </label>
              <div>
                <input
                  id="copilot-question"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ex.: quais lotes exigem atenção agora?"
                  autoComplete="off"
                />
                <button type="submit" disabled={!question.trim()}>
                  Analisar <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          </section>
        </div>

        <footer className="copilot-footer">
          <span aria-hidden="true">ⓘ</span>
          <p>
            Apoio à decisão baseado nos dados visíveis. Recomendações devem ser
            revisadas pela equipe responsável antes da execução.
          </p>
        </footer>
      </Translated>
    </Dialog>
  );
}
