import { useId, useState } from "react";
import { Translated } from "../../../traducoes/I18nContext";
import { RiskDiagnosis } from "./RiskDiagnosis";
import { RiskMatrix } from "./RiskMatrix";
import { RiskResponsePlan } from "./RiskResponsePlan";

const views = [
  { id: "diagnosis", label: "Diagnóstico" },
  { id: "matrix", label: "Matriz 5 × 5" },
  { id: "plan", label: "Plano de resposta" },
];

export function RiskAnalysisWorkspace({
  result,
  mitigatedResult,
  selectedControls,
  onToggleControl,
}) {
  const prefix = useId();
  const [activeView, setActiveView] = useState(views[0].id);

  function handleTabKey(event, index) {
    const direction = ["ArrowRight", "ArrowDown"].includes(event.key)
      ? 1
      : ["ArrowLeft", "ArrowUp"].includes(event.key)
        ? -1
        : 0;
    if (!direction) return;

    event.preventDefault();
    const nextView = views[(index + direction + views.length) % views.length];
    setActiveView(nextView.id);
    requestAnimationFrame(() =>
      document.getElementById(`${prefix}-analysis-${nextView.id}`)?.focus(),
    );
  }

  return (
    <Translated>
      <section className="risk-analysis-workspace">
        <div className="risk-analysis-header">
          <div>
            <span className="risk-kicker">Exploração do resultado</span>
            <h2>Entenda o risco antes de agir</h2>
          </div>
          <div
            className="risk-analysis-tabs"
            role="tablist"
            aria-label="Visualizações da análise de risco"
          >
            {views.map((view, index) => (
              <button
                type="button"
                role="tab"
                id={`${prefix}-analysis-${view.id}`}
                aria-selected={activeView === view.id}
                aria-controls={`${prefix}-analysis-panel`}
                tabIndex={activeView === view.id ? 0 : -1}
                className={activeView === view.id ? "active" : ""}
                onClick={() => setActiveView(view.id)}
                onKeyDown={(event) => handleTabKey(event, index)}
                key={view.id}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="risk-analysis-content"
          role="tabpanel"
          id={`${prefix}-analysis-panel`}
          aria-labelledby={`${prefix}-analysis-${activeView}`}
          key={activeView}
        >
          {activeView === "diagnosis" && <RiskDiagnosis result={result} />}
          {activeView === "matrix" && <RiskMatrix result={result} />}
          {activeView === "plan" && (
            <RiskResponsePlan
              result={result}
              mitigatedResult={mitigatedResult}
              selectedControls={selectedControls}
              onToggleControl={onToggleControl}
            />
          )}
        </div>
      </section>
    </Translated>
  );
}
