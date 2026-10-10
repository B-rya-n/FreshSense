import { Translated } from "../../../traducoes/I18nContext";

export function RiskExecutiveSummary({ result, dirty }) {
  return (
    <Translated>
      <aside
        className={`risk-executive-summary ${result.level.className}`}
        aria-live="polite"
      >
        <div className="risk-summary-topline">
          <span className="risk-kicker">Diagnóstico consolidado</span>
          <span className="risk-scenario-state">
            <i aria-hidden="true" />
            {dirty ? "Aguardando nova análise" : "Resultado atualizado"}
          </span>
        </div>

        <div className="risk-summary-main">
          <div
            className="risk-score-gauge"
            style={{ "--risk-score": `${result.score}%` }}
            aria-label={`Índice de risco ${result.score} de 100`}
          >
            <div>
              <span>Índice</span>
              <strong>{result.score}</strong>
              <small>/ 100</small>
            </div>
          </div>

          <div className="risk-summary-copy">
            <span className="risk-level-pill">
              <i aria-hidden="true" /> {result.level.label}
            </span>
            <h2>{result.highestFactor.label}</h2>
            <p>
              É o maior componente do cenário analisado. Janela de resposta:{" "}
              <strong>{result.decisionWindow}</strong>.
            </p>
          </div>
        </div>

        <div className="risk-summary-metrics">
          <div>
            <span>Probabilidade</span>
            <strong>{result.likelihood} / 5</strong>
            <small>Índice {result.probabilityIndex}/100</small>
          </div>
          <div>
            <span>Impacto</span>
            <strong>{result.impact} / 5</strong>
            <small>Matriz {result.matrixScore}/25</small>
          </div>
          <div>
            <span>Confiança</span>
            <strong>{result.confidence}%</strong>
            <small>Qualidade dos dados</small>
          </div>
          <div>
            <span>Faixa provável</span>
            <strong>
              {result.uncertainty.min}–{result.uncertainty.max}
            </strong>
            <small>Margem ±{result.uncertainty.margin}</small>
          </div>
        </div>

        <div className="risk-summary-footer">
          <div>
            <span>Volume potencialmente exposto</span>
            <strong>
              {result.estimatedExposure.toLocaleString("pt-BR")} kg
            </strong>
          </div>
          <div>
            <span>Parcela potencialmente evitável</span>
            <strong>
              {result.avoidableExposure.toLocaleString("pt-BR")} kg
            </strong>
          </div>
          <p>
            Estimativas indicativas para comparação. Não representam previsão de
            perda, laudo de qualidade ou decisão de liberação do lote.
          </p>
        </div>
      </aside>
    </Translated>
  );
}
