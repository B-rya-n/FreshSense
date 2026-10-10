import { Translated } from "../traducoes/I18nContext";
import { useI18n } from "../traducoes/useI18n";

export function LoadingState({ label = "conteúdo" }) {
  const { t } = useI18n();

  return (
    <Translated>
      <div className="loading-state" role="status" aria-live="polite">
        <span className="loading-state-spinner" aria-hidden="true" />
        <div>
          <strong>
            {t("Carregando")} {t(label)}
          </strong>
          <span>Preparando a próxima visão da operação…</span>
        </div>
      </div>
    </Translated>
  );
}
