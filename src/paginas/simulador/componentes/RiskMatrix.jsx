import { Translated } from "../../../traducoes/I18nContext";

const scaleLabels = ["Muito baixo", "Baixo", "Moderado", "Alto", "Muito alto"];

function cellLevel(score) {
  if (score <= 4) return "low";
  if (score <= 9) return "medium";
  if (score <= 16) return "high";
  return "critical";
}

export function RiskMatrix({ result }) {
  return (
    <Translated>
      <div className="risk-matrix-layout">
        <div className="risk-matrix-copy">
          <span className="risk-kicker">Probabilidade × impacto</span>
          <h3>Posição atual: {result.matrixScore} de 25</h3>
          <p>
            A matriz cruza a probabilidade estimada com a dimensão potencial do
            impacto para tornar a prioridade comparável entre cenários.
          </p>
          <dl>
            <div>
              <dt>Probabilidade</dt>
              <dd>{scaleLabels[result.likelihood - 1]}</dd>
            </div>
            <div>
              <dt>Impacto</dt>
              <dd>{scaleLabels[result.impact - 1]}</dd>
            </div>
            <div>
              <dt>Classificação</dt>
              <dd>{result.level.label}</dd>
            </div>
          </dl>
        </div>

        <div className="risk-matrix-wrap">
          <span className="risk-matrix-y">Probabilidade</span>
          <div
            className="risk-matrix"
            role="grid"
            aria-label="Matriz de risco 5 por 5"
          >
            {[5, 4, 3, 2, 1].map((likelihood) =>
              [1, 2, 3, 4, 5].map((impact) => {
                const score = likelihood * impact;
                const current =
                  likelihood === result.likelihood && impact === result.impact;
                return (
                  <div
                    role="gridcell"
                    className={`risk-matrix-cell ${cellLevel(score)} ${current ? "current" : ""}`}
                    aria-label={`Probabilidade ${likelihood}, impacto ${impact}, nível ${score}${current ? ", cenário atual" : ""}`}
                    key={`${likelihood}-${impact}`}
                  >
                    <span>{score}</span>
                    {current && <strong>Atual</strong>}
                  </div>
                );
              }),
            )}
          </div>
          <span className="risk-matrix-x">Impacto →</span>
        </div>
      </div>
    </Translated>
  );
}
