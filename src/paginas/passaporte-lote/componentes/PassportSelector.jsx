import { riskLabels } from "../../../dados/lotData";
import { Translated } from "../../../traducoes/I18nContext";

export function PassportSelector({
  lots,
  selectedLotId,
  query,
  onQueryChange,
  onSelect,
}) {
  return (
    <Translated>
      <aside className="passport-selector" aria-label="Selecionar lote">
        <div className="passport-selector-heading">
          <span>Central de passaportes</span>
          <h2>Escolha um lote</h2>
          <p>
            Consulte o registro verificável criado a partir dos dados da
            operação.
          </p>
        </div>

        <label className="passport-search-field">
          <span>Buscar lote</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Código, produto ou origem"
          />
        </label>

        <div className="passport-lot-list">
          {lots.map((lot) => (
            <button
              type="button"
              className={lot.id === selectedLotId ? "is-selected" : ""}
              aria-pressed={lot.id === selectedLotId}
              onClick={() => onSelect(lot.id)}
              key={lot.id}
            >
              <span className={`passport-lot-signal risk-${lot.risk}`} />
              <span className="passport-lot-copy">
                <strong>{lot.id}</strong>
                <small>
                  {lot.product} · {lot.origin}
                </small>
              </span>
              <span className={`passport-lot-risk risk-${lot.risk}`}>
                {riskLabels[lot.risk]}
              </span>
            </button>
          ))}
        </div>

        {!lots.length && (
          <div className="passport-selector-empty" role="status">
            <strong>Nenhum lote encontrado</strong>
            <span>Altere a busca para consultar outros registros.</span>
          </div>
        )}
      </aside>
    </Translated>
  );
}
