import { PageHero } from "../../componentes/PageHero";
import { Translated } from "../../traducoes/I18nContext";
import { DestinationWorkspace } from "./componentes/DestinationWorkspace";
import "./destinacao.css";

export function DestinacaoPage() {
  return (
    <Translated>
      <PageHero
        className="destination-hero"
        eyebrow="Ação contra o desperdício · Fase 6"
        title="Destinação inteligente de lotes"
        text="Planeje doações, vendas prioritárias e transferências, valide a disponibilidade real e acompanhe cada operação até a conclusão."
      />
      <DestinationWorkspace />
    </Translated>
  );
}
