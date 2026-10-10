import { LiveOperationsDashboard } from "./LiveOperationsDashboard";
import { useLiveMonitoring } from "../hooks/useLiveMonitoring";

export function MonitoringWorkspace() {
  const monitoring = useLiveMonitoring();

  return <LiveOperationsDashboard monitoring={monitoring} />;
}
