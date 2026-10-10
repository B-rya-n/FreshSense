import { TabList } from "../../../componentes/Tabs";
import { Translated } from "../../../traducoes/I18nContext";

const views = [
  {
    id: "overview",
    index: "01",
    label: "Visão geral",
    description: "Indicadores, tendência e alertas",
  },
  {
    id: "operation",
    index: "02",
    label: "Operação",
    description: "Unidades, rotas, estoque e qualidade",
  },
  {
    id: "assets",
    index: "03",
    label: "Ativos e lotes",
    description: "Sensores e rastreabilidade",
  },
];

export function MonitoringViewNav({ activeView, onChange, counts }) {
  return (
    <Translated>
      <nav className="monitoring-view-nav" aria-label="Áreas da central">
        <div className="monitoring-view-intro">
          <span>Navegação da central</span>
          <strong>Escolha o nível de análise</strong>
        </div>
        <TabList
          className="monitoring-view-tabs"
          items={views}
          activeId={activeView}
          onChange={onChange}
          label="Áreas da central"
          idPrefix="monitoring-tab"
          panelIdPrefix="monitoring-view"
        >
          {(view) => (
            <>
              <span className="view-tab-index">{view.index}</span>
              <span className="view-tab-copy">
                <strong>{view.label}</strong>
                <small>{view.description}</small>
              </span>
              {counts[view.id] > 0 && (
                <span className="view-tab-count">{counts[view.id]}</span>
              )}
            </>
          )}
        </TabList>
      </nav>
    </Translated>
  );
}
