import { Translated } from "../../../traducoes/I18nContext";
import { formatValue, statusLabel } from "../modelo/monitoringFormat";

export function OperationsNetwork({ facilities, routes }) {
  return (
    <Translated>
      <section className="monitoring-block" aria-labelledby="network-title">
        <div className="monitoring-block-heading">
          <div>
            <span className="monitoring-overline">Rede operacional</span>
            <h3 id="network-title">Unidades e transporte refrigerado</h3>
          </div>
          <p>
            Os filtros globais ajustam simultaneamente unidades, rotas e
            dispositivos.
          </p>
        </div>

        <div className="facility-grid">
          {facilities.map((facility) => (
            <article
              className={`facility-card status-${facility.status}`}
              key={facility.id}
            >
              <div className="facility-card-head">
                <div>
                  <span>{facility.id}</span>
                  <h4>{facility.name}</h4>
                  <p>
                    {facility.type} · {facility.city}
                  </p>
                </div>
                <span className={`asset-status status-${facility.status}`}>
                  {statusLabel(facility.status)}
                </span>
              </div>
              <div className="facility-kpis">
                <div>
                  <span>Temperatura média</span>
                  <strong>{formatValue(facility.temperature)}°C</strong>
                </div>
                <div>
                  <span>Umidade</span>
                  <strong>{facility.humidity}%</strong>
                </div>
                <div>
                  <span>Ocupação</span>
                  <strong>{facility.occupancy}%</strong>
                </div>
                <div>
                  <span>Sensores online</span>
                  <strong>
                    {facility.onlineSensors}/{facility.totalSensors}
                  </strong>
                </div>
              </div>
              <div className="facility-capacity">
                <span>
                  <i style={{ width: `${facility.occupancy}%` }} />
                </span>
                <small>
                  Capacidade {formatValue(facility.capacity, "pt-BR", 0)} kg ·{" "}
                  {facility.production} kg/h
                </small>
              </div>
            </article>
          ))}
        </div>

        <article className="enterprise-panel route-panel">
          <div className="enterprise-panel-heading">
            <div>
              <span className="monitoring-overline">Logística em trânsito</span>
              <h3>Rotas refrigeradas ativas</h3>
            </div>
            <span className="panel-count">{routes.length} veículos</span>
          </div>
          <div className="enterprise-table-wrap">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Rota / veículo</th>
                  <th>Carga</th>
                  <th>Trajeto</th>
                  <th>Temperatura</th>
                  <th>Progresso</th>
                  <th>Previsão</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.id}>
                    <td>
                      <strong>{route.id}</strong>
                      <span>{route.vehicle}</span>
                    </td>
                    <td>{route.product}</td>
                    <td>
                      <span>{route.origin}</span>
                      <strong>→ {route.destination}</strong>
                    </td>
                    <td>
                      <strong>{formatValue(route.temperature)}°C</strong>
                    </td>
                    <td>
                      <div className="table-progress">
                        <span>
                          <i style={{ width: `${route.progress}%` }} />
                        </span>
                        <strong>{formatValue(route.progress)}%</strong>
                      </div>
                    </td>
                    <td>{route.eta} min</td>
                    <td>
                      <span className={`asset-status status-${route.status}`}>
                        {statusLabel(route.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </Translated>
  );
}
