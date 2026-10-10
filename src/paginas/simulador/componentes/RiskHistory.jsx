import { Translated } from "../../../traducoes/I18nContext";

export function RiskHistory({ history, onLoad }) {
  return (
    <Translated>
      <section className="risk-history-panel">
        <div>
          <span className="risk-kicker">Comparação local</span>
          <h2>Histórico desta sessão</h2>
          <p>
            Os cenários ficam apenas no navegador durante esta sessão e podem
            ser carregados novamente para comparação.
          </p>
        </div>
        <div className="risk-history-list">
          {history.length ? (
            history.map((item) => (
              <button type="button" onClick={() => onLoad(item)} key={item.id}>
                <span>
                  <strong>{item.result.food.label}</strong>
                  <small>
                    {item.result.stage.label} · {item.time}
                  </small>
                </span>
                <span className={item.result.level.className}>
                  {item.result.score} · {item.result.level.short}
                </span>
              </button>
            ))
          ) : (
            <p>Nenhum cenário foi registrado ainda.</p>
          )}
        </div>
      </section>
    </Translated>
  );
}
