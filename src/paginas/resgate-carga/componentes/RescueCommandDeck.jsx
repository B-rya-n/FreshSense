import { riskLabels } from "../../../dados/lotData";
import { Translated } from "../../../traducoes/I18nContext";
import { useI18n } from "../../../traducoes/useI18n";

export function RescueCommandDeck({ lots, lot, onChange }) {
  const { language, t } = useI18n();
  const locale = language === "pt" ? "pt-BR" : language;

  return (
    <Translated>
      <div className="rescue-command-deck">
        <div className="rescue-lot-selector">
          <label htmlFor="rescue-lot">
            <span>Lote em análise</span>
            <select
              id="rescue-lot"
              value={lot.id}
              onChange={(event) => onChange(event.target.value)}
            >
              {lots.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.id} · {t(item.product)} · {t("Risco")}:{" "}
                  {t(riskLabels[item.risk])}
                </option>
              ))}
            </select>
          </label>
          <span className={`rescue-risk-badge risk-${lot.risk}`}>
            {t("Risco")}: {t(riskLabels[lot.risk])}
          </span>
        </div>

        <dl className="rescue-lot-summary">
          <div>
            <dt>Carga</dt>
            <dd>{lot.weight.toLocaleString(locale)} kg</dd>
          </div>
          <div>
            <dt>Leitura atual</dt>
            <dd>{lot.temperature.toLocaleString(locale)} °C</dd>
          </div>
          <div>
            <dt>Faixa ideal</dt>
            <dd>
              {lot.minTemperature}–{lot.maxTemperature} °C
            </dd>
          </div>
          <div>
            <dt>Sensor</dt>
            <dd>{lot.sensorId}</dd>
          </div>
        </dl>

        <div className="rescue-command-links">
          <a href="/gestao-lotes">Gerenciar lotes</a>
          <a href={`/destinacao?lote=${encodeURIComponent(lot.id)}`}>
            Planejar destinação
          </a>
          <a href="/fase5">Abrir monitoramento</a>
        </div>
      </div>
    </Translated>
  );
}
