import { useCallback, useMemo, useState } from "react";
import { AlertCenter } from "./AlertCenter";
import { InventoryPanel } from "./InventoryPanel";
import { MetricOverview } from "./MetricOverview";
import { MonitoringCommandBar } from "./MonitoringCommandBar";
import { OperationsNetwork } from "./OperationsNetwork";
import { OperationsCopilot } from "./OperationsCopilot";
import { QualityCompliancePanel } from "./QualityCompliancePanel";
import { SensorFleet } from "./SensorFleet";
import { TelemetryPanel } from "./TelemetryPanel";
import { MonitoringViewNav } from "./MonitoringViewNav";
import { LotMonitor } from "./LotMonitor";
import {
  createQualityDistribution,
  createScopedHistory,
  createScopedInventory,
  createScopedMetrics,
} from "../modelo/monitoringScope";

export function LiveOperationsDashboard({ monitoring }) {
  const [activeView, setActiveView] = useState("overview");
  const [selectedMetric, setSelectedMetric] = useState("coldChainCompliance");
  const [facilityId, setFacilityId] = useState("todas");
  const [timeWindow, setTimeWindow] = useState(20);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotIncident, setCopilotIncident] = useState(null);
  const selectedFacility = useMemo(
    () =>
      monitoring.facilities.find((facility) => facility.id === facilityId) ??
      null,
    [facilityId, monitoring.facilities],
  );
  const sensorFacilityMap = useMemo(
    () =>
      new Map(
        monitoring.sensors.map((sensor) => [sensor.id, sensor.facilityId]),
      ),
    [monitoring.sensors],
  );
  const visibleSensors = useMemo(
    () =>
      selectedFacility
        ? monitoring.sensors.filter(
            (sensor) => sensor.facilityId === selectedFacility.id,
          )
        : monitoring.sensors,
    [monitoring.sensors, selectedFacility],
  );
  const visibleLots = useMemo(
    () =>
      selectedFacility
        ? monitoring.lots.filter(
            (lot) =>
              sensorFacilityMap.get(lot.sensorId) === selectedFacility.id,
          )
        : monitoring.lots,
    [monitoring.lots, selectedFacility, sensorFacilityMap],
  );
  const visibleEvents = useMemo(
    () =>
      selectedFacility
        ? monitoring.events.filter(
            (event) =>
              !event.facilityId || event.facilityId === selectedFacility.id,
          )
        : monitoring.events,
    [monitoring.events, selectedFacility],
  );
  const scopedMetrics = useMemo(
    () =>
      createScopedMetrics(monitoring.metrics, selectedFacility, visibleLots),
    [monitoring.metrics, selectedFacility, visibleLots],
  );
  const scopedHistory = useMemo(
    () =>
      createScopedHistory(
        monitoring.metricHistory,
        selectedFacility,
        visibleLots,
      ),
    [monitoring.metricHistory, selectedFacility, visibleLots],
  );
  const scopedInventory = useMemo(
    () =>
      createScopedInventory(
        monitoring.inventory,
        selectedFacility,
        visibleLots,
      ),
    [monitoring.inventory, selectedFacility, visibleLots],
  );
  const visibleFacilities = useMemo(
    () => (selectedFacility ? [selectedFacility] : monitoring.facilities),
    [monitoring.facilities, selectedFacility],
  );
  const visibleRoutes = useMemo(
    () =>
      selectedFacility
        ? monitoring.routes.filter(
            (route) => route.facilityId === selectedFacility.id,
          )
        : monitoring.routes,
    [monitoring.routes, selectedFacility],
  );
  const visibleQualityDistribution = useMemo(
    () => createQualityDistribution(visibleLots),
    [visibleLots],
  );
  const visiblePendingAlertCount = useMemo(
    () =>
      visibleEvents.filter(
        (event) =>
          event.tone === "warning" &&
          !event.acknowledged &&
          event.status !== "resolvido",
      ).length,
    [visibleEvents],
  );
  const viewCounts = {
    overview: visiblePendingAlertCount,
    operation: visibleFacilities.length + visibleRoutes.length,
    assets: visibleSensors.length + visibleLots.length,
  };
  const openCopilot = useCallback((incident = null) => {
    setCopilotIncident(incident);
    setCopilotOpen(true);
  }, []);
  const closeCopilot = useCallback(() => setCopilotOpen(false), []);
  const copilotContext = useMemo(
    () => ({
      metrics: scopedMetrics,
      events: visibleEvents,
      lots: visibleLots,
      sensors: visibleSensors,
      routes: visibleRoutes,
      facilities: visibleFacilities,
      facility: selectedFacility,
      updatedAt: monitoring.updatedAt,
      selectedIncident: copilotIncident,
    }),
    [
      copilotIncident,
      monitoring.updatedAt,
      scopedMetrics,
      selectedFacility,
      visibleFacilities,
      visibleEvents,
      visibleLots,
      visibleRoutes,
      visibleSensors,
    ],
  );

  return (
    <section className="monitoring-enterprise-section">
      <div className="container monitoring-enterprise-shell">
        <MonitoringCommandBar
          monitoring={monitoring}
          facilities={monitoring.facilities}
          facilityId={facilityId}
          onFacilityChange={setFacilityId}
          timeWindow={timeWindow}
          onTimeWindowChange={setTimeWindow}
          onOpenCopilot={() => openCopilot()}
        />

        <MonitoringViewNav
          activeView={activeView}
          onChange={setActiveView}
          counts={viewCounts}
        />

        <div
          className="monitoring-view-panel"
          id="monitoring-view-overview"
          role="tabpanel"
          aria-labelledby="monitoring-tab-overview"
          hidden={activeView !== "overview"}
        >
          <MetricOverview
            metrics={scopedMetrics}
            history={scopedHistory}
            selectedMetric={selectedMetric}
            onSelect={setSelectedMetric}
          />
          <div className="monitoring-primary-grid">
            <TelemetryPanel
              history={scopedHistory}
              selectedMetric={selectedMetric}
              timeWindow={timeWindow}
            />
            <AlertCenter
              events={visibleEvents}
              onAcknowledge={monitoring.acknowledgeEvent}
              onAssign={monitoring.assignEvent}
              onResolve={monitoring.resolveEvent}
              onAnalyze={openCopilot}
            />
          </div>
        </div>

        <div
          className="monitoring-view-panel"
          id="monitoring-view-operation"
          role="tabpanel"
          aria-labelledby="monitoring-tab-operation"
          hidden={activeView !== "operation"}
        >
          <OperationsNetwork
            facilities={visibleFacilities}
            routes={visibleRoutes}
          />
          <div className="monitoring-secondary-grid">
            <QualityCompliancePanel
              compliance={monitoring.compliance}
              distribution={visibleQualityDistribution}
              metrics={scopedMetrics}
            />
            <InventoryPanel
              inventory={scopedInventory}
              metrics={scopedMetrics}
            />
          </div>
        </div>

        <div
          className="monitoring-view-panel"
          id="monitoring-view-assets"
          role="tabpanel"
          aria-labelledby="monitoring-tab-assets"
          hidden={activeView !== "assets"}
        >
          <SensorFleet
            sensors={visibleSensors}
            facilities={visibleFacilities}
          />
          <LotMonitor lots={visibleLots} />
        </div>
      </div>
      <OperationsCopilot
        open={copilotOpen}
        onClose={closeCopilot}
        context={copilotContext}
      />
    </section>
  );
}
