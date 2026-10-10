import { useMemo, useState } from "react";
import { PageHero } from "../../componentes/PageHero";
import { TabList } from "../../componentes/Tabs";
import { useLots } from "../../contextos/useLots";
import { useRescueOperations } from "../../contextos/useRescueOperations";
import { Translated } from "../../traducoes/I18nContext";
import { useI18n } from "../../traducoes/useI18n";
import { ColdChainReplay } from "./componentes/ColdChainReplay";
import { RescueCommandDeck } from "./componentes/RescueCommandDeck";
import { RescueDecisionHistory } from "./componentes/RescueDecisionHistory";
import { RescueScenarioGrid } from "./componentes/RescueScenarioGrid";
import { ThermalBudgetPanel } from "./componentes/ThermalBudgetPanel";
import {
  applyRescueScenario,
  buildReplayFrames,
  buildRescueScenarios,
  calculateThermalBudget,
} from "./modelo/rescueModel";
import "./resgate-carga.css";

const tabs = [
  { id: "rescue", label: "Central de resgate", number: "01" },
  { id: "budget", label: "Orçamento térmico", number: "02" },
  { id: "replay", label: "Replay da cadeia fria", number: "03" },
];

function pickInitialLot(lots) {
  return lots.find((lot) => lot.risk === "alto")?.id ?? lots[0]?.id ?? "";
}

export function ResgateCargaPage() {
  const { lots, updateLot } = useLots();
  const { decisions, recordDecision } = useRescueOperations();
  const { t } = useI18n();
  const [lotId, setLotId] = useState(() => pickInitialLot(lots));
  const [activeTab, setActiveTab] = useState("rescue");
  const [selectedScenarioId, setSelectedScenarioId] = useState("");
  const [message, setMessage] = useState(null);
  const lot = lots.find((item) => item.id === lotId) ?? lots[0];

  const budget = useMemo(
    () => (lot ? calculateThermalBudget(lot) : null),
    [lot],
  );
  const scenarios = useMemo(
    () => (lot && budget ? buildRescueScenarios(lot, budget) : []),
    [budget, lot],
  );
  const selectedScenario =
    scenarios.find((scenario) => scenario.id === selectedScenarioId) ??
    scenarios.find((scenario) => scenario.recommended) ??
    scenarios[0];
  const lotDecisions = useMemo(
    () =>
      lot ? decisions.filter((decision) => decision.lotId === lot.id) : [],
    [decisions, lot],
  );
  const replayFrames = useMemo(
    () => (lot ? buildReplayFrames(lot, lotDecisions) : []),
    [lot, lotDecisions],
  );

  function changeLot(nextId) {
    setLotId(nextId);
    setSelectedScenarioId("");
    setMessage(null);
  }

  function executePlan() {
    if (!lot || !selectedScenario) return;

    const now = new Date();
    const updatedLot = applyRescueScenario(lot, selectedScenario, now);

    setSelectedScenarioId(selectedScenario.id);
    updateLot(lot.id, updatedLot);
    recordDecision({
      id: `DEC-${lot.id}-${now.getTime()}`,
      lotId: lot.id,
      scenarioId: selectedScenario.id,
      scenarioTitle: selectedScenario.title,
      createdAt: now.toISOString(),
      operator: "Equipe FreshSense",
      lossPercent: selectedScenario.lossPercent,
      riskBefore: lot.risk,
      riskAfter: selectedScenario.riskAfter,
      targetTemperature: selectedScenario.targetTemperature,
      location: selectedScenario.locationAfter,
      lotSnapshot: { ...lot },
    });
    setMessage({ scenarioTitle: selectedScenario.title, lotId: lot.id });
  }

  if (!lot) {
    return (
      <Translated>
        <PageHero
          eyebrow="Inteligência de resposta"
          title="Central de Resgate de Carga"
          text="Cadastre um lote para iniciar a análise operacional."
        />
      </Translated>
    );
  }

  return (
    <Translated>
      <PageHero
        className="rescue-page-hero"
        eyebrow="Novas funcionalidades · Fase 6"
        title="Central de Resgate de Carga"
        text="Transforme desvios térmicos em decisões comparáveis: estime a janela de resposta, simule planos de contenção e reconstrua a jornada completa do lote."
      />

      <section className="section rescue-command-section">
        <div className="container">
          <RescueCommandDeck lots={lots} lot={lot} onChange={changeLot} />

          <div className="rescue-workspace">
            <TabList
              className="rescue-tab-list"
              items={tabs.map((tab) => ({ ...tab, label: t(tab.label) }))}
              activeId={activeTab}
              onChange={setActiveTab}
              label={t("Ferramentas de resgate")}
              idPrefix="rescue-tab"
              panelIdPrefix="rescue-panel"
            >
              {(tab) => (
                <>
                  <span>{tab.number}</span>
                  {tab.label}
                </>
              )}
            </TabList>

            <div className="rescue-workspace-body">
              {message && (
                <p className="rescue-success-message" role="status">
                  <span aria-hidden="true">✓</span> {t("Plano")} “
                  {t(message.scenarioTitle)}”{" "}
                  {t("executado e registrado no lote")} {message.lotId}.
                </p>
              )}

              <div
                id="rescue-panel-rescue"
                role="tabpanel"
                aria-labelledby="rescue-tab-rescue"
                hidden={activeTab !== "rescue"}
              >
                <header className="rescue-panel-heading">
                  <div>
                    <span className="rescue-overline">
                      Comparação de resposta
                    </span>
                    <h2>Qual plano preserva mais carga agora?</h2>
                    <p>
                      {t("Três alternativas calculadas para")} {lot.id},{" "}
                      {t("considerando risco, exposição e impacto logístico.")}
                    </p>
                  </div>
                  <div className="rescue-incident-clock">
                    <span>Janela estimada</span>
                    <strong>{budget.shelfLifeHours}h</strong>
                    <small>
                      {budget.remainingPercent}% {t("do orçamento restante")}
                    </small>
                  </div>
                </header>

                <RescueScenarioGrid
                  scenarios={scenarios}
                  selectedId={selectedScenario.id}
                  onSelect={setSelectedScenarioId}
                />

                <div className="rescue-execution-panel">
                  <div>
                    <span className="rescue-overline">Plano selecionado</span>
                    <h3>{t(selectedScenario.title)}</h3>
                    <p>
                      Ao executar, o lote será atualizado na Gestão de Lotes e a
                      decisão passará a fazer parte do replay.
                    </p>
                  </div>
                  <ol>
                    {selectedScenario.actions.map((action) => (
                      <li key={action}>{t(action)}</li>
                    ))}
                  </ol>
                  <button
                    className="btn-fresh"
                    type="button"
                    onClick={executePlan}
                  >
                    Executar e registrar plano
                  </button>
                </div>

                <RescueDecisionHistory decisions={lotDecisions} />
              </div>

              <div
                id="rescue-panel-budget"
                role="tabpanel"
                aria-labelledby="rescue-tab-budget"
                hidden={activeTab !== "budget"}
              >
                <header className="rescue-panel-heading compact">
                  <div>
                    <span className="rescue-overline">Orçamento térmico</span>
                    <h2>Quanto da tolerância do lote ainda resta?</h2>
                    <p>
                      Uma leitura objetiva da energia térmica acumulada e da
                      janela útil para intervir.
                    </p>
                  </div>
                </header>
                <ThermalBudgetPanel
                  lot={lot}
                  lots={lots}
                  budget={budget}
                  selectedLotId={lot.id}
                  onSelectLot={changeLot}
                />
              </div>

              <div
                id="rescue-panel-replay"
                role="tabpanel"
                aria-labelledby="rescue-tab-replay"
                hidden={activeTab !== "replay"}
              >
                <header className="rescue-panel-heading compact">
                  <div>
                    <span className="rescue-overline">
                      Replay da cadeia fria
                    </span>
                    <h2>Veja onde a condição começou a mudar</h2>
                    <p>
                      Percorra o histórico simulado do sensor e relacione cada
                      alteração às decisões registradas.
                    </p>
                  </div>
                </header>
                <ColdChainReplay frames={replayFrames} lot={lot} />
              </div>
            </div>
          </div>

          <p className="rescue-data-note">
            Ambiente demonstrativo: histórico, tempos e projeções são simulados
            para fins acadêmicos. Os lotes cadastrados e as decisões executadas
            são persistidos localmente pelo React no navegador.
          </p>
        </div>
      </section>
    </Translated>
  );
}
