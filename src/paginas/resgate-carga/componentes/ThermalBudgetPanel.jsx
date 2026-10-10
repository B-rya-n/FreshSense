import { useMemo, useState } from "react";
import { riskLabels } from "../../../dados/lotData";
import { Translated } from "../../../traducoes/I18nContext";
import { useI18n } from "../../../traducoes/useI18n";
import { calculateThermalBudget } from "../modelo/rescueModel";

function formatHours(hours) {
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }

  return `${hours}h`;
}

export function ThermalBudgetPanel({
  lot,
  lots,
  budget,
  selectedLotId,
  onSelectLot,
}) {
  const { language, t } = useI18n();
  const locale = language === "pt" ? "pt-BR" : language;
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("todos");
  const lotBudgets = useMemo(
    () =>
      lots
        .map((item) => ({ lot: item, budget: calculateThermalBudget(item) }))
        .toSorted(
          (left, right) =>
            left.budget.remainingPercent - right.budget.remainingPercent,
        ),
    [lots],
  );
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const visibleLots = lotBudgets.filter(({ lot: item }) => {
    const matchesRisk = riskFilter === "todos" || item.risk === riskFilter;
    const matchesQuery = [item.id, item.product, item.category, item.location]
      .join(" ")
      .toLocaleLowerCase("pt-BR")
      .includes(normalizedQuery);

    return matchesRisk && matchesQuery;
  });

  return (
    <Translated>
      <div className="thermal-budget-workspace">
        <section className="thermal-lot-browser">
          <header>
            <div>
              <span className="rescue-overline">Carteira térmica</span>
              <h3>Selecione o lote que deseja analisar</h3>
              <p>
                Os lotes são ordenados pelo menor saldo térmico, para destacar
                primeiro os que exigem resposta mais rápida.
              </p>
            </div>
            <strong>
              {visibleLots.length} {t("lotes exibidos")}
            </strong>
          </header>

          <div className="thermal-lot-filters">
            <label>
              <span>Buscar lote</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Código, produto ou localização"
              />
            </label>
            <label>
              <span>Filtrar por risco</span>
              <select
                value={riskFilter}
                onChange={(event) => setRiskFilter(event.target.value)}
              >
                <option value="todos">Todos os riscos</option>
                <option value="alto">Risco alto</option>
                <option value="medio">Risco médio</option>
                <option value="baixo">Risco baixo</option>
              </select>
            </label>
          </div>

          <div className="thermal-lot-grid" aria-label="Lotes disponíveis">
            {visibleLots.map(({ lot: item, budget: itemBudget }) => (
              <button
                type="button"
                className={`thermal-lot-card risk-${item.risk}`}
                aria-pressed={selectedLotId === item.id}
                onClick={() => onSelectLot(item.id)}
                key={item.id}
              >
                <span className="thermal-lot-card-copy">
                  <span>
                    <strong>{item.id}</strong>
                    <i>
                      {t("Risco")}: {t(riskLabels[item.risk])}
                    </i>
                  </span>
                  <b>{t(item.product)}</b>
                  <small>
                    {item.temperature.toLocaleString(locale)} °C ·{" "}
                    {item.location}
                  </small>
                </span>
                <span className="thermal-lot-card-budget">
                  <strong>{itemBudget.remainingPercent}%</strong>
                  <small>saldo</small>
                </span>
                <span className="thermal-lot-card-bar" aria-hidden="true">
                  <i style={{ width: `${itemBudget.remainingPercent}%` }} />
                </span>
              </button>
            ))}

            {!visibleLots.length && (
              <p className="thermal-lot-empty" role="status">
                Nenhum lote corresponde à busca e ao risco selecionados.
              </p>
            )}
          </div>
        </section>

        <div className="thermal-selected-heading" aria-live="polite">
          <div>
            <span className="rescue-overline">Análise selecionada</span>
            <h3>
              {lot.id} · {t(lot.product)}
            </h3>
            <p>
              {lot.origin} → {lot.destination} · {t("Sensor")} {lot.sensorId}
            </p>
          </div>
          <span className={`rescue-risk-badge risk-${lot.risk}`}>
            {t("Risco")}: {t(riskLabels[lot.risk])}
          </span>
        </div>

        <div className="thermal-budget-layout">
          <section
            className={`thermal-gauge-card urgency-${budget.urgency}`}
            key={`gauge-${lot.id}`}
          >
            <div
              className="thermal-gauge"
              style={{ "--remaining": `${budget.remainingPercent * 3.6}deg` }}
              role="img"
              aria-label={`${budget.remainingPercent}% ${t("de orçamento térmico restante")}`}
            >
              <div>
                <strong>{budget.remainingPercent}%</strong>
                <span>saldo térmico</span>
              </div>
            </div>
            <div>
              <span className="rescue-overline">Capacidade de recuperação</span>
              <h3>
                {t("Janela estimada de")} {formatHours(budget.shelfLifeHours)}{" "}
                {t("para ação")}
              </h3>
              <p>
                {budget.deviation > 0
                  ? `${budget.deviation.toLocaleString(locale)} °C ${t("fora da faixa por aproximadamente")} ${budget.exposureMinutes} min.`
                  : t(
                      "Temperatura atual dentro da faixa operacional configurada.",
                    )}
              </p>
            </div>
          </section>

          <section className="thermal-budget-details" key={`details-${lot.id}`}>
            <header>
              <div>
                <span className="rescue-overline">Leitura explicável</span>
                <h3>Como o orçamento foi calculado</h3>
              </div>
              <span className={`thermal-urgency urgency-${budget.urgency}`}>
                {t("Urgência")}: {t(budget.urgency)}
              </span>
            </header>

            <div className="thermal-budget-bar" aria-hidden="true">
              <span style={{ width: `${budget.spentPercent}%` }} />
            </div>
            <div className="thermal-budget-legend">
              <span>
                {budget.spentPercent}% {t("consumido")}
              </span>
              <strong>
                {budget.remainingPercent}% {t("disponível")}
              </strong>
            </div>

            <dl className="thermal-factor-grid">
              <div>
                <dt>Desvio atual</dt>
                <dd>{budget.deviation.toLocaleString(locale)} °C</dd>
                <small>
                  Faixa de {lot.minTemperature} a {lot.maxTemperature} °C
                </small>
              </div>
              <div>
                <dt>Exposição estimada</dt>
                <dd>{budget.exposureMinutes} min</dd>
                <small>Com base no histórico simulado do sensor</small>
              </div>
              <div>
                <dt>Carga térmica</dt>
                <dd>{budget.degreeHours.toLocaleString(locale)} °C·h</dd>
                <small>Limite de {budget.toleranceDegreeHours} °C·h</small>
              </div>
              <div>
                <dt>Vida útil de referência</dt>
                <dd>{formatHours(budget.baselineHours)}</dd>
                <small>
                  {t("Perfil da categoria")} {t(lot.category)}
                </small>
              </div>
            </dl>

            <p className="thermal-method-note">
              Estimativa demonstrativa baseada em categoria, faixa configurada,
              intensidade do desvio e tempo de exposição. A liberação sanitária
              continua dependendo da inspeção de qualidade.
            </p>
          </section>
        </div>
      </div>
    </Translated>
  );
}
