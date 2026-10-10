import { riskLabels, statusLabels } from "../../../dados/lotData";
import { Translated } from "../../../traducoes/I18nContext";
import { useI18n } from "../../../traducoes/useI18n";
import { PassportQrCode } from "./PassportQrCode";
import { PassportTimeline } from "./PassportTimeline";

export function PassportDocument({
  passport,
  shareUrl,
  feedback,
  onCopy,
  onShare,
  onPrint,
}) {
  const { language } = useI18n();
  const locale = language === "pt" ? "pt-BR" : language;
  const { lot, quality, thermalBudget, route, availability, custody } =
    passport;
  const formattedDate = new Date(passport.updatedAt).toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Translated>
      <div className="passport-result">
        <div className="passport-actions" aria-label="Ações do passaporte">
          <div>
            <span>Passaporte selecionado</span>
            <strong>{passport.certificateId}</strong>
          </div>
          <div>
            <button type="button" onClick={onCopy}>
              <span aria-hidden="true">⧉</span>
              Copiar link
            </button>
            <button type="button" onClick={onShare}>
              <span aria-hidden="true">↗</span>
              Compartilhar
            </button>
            <button className="primary" type="button" onClick={onPrint}>
              <span aria-hidden="true">▣</span>
              Imprimir / salvar PDF
            </button>
          </div>
          {feedback && <p role="status">{feedback}</p>}
        </div>

        <article className="passport-document" id="digital-passport">
          <header className="passport-document-header">
            <div className="passport-brand-block">
              <span className="passport-brand-mark" aria-hidden="true">
                FS
              </span>
              <div>
                <span>FreshSense Verified</span>
                <strong>Passaporte Digital do Lote</strong>
              </div>
            </div>
            <div className="passport-document-meta">
              <span>Certificado</span>
              <strong>{passport.certificateId}</strong>
              <small>Versão {passport.version}</small>
            </div>
          </header>

          <section className="passport-identity">
            <div className="passport-title-block">
              <span>Registro rastreável</span>
              <h2>{lot.product}</h2>
              <p>
                Lote <strong>{lot.id}</strong> · {lot.category}
              </p>
              <div className="passport-tags">
                <span className={`risk-${lot.risk}`}>
                  Risco {riskLabels[lot.risk]}
                </span>
                <span>{statusLabels[lot.status]}</span>
                <span>{lot.stage}</span>
              </div>
            </div>

            <div className={`passport-verdict tone-${quality.tone}`}>
              <span className="passport-verdict-icon" aria-hidden="true">
                {quality.code === "approved"
                  ? "✓"
                  : quality.code === "conditional"
                    ? "!"
                    : "×"}
              </span>
              <div>
                <span>Status de qualidade</span>
                <strong>{quality.title}</strong>
                <p>{quality.detail}</p>
              </div>
            </div>
          </section>

          <section className="passport-overview">
            <PassportQrCode value={shareUrl} lotId={lot.id} />

            <div className="passport-data-card">
              <div className="passport-section-heading compact">
                <div>
                  <span>Identidade do lote</span>
                  <h3>Dados verificados</h3>
                </div>
                <span className="passport-live-badge">Registro ativo</span>
              </div>
              <dl className="passport-definition-grid">
                <div>
                  <dt>Origem</dt>
                  <dd>{lot.origin}</dd>
                </div>
                <div>
                  <dt>Destino previsto</dt>
                  <dd>{lot.destination}</dd>
                </div>
                <div>
                  <dt>Sensor vinculado</dt>
                  <dd>{lot.sensorId}</dd>
                </div>
                <div>
                  <dt>Peso registrado</dt>
                  <dd>{lot.weight.toLocaleString(locale)} kg</dd>
                </div>
                <div>
                  <dt>Localização atual</dt>
                  <dd>{lot.location}</dd>
                </div>
                <div>
                  <dt>Última atualização</dt>
                  <dd>{formattedDate}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section
            className="passport-metrics"
            aria-label="Indicadores do passaporte"
          >
            <article>
              <span>Temperatura atual</span>
              <strong>{lot.temperature.toLocaleString(locale)} °C</strong>
              <small>
                Faixa {lot.minTemperature}–{lot.maxTemperature} °C
              </small>
            </article>
            <article>
              <span>Orçamento térmico</span>
              <strong>{thermalBudget.remainingPercent}%</strong>
              <small>saldo operacional restante</small>
            </article>
            <article>
              <span>Vida útil estimada</span>
              <strong>{thermalBudget.shelfLifeHours} h</strong>
              <small>com base na exposição atual</small>
            </article>
            <article>
              <span>Integridade da evidência</span>
              <strong>{passport.evidenceScore}%</strong>
              <small>{custody.recordedEvents} eventos registrados</small>
            </article>
          </section>

          <section className="passport-route-card">
            <div className="passport-section-heading">
              <div>
                <span>Jornada logística</span>
                <h3>Origem, posição atual e destino</h3>
              </div>
              <strong>{route.stage}</strong>
            </div>
            <div className="passport-route-track" aria-hidden="true">
              <span style={{ width: `${route.progress}%` }} />
              <i className="origin" />
              <i className="current" style={{ left: `${route.progress}%` }} />
              <i className="destination" />
            </div>
            <div className="passport-route-labels">
              <div>
                <span>Origem</span>
                <strong>{route.origin}</strong>
              </div>
              <div>
                <span>Posição registrada</span>
                <strong>{route.currentLocation}</strong>
              </div>
              <div>
                <span>Destino</span>
                <strong>{route.destination}</strong>
              </div>
            </div>
          </section>

          <section className="passport-evidence-grid">
            <article>
              <span>Custódia digital</span>
              <strong>{custody.recordedEvents} eventos auditáveis</strong>
              <p>
                {custody.rescueDecisions} decisões de resgate e{" "}
                {custody.destinations} operações de destinação vinculadas.
              </p>
            </article>
            <article>
              <span>Disponibilidade</span>
              <strong>
                {availability.availableWeight.toLocaleString(locale)} kg livres
              </strong>
              <p>
                {availability.committedWeight.toLocaleString(locale)} kg já
                comprometidos de{" "}
                {availability.totalWeight.toLocaleString(locale)}
                {" kg."}
              </p>
            </article>
            <article>
              <span>Condição ambiental</span>
              <strong>{lot.humidity}% de umidade</strong>
              <p>{thermalBudget.summary}</p>
            </article>
          </section>

          <PassportTimeline events={passport.traceabilityEvents} />

          <footer className="passport-document-footer">
            <div>
              <span>Assinatura de integridade</span>
              <strong>{passport.verificationCode}</strong>
            </div>
            <p>
              Este documento consolida evidências operacionais da FreshSense. A
              liberação sanitária permanece sob responsabilidade da equipe de
              qualidade.
            </p>
            <span className="passport-footer-seal">FS · Verificado</span>
          </footer>
        </article>
      </div>
    </Translated>
  );
}
