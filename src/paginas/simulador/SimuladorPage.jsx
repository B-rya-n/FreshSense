import { PageHero } from "../../componentes/PageHero";
import { RiskSimulator } from "./componentes/RiskSimulator";
import { Translated } from "../../traducoes/I18nContext";
import "./simulador.css";

export function SimuladorPage() {
  return (
    <Translated>
      <PageHero
        className="simulator-hero"
        eyebrow="FreshSense Decision Lab"
        title="Compare risco, incerteza e resposta antes da próxima decisão"
        text="Estruture o cenário do lote, entenda a contribuição de cada fator e avalie como diferentes medidas de controle alteram a prioridade e a janela de resposta."
      />
      <RiskSimulator />
    </Translated>
  );
}
