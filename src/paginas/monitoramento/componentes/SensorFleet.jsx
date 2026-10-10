import { useDeferredValue, useMemo, useState } from "react";
import { Translated } from "../../../traducoes/I18nContext";
import { formatValue, statusLabel } from "../modelo/monitoringFormat";

export function SensorFleet({ sensors, facilities }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos");
  const deferredQuery = useDeferredValue(query);
  const facilityNames = useMemo(
    () =>
      Object.fromEntries(
        facilities.map((facility) => [facility.id, facility.name]),
      ),
    [facilities],
  );
  const filteredSensors = useMemo(
    () =>
      sensors.filter((sensor) => {
        const matchesStatus = status === "todos" || sensor.status === status;
        const search =
          `${sensor.id} ${sensor.location} ${facilityNames[sensor.facilityId] ?? ""}`.toLowerCase();
        return matchesStatus && search.includes(deferredQuery.toLowerCase());
      }),
    [deferredQuery, facilityNames, sensors, status],
  );

  return (
    <Translated>
      <article className="enterprise-panel sensor-fleet-panel">
        <div className="enterprise-panel-heading">
          <div>
            <span className="monitoring-overline">
              Diagnóstico de dispositivos
            </span>
            <h3>Frota de sensores ambientais</h3>
            <p>
              Bateria, intensidade de sinal, última transmissão e leitura atual.
            </p>
          </div>
          <span className="panel-count">
            {filteredSensors.length} dispositivos
          </span>
        </div>
        <div className="sensor-filter-bar">
          <label>
            <span>Buscar dispositivo</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Código, unidade ou ambiente"
            />
          </label>
          <label>
            <span>Status de comunicação</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="online">Online</option>
              <option value="atencao">Atenção</option>
              <option value="offline">Sem comunicação</option>
            </select>
          </label>
          <span className="filter-processing">
            {query !== deferredQuery
              ? "Processando filtro..."
              : "Filtro atualizado"}
          </span>
        </div>
        <div className="enterprise-table-wrap">
          <table className="enterprise-table sensor-table">
            <thead>
              <tr>
                <th>Dispositivo</th>
                <th>Unidade / ambiente</th>
                <th>Leitura</th>
                <th>Bateria</th>
                <th>Sinal</th>
                <th>Último dado</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSensors.map((sensor) => (
                <tr key={sensor.id}>
                  <td>
                    <strong>{sensor.id}</strong>
                    <span>{sensor.type}</span>
                  </td>
                  <td>
                    <strong>{sensor.location}</strong>
                    <span>{facilityNames[sensor.facilityId]}</span>
                  </td>
                  <td>
                    <strong>{formatValue(sensor.temperature)}°C</strong>
                    <span>{sensor.humidity}% UR</span>
                  </td>
                  <td>
                    <div className="mini-health-bar">
                      <span>
                        <i style={{ width: `${sensor.battery}%` }} />
                      </span>
                      <strong>{formatValue(sensor.battery)}%</strong>
                    </div>
                  </td>
                  <td>
                    <div className="mini-health-bar signal">
                      <span>
                        <i style={{ width: `${sensor.signal}%` }} />
                      </span>
                      <strong>{sensor.signal}%</strong>
                    </div>
                  </td>
                  <td>{sensor.lastSeenSeconds}s atrás</td>
                  <td>
                    <span className={`asset-status status-${sensor.status}`}>
                      {statusLabel(sensor.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </Translated>
  );
}
