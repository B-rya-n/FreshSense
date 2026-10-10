import { BenefitsSection } from "./componentes/BenefitsSection";
import { CopilotSpotlight } from "./componentes/CopilotSpotlight";
import { FeatureGateway } from "./componentes/FeatureGateway";
import { HomeHero } from "./componentes/HomeHero";
import { ImpactStrip } from "./componentes/ImpactStrip";
import { PlatformSection } from "./componentes/PlatformSection";
import "./inicio.css";

export function InicioPage() {
  return (
    <>
      <HomeHero />
      <ImpactStrip />
      <FeatureGateway />
      <CopilotSpotlight />
      <BenefitsSection />
      <PlatformSection />
    </>
  );
}
