import { riskLabels } from "../../../dados/lotData";
import { Translated } from "../../../traducoes/I18nContext";
import { useI18n } from "../../../traducoes/useI18n";

export function RescueDecisionHistory({ decisions }) {
  const { language, t } = useI18n();
  const locale = language === "pt" ? "pt-BR" : language;

  if (!decisions.length) return null;

  return (
    <Translated>
      <section className="rescue-decision-history">
        <header>
          <span className="rescue-overline">Auditoria da decisão</span>
          <h3>Planos já executados neste lote</h3>
        </header>
        <div>
          {decisions.map((decision) => (
            <article key={decision.id}>
              <span>{new Date(decision.createdAt).toLocaleString(locale)}</span>
              <strong>{t(decision.scenarioTitle)}</strong>
              <small>
                {t(riskLabels[decision.riskBefore])} →{" "}
                {t(riskLabels[decision.riskAfter])} · {t(decision.operator)}
              </small>
            </article>
          ))}
        </div>
      </section>
    </Translated>
  );
}
