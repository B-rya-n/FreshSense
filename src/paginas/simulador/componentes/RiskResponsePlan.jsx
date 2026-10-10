import { Translated } from "../../../traducoes/I18nContext";
import { mitigationOptions } from "../modelo/riskModel";

export function RiskResponsePlan({
  result,
  mitigatedResult,
  selectedControls,
  onToggleControl,
}) {
  const reduction = Math.max(result.score - mitigatedResult.score, 0);

  return (
    <Translated>
      <div className="risk-response-layout">
        <section className="risk-mitigation-section">
          <div className="risk-section-heading">
            <div>
              <span className="risk-kicker">Comparação de controles</span>
              <h3>Avalie respostas antes de aplicá-las</h3>
            </div>
          </div>
          <p>
            Selecione ações para projetar o risco residual e comparar
            alternativas. O cenário analisado permanece preservado para revisão.
          </p>
          <div className="risk-control-list">
            {mitigationOptions.map((control) => {
              const checked = selectedControls.includes(control.id);
              return (
                <label className={checked ? "selected" : ""} key={control.id}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleControl(control.id)}
                  />
                  <span>
                    <strong>{control.label}</strong>
                    <small>{control.description}</small>
                  </span>
                </label>
              );
            })}
          </div>

          <div className="risk-residual-comparison" aria-live="polite">
            <div>
              <span>Risco atual</span>
              <strong>{result.score}</strong>
              <small>{result.level.label}</small>
            </div>
            <i aria-hidden="true">→</i>
            <div>
              <span>Risco residual</span>
              <strong>{mitigatedResult.score}</strong>
              <small>{mitigatedResult.level.label}</small>
            </div>
            <p>
              {selectedControls.length ? (
                <>
                  Variação projetada: <strong>{reduction} pontos</strong>.
                </>
              ) : (
                "Selecione pelo menos uma medida para comparar."
              )}
            </p>
          </div>
        </section>

        <section className="risk-action-plan-section">
          <div className="risk-section-heading">
            <div>
              <span className="risk-kicker">Sequência recomendada</span>
              <h3>Plano de resposta</h3>
            </div>
          </div>
          <ol className="risk-action-list">
            {result.actionPlan.map((action) => (
              <li key={action.order}>
                <span>{action.order}</span>
                <div>
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                  <small>
                    {action.owner} · {action.deadline}
                  </small>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </Translated>
  );
}
