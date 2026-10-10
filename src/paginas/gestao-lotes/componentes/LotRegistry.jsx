import { riskLabels } from "../../../dados/lotData";
import { Translated } from "../../../traducoes/I18nContext";

export function LotRegistry({ lots, query, onQueryChange, onEdit, onDelete }) {
  return (
    <Translated>
      <div className="lot-registry">
        <div className="lot-registry-heading">
          <div>
            <span>Lotes ativos</span>
            <h2>Registros cadastrados</h2>
          </div>
          <label>
            <span>Buscar na gestão</span>
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Código, produto, origem ou sensor"
            />
          </label>
        </div>

        <p className="table-scroll-hint" aria-hidden="true">
          <span>↔</span> Deslize para consultar todas as colunas
        </p>
        <div
          className="lot-registry-table-wrap"
          role="region"
          aria-label="Tabela de lotes cadastrados"
          tabIndex="0"
        >
          <table className="lot-registry-table">
            <thead>
              <tr>
                <th>Lote</th>
                <th>Origem → destino</th>
                <th>Condição</th>
                <th>Sensor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lots.map((lot) => (
                <tr key={lot.id}>
                  <td>
                    <strong>{lot.id}</strong>
                    <span>
                      {lot.product} · {lot.category}
                    </span>
                  </td>
                  <td>
                    <strong>{lot.origin}</strong>
                    <span>
                      {lot.destination} · {lot.stage}
                    </span>
                  </td>
                  <td>
                    <span className={`lot-status risk-${lot.risk}`}>
                      Risco {riskLabels[lot.risk]}
                    </span>
                    <small>
                      {lot.temperature.toLocaleString("pt-BR")} °C · faixa{" "}
                      {lot.minTemperature}–{lot.maxTemperature} °C
                    </small>
                  </td>
                  <td>
                    <strong>{lot.sensorId}</strong>
                    <span>{lot.location}</span>
                  </td>
                  <td>
                    <div className="lot-row-actions">
                      <button type="button" onClick={() => onEdit(lot)}>
                        Editar
                      </button>
                      <a
                        href={`/passaporte-lote?lote=${encodeURIComponent(lot.id)}`}
                      >
                        Passaporte
                      </a>
                      <a
                        href={`/destinacao?lote=${encodeURIComponent(lot.id)}`}
                      >
                        Destinar
                      </a>
                      <button
                        className="danger"
                        type="button"
                        onClick={() => onDelete(lot)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!lots.length && (
          <div className="lot-registry-empty ui-empty-state" role="status">
            <strong>Nenhum lote encontrado.</strong>
            <span>Altere a pesquisa ou cadastre um novo lote.</span>
          </div>
        )}
      </div>
    </Translated>
  );
}
