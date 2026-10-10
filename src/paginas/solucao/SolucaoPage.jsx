import { PageHero } from "../../componentes/PageHero";
import { SolutionArchitecture } from "./componentes/SolutionArchitecture";
import { SolutionDeployment } from "./componentes/SolutionDeployment";
import { SolutionEvidence } from "./componentes/SolutionEvidence";
import { SolutionJourney } from "./componentes/SolutionJourney";
import { Translated } from "../../traducoes/I18nContext";
import "./solucao.css";

export function SolucaoPage() {
  return (
    <Translated>
      <PageHero
        className="solution-hero"
        eyebrow="Plataforma FreshSense"
        title="Transforme sinais da cadeia fria em respostas que protegem o produto"
        text="A FreshSense unifica telemetria, localização, contexto do lote e fluxos de tratamento para que cada desvio chegue à equipe certa, com prioridade, evidência e tempo para agir."
      />

      <SolutionEvidence />

      <SolutionJourney />

      <SolutionArchitecture />

      <SolutionDeployment />
    </Translated>
  );
}
