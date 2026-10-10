import { Translated } from "../../../traducoes/I18nContext";

export function RiskDiagnosis({ result }) {
  const thresholds = result.thresholds;

  return (
    <Translated>
      <div className="risk-diagnosis-grid">
        <section className="risk-factor-section">
          <div className="risk-section-heading">
            <div>
              <span className="risk-kicker">Composição do índice</span>
              <h3>Contribuição por fator</h3>
            </div>
            <span>pontos ponderados</span>
          </div>
          <div className="risk-factor-list">
            {result.factors.map((factor) => (
              <div className="risk-factor-row" key={factor.id}>
                <div>
                  <span>{factor.label}</span>
                  <strong>
                    {String(factor.value).replace(".", ",")} / {factor.max}
                  </strong>
                </div>
                <div className="risk-factor-track" aria-hidden="true">
                  <i style={{ width: `${factor.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="risk-threshold-section">
          <div className="risk-section-heading">
            <div>
              <span className="risk-kicker">Condições observadas</span>
              <h3>Leituras e referências</h3>
            </div>
          </div>
          <div className="risk-threshold-list">
            <article>
              <span>Temperatura</span>
              <strong>{thresholds.currentTemperature}°C</strong>
              <small>
                Perfil: {thresholds.temperature[0]}°C a{" "}
                {thresholds.temperature[1]}°C
              </small>
              <i className={thresholds.tempDeviation ? "outside" : "inside"}>
                {thresholds.tempDeviation ? "Fora da faixa" : "Dentro da faixa"}
              </i>
            </article>
            <article>
              <span>Umidade</span>
              <strong>{thresholds.currentHumidity}%</strong>
              <small>
                Perfil: {thresholds.humidity[0]}% a {thresholds.humidity[1]}%
              </small>
              <i
                className={thresholds.humidityDeviation ? "outside" : "inside"}
              >
                {thresholds.humidityDeviation
                  ? "Fora da faixa"
                  : "Dentro da faixa"}
              </i>
            </article>
            <article>
              <span>Exposição</span>
              <strong>{thresholds.currentTime} h</strong>
              <small>Janela do perfil: até {thresholds.maxTime} h</small>
              <i
                className={
                  thresholds.currentTime > thresholds.maxTime
                    ? "outside"
                    : "inside"
                }
              >
                {thresholds.currentTime > thresholds.maxTime
                  ? "Acima da janela"
                  : "Dentro da janela"}
              </i>
            </article>
            <article>
              <span>Telemetria</span>
              <strong>{result.sensor.label}</strong>
              <small>{result.coverage.label}</small>
              <i className={result.confidence >= 80 ? "inside" : "outside"}>
                Confiança {result.confidence}%
              </i>
            </article>
          </div>
        </section>
      </div>
    </Translated>
  );
}
