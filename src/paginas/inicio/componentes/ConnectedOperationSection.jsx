import { Translated } from "../../../traducoes/I18nContext";

export function ConnectedOperationSection() {
  return (
    <Translated>
      <section className="section surface">
        <div className="container">
          <div className="section-title centered reveal">
            <span className="tag">Uma fonte confiável de contexto</span>
            <h2>Cada sinal conectado à decisão que ele precisa orientar</h2>
            <p>
              A FreshSense reúne telemetria, identidade do lote, etapa logística
              e histórico de resposta para que todas as equipes trabalhem a
              partir da mesma realidade operacional.
            </p>
          </div>
          <div className="insight-panel reveal">
            <div>
              <span>Do evento à resposta</span>
              <strong>
                Menos tempo procurando dados. Mais tempo protegendo o lote.
              </strong>
              <p>
                Quando uma condição sai da faixa definida, o painel identifica o
                contexto, calcula a prioridade e direciona o próximo passo.
              </p>
            </div>
            <a className="btn-fresh" href="/contato">
              Falar com um especialista
            </a>
          </div>
        </div>
      </section>
    </Translated>
  );
}
