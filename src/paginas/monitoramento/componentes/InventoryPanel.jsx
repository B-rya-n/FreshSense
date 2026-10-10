import { Translated } from "../../../traducoes/I18nContext";
import { formatValue } from "../modelo/monitoringFormat";

export function InventoryPanel({ inventory, metrics }) {
  return (
    <Translated>
      <article className="enterprise-panel inventory-panel">
        <div className="enterprise-panel-heading">
          <div>
            <span className="monitoring-overline">
              Planejamento de abastecimento
            </span>
            <h3>Estoque por categoria</h3>
            <p>Ocupação, frescor estimado e velocidade de giro.</p>
          </div>
          <span className="inventory-total">
            <strong>{formatValue(metrics.stock, "pt-BR", 0)} kg</strong>
            <small>disponíveis agora</small>
          </span>
        </div>
        <div className="inventory-category-list">
          {inventory.map((item) => (
            <div className="inventory-category-row" key={item.category}>
              <div className="inventory-category-name">
                <strong>{item.category}</strong>
                <span>{item.turnoverHours}h de giro estimado</span>
              </div>
              <div className="inventory-occupancy">
                <span>
                  <i style={{ width: `${item.occupancy}%` }} />
                </span>
                <small>
                  {item.amount} de {item.capacity} kg
                </small>
              </div>
              <div className="inventory-freshness">
                <span>Índice de frescor</span>
                <strong className={item.freshness < 90 ? "attention" : ""}>
                  {formatValue(item.freshness)}%
                </strong>
              </div>
            </div>
          ))}
        </div>
        <div className="inventory-footer-metrics">
          <div>
            <span>Lotes em acompanhamento</span>
            <strong>{metrics.activeLots}</strong>
          </div>
          <div>
            <span>Expedições liberadas</span>
            <strong>{metrics.shipments}</strong>
          </div>
          <div>
            <span>Volume potencial protegido</span>
            <strong>{metrics.wasteAvoided} kg</strong>
          </div>
        </div>
      </article>
    </Translated>
  );
}
