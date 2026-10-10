import { riskLabels } from "../../../dados/lotData";
import { Translated } from "../../../traducoes/I18nContext";
import { useI18n } from "../../../traducoes/useI18n";

export function RescueScenarioGrid({ scenarios, selectedId, onSelect }) {
  const { language, t } = useI18n();
  const locale = language === "pt" ? "pt-BR" : language;

  return (
    <Translated>
      <div className="rescue-scenario-grid" aria-label="Cenários de resposta">
        {scenarios.map((scenario) => (
          <article
            className={`rescue-scenario-card ${
              selectedId === scenario.id ? "is-selected" : ""
            }`}
            key={scenario.id}
          >
            <header>
              <div>
                <span>{t(scenario.eyebrow)}</span>
                <h3>{t(scenario.title)}</h3>
              </div>
              {scenario.recommended && <strong>Recomendado</strong>}
            </header>
            <p>{t(scenario.description)}</p>

            <dl className="rescue-scenario-metrics">
              <div>
                <dt>Resposta</dt>
                <dd>{scenario.responseMinutes} min</dd>
              </div>
              <div>
                <dt>Perda projetada</dt>
                <dd>{scenario.lossPercent.toLocaleString(locale)}%</dd>
              </div>
              <div>
                <dt>Risco após ação</dt>
                <dd className={`risk-${scenario.riskAfter}`}>
                  {t(riskLabels[scenario.riskAfter])}
                </dd>
              </div>
              <div>
                <dt>Carga preservada</dt>
                <dd>+{scenario.savedWeight.toLocaleString(locale)} kg</dd>
              </div>
            </dl>

            <ul>
              {scenario.reasons.map((reason) => (
                <li key={reason}>{t(reason)}</li>
              ))}
            </ul>

            <button
              type="button"
              aria-pressed={selectedId === scenario.id}
              onClick={() => onSelect(scenario.id)}
            >
              {selectedId === scenario.id
                ? "Plano selecionado"
                : "Selecionar plano"}
            </button>
          </article>
        ))}
      </div>
    </Translated>
  );
}
