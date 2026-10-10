import { useMemo, useState } from "react";
import { Translated } from "../../../traducoes/I18nContext";
import { RiskAnalysisWorkspace } from "./RiskAnalysisWorkspace";
import { RiskExecutiveSummary } from "./RiskExecutiveSummary";
import { RiskHistory } from "./RiskHistory";
import { RiskInputPanel } from "./RiskInputPanel";
import { RiskMethodology } from "./RiskMethodology";
import {
  applyMitigations,
  calculateRisk,
  initialRiskValues,
  normalizeRiskValues,
  validateRiskValues,
} from "../modelo/riskModel";

export function RiskSimulator() {
  const [values, setValues] = useState(initialRiskValues);
  const [analyzedValues, setAnalyzedValues] = useState(initialRiskValues);
  const [errors, setErrors] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedControls, setSelectedControls] = useState([]);

  const normalizedValues = useMemo(() => normalizeRiskValues(values), [values]);
  const result = useMemo(() => calculateRisk(analyzedValues), [analyzedValues]);
  const mitigatedValues = useMemo(
    () => applyMitigations(analyzedValues, selectedControls),
    [analyzedValues, selectedControls],
  );
  const mitigatedResult = useMemo(
    () => calculateRisk(mitigatedValues),
    [mitigatedValues],
  );
  const dirty =
    JSON.stringify(normalizedValues) !== JSON.stringify(analyzedValues);

  function update(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors.length) setErrors([]);
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validateRiskValues(normalizedValues);
    setErrors(nextErrors);
    if (nextErrors.length) return;

    const nextResult = calculateRisk(normalizedValues);
    setAnalyzedValues(normalizedValues);
    setSelectedControls([]);
    setHistory((current) =>
      [
        {
          id: `${Date.now()}-${nextResult.score}`,
          time: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          values: normalizedValues,
          result: nextResult,
        },
        ...current,
      ].slice(0, 5),
    );
  }

  function reset() {
    setValues(initialRiskValues);
    setAnalyzedValues(initialRiskValues);
    setErrors([]);
    setSelectedControls([]);
  }

  function toggleControl(controlId) {
    setSelectedControls((current) =>
      current.includes(controlId)
        ? current.filter((id) => id !== controlId)
        : [...current, controlId],
    );
  }

  function loadHistory(item) {
    setValues(item.values);
    setAnalyzedValues(item.values);
    setErrors([]);
    setSelectedControls([]);
  }

  return (
    <Translated>
      <div className="risk-page" id="simulador-risco">
        <section className="risk-context-strip">
          <div className="container">
            <div>
              <span className="risk-context-icon" aria-hidden="true">
                i
              </span>
              <p>
                <strong>Modelo indicativo e transparente.</strong> O resultado
                compara cenários e medidas de controle; a decisão sobre o lote
                permanece sob responsabilidade técnica qualificada.
              </p>
            </div>
            <a href="#metodologia-risco">Ver metodologia</a>
          </div>
        </section>

        <section className="section risk-workspace-section">
          <div className="container">
            <div className="risk-workspace-intro reveal">
              <div>
                <span className="tag">Análise orientada por evidências</span>
                <h2>
                  Estruture o cenário, investigue o risco e compare respostas
                </h2>
              </div>
              <p>
                Entradas, diagnóstico, incerteza e tratamento permanecem
                separados. Isso torna o resultado compreensível, comparável e
                mais fácil de revisar antes de uma decisão operacional.
              </p>
            </div>

            <div className="risk-primary-grid reveal">
              <RiskInputPanel
                values={values}
                errors={errors}
                dirty={dirty}
                onUpdate={update}
                onSubmit={submit}
                onReset={reset}
              />
              <RiskExecutiveSummary result={result} dirty={dirty} />
            </div>

            <RiskAnalysisWorkspace
              result={result}
              mitigatedResult={mitigatedResult}
              selectedControls={selectedControls}
              onToggleControl={toggleControl}
            />

            <RiskHistory history={history} onLoad={loadHistory} />
          </div>
        </section>

        <section className="section risk-methodology-section">
          <div className="container">
            <RiskMethodology />
          </div>
        </section>
      </div>
    </Translated>
  );
}
