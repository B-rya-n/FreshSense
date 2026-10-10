import { useId, useState } from "react";
import { RiskFormField as Field } from "../../../componentes/FormField";
import { Translated } from "../../../traducoes/I18nContext";
import {
  coverageProfiles,
  foodProfiles,
  historyProfiles,
  packagingProfiles,
  sensorProfiles,
  stageProfiles,
} from "../modelo/riskModel";

const steps = [
  { id: "lot", number: "01", label: "Lote" },
  { id: "exposure", number: "02", label: "Exposição" },
  { id: "controls", number: "03", label: "Controles" },
];

function SelectOptions({ profiles }) {
  return (
    <Translated>
      {Object.entries(profiles).map(([key, profile]) => (
        <option key={key} value={key}>
          {profile.label}
        </option>
      ))}
    </Translated>
  );
}

export function RiskInputPanel({
  values,
  errors,
  dirty,
  onUpdate,
  onSubmit,
  onReset,
}) {
  const prefix = useId();
  const [activeStep, setActiveStep] = useState(0);
  const food = foodProfiles[values.produto] ?? foodProfiles.outros;

  function handleStepKey(event, index) {
    const direction = ["ArrowRight", "ArrowDown"].includes(event.key)
      ? 1
      : ["ArrowLeft", "ArrowUp"].includes(event.key)
        ? -1
        : 0;
    if (!direction) return;

    event.preventDefault();
    const nextIndex = (index + direction + steps.length) % steps.length;
    setActiveStep(nextIndex);
    requestAnimationFrame(() =>
      document.getElementById(`${prefix}-step-${steps[nextIndex].id}`)?.focus(),
    );
  }

  return (
    <Translated>
      <form className="risk-input-panel" onSubmit={onSubmit} noValidate>
        <div className="risk-panel-heading">
          <div>
            <span className="risk-kicker">Configuração do cenário</span>
            <h2>Dados do lote</h2>
          </div>
          <span className={`risk-draft-state ${dirty ? "dirty" : ""}`}>
            <i aria-hidden="true" />
            {dirty ? "Alterações não analisadas" : "Cenário analisado"}
          </span>
        </div>

        <div
          className="risk-stepper"
          role="tablist"
          aria-label="Etapas de configuração do risco"
        >
          {steps.map((step, index) => (
            <button
              type="button"
              role="tab"
              id={`${prefix}-step-${step.id}`}
              aria-selected={activeStep === index}
              aria-current={activeStep === index ? "step" : undefined}
              aria-controls={`${prefix}-panel-${step.id}`}
              tabIndex={activeStep === index ? 0 : -1}
              className={activeStep === index ? "active" : ""}
              onClick={() => setActiveStep(index)}
              onKeyDown={(event) => handleStepKey(event, index)}
              key={step.id}
            >
              <span>{step.number}</span>
              <strong>{step.label}</strong>
            </button>
          ))}
        </div>

        <div
          className="risk-input-step"
          role="tabpanel"
          id={`${prefix}-panel-${steps[activeStep].id}`}
          aria-labelledby={`${prefix}-step-${steps[activeStep].id}`}
          key={steps[activeStep].id}
        >
          {activeStep === 0 && (
            <div className="risk-field-grid">
              <Field
                id={`${prefix}-product`}
                label="Tipo de alimento"
                hint="Seleciona o perfil de sensibilidade e as referências configuradas."
              >
                <select
                  id={`${prefix}-product`}
                  value={values.produto}
                  onChange={(event) => onUpdate("produto", event.target.value)}
                >
                  <SelectOptions profiles={foodProfiles} />
                </select>
              </Field>
              <Field
                id={`${prefix}-stage`}
                label="Etapa da cadeia"
                hint="Contextualiza a exposição operacional do lote."
              >
                <select
                  id={`${prefix}-stage`}
                  value={values.etapa}
                  onChange={(event) => onUpdate("etapa", event.target.value)}
                >
                  <SelectOptions profiles={stageProfiles} />
                </select>
              </Field>
              <Field
                id={`${prefix}-weight`}
                label="Peso do lote (kg)"
                hint="Utilizado para estimar a dimensão do impacto."
              >
                <input
                  id={`${prefix}-weight`}
                  type="number"
                  min="1"
                  max="50000"
                  step="10"
                  value={values.peso}
                  onChange={(event) => onUpdate("peso", event.target.value)}
                />
              </Field>
              <Field
                id={`${prefix}-shelf-life`}
                label={
                  <>
                    Vida útil remanescente: <strong>{values.vidaUtil}%</strong>
                  </>
                }
                hint="Percentual informado pela operação; não é estimado pelo modelo."
              >
                <input
                  id={`${prefix}-shelf-life`}
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={values.vidaUtil}
                  onChange={(event) => onUpdate("vidaUtil", event.target.value)}
                />
              </Field>
            </div>
          )}

          {activeStep === 1 && (
            <div className="risk-field-grid">
              <Field
                id={`${prefix}-temperature`}
                label="Temperatura observada (°C)"
                hint={
                  <>
                    Faixa de referência configurada: {food.temp[0]}°C a{" "}
                    {food.temp[1]}°C.
                  </>
                }
              >
                <input
                  id={`${prefix}-temperature`}
                  type="number"
                  min="-10"
                  max="40"
                  step="0.1"
                  value={values.temperatura}
                  onChange={(event) =>
                    onUpdate("temperatura", event.target.value)
                  }
                />
              </Field>
              <Field
                id={`${prefix}-humidity`}
                label="Umidade observada (%)"
                hint={
                  <>
                    Faixa de referência configurada: {food.humidity[0]}% a{" "}
                    {food.humidity[1]}%.
                  </>
                }
              >
                <input
                  id={`${prefix}-humidity`}
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={values.umidade}
                  onChange={(event) => onUpdate("umidade", event.target.value)}
                />
              </Field>
              <Field
                id={`${prefix}-time`}
                label="Tempo de exposição (h)"
                hint={
                  <>
                    Janela de referência configurada: até {food.maxTime} horas.
                  </>
                }
              >
                <input
                  id={`${prefix}-time`}
                  type="number"
                  min="0.5"
                  max="240"
                  step="0.5"
                  value={values.tempo}
                  onChange={(event) => onUpdate("tempo", event.target.value)}
                />
              </Field>
              <Field
                id={`${prefix}-delay`}
                label="Atraso adicional (h)"
                hint="Tempo não planejado além da janela operacional."
              >
                <input
                  id={`${prefix}-delay`}
                  type="number"
                  min="0"
                  max="72"
                  step="0.5"
                  value={values.atraso}
                  onChange={(event) => onUpdate("atraso", event.target.value)}
                />
              </Field>
            </div>
          )}

          {activeStep === 2 && (
            <div className="risk-field-grid">
              <Field
                id={`${prefix}-packaging`}
                label="Integridade da embalagem"
                hint="Condição visual informada no ponto de controle."
              >
                <select
                  id={`${prefix}-packaging`}
                  value={values.embalagem}
                  onChange={(event) =>
                    onUpdate("embalagem", event.target.value)
                  }
                >
                  <SelectOptions profiles={packagingProfiles} />
                </select>
              </Field>
              <Field
                id={`${prefix}-history`}
                label="Histórico térmico recente"
                hint="Recorrência de desvios observada no mesmo lote."
              >
                <select
                  id={`${prefix}-history`}
                  value={values.historico}
                  onChange={(event) =>
                    onUpdate("historico", event.target.value)
                  }
                >
                  <SelectOptions profiles={historyProfiles} />
                </select>
              </Field>
              <Field
                id={`${prefix}-sensor`}
                label="Condição do sensor"
                hint="Afeta o risco observado e a confiança do diagnóstico."
              >
                <select
                  id={`${prefix}-sensor`}
                  value={values.sensor}
                  onChange={(event) => onUpdate("sensor", event.target.value)}
                >
                  <SelectOptions profiles={sensorProfiles} />
                </select>
              </Field>
              <Field
                id={`${prefix}-coverage`}
                label="Cobertura dos dados"
                hint="Quanto da janela foi efetivamente observado."
              >
                <select
                  id={`${prefix}-coverage`}
                  value={values.cobertura}
                  onChange={(event) =>
                    onUpdate("cobertura", event.target.value)
                  }
                >
                  <SelectOptions profiles={coverageProfiles} />
                </select>
              </Field>
            </div>
          )}
        </div>

        <div className="risk-form-errors" role="alert" aria-live="assertive">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>

        <div className="risk-form-actions">
          <button
            type="button"
            className="risk-secondary-button"
            onClick={onReset}
          >
            Restaurar cenário
          </button>
          <div>
            {activeStep > 0 && (
              <button
                type="button"
                className="risk-secondary-button"
                onClick={() => setActiveStep((current) => current - 1)}
              >
                Voltar
              </button>
            )}
            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                className="risk-primary-button"
                onClick={() => setActiveStep((current) => current + 1)}
              >
                Continuar <span aria-hidden="true">→</span>
              </button>
            ) : (
              <button type="submit" className="risk-primary-button">
                Executar análise <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </Translated>
  );
}
