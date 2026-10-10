import { PageHero } from "../../componentes/PageHero";
import { SmartLotSearch } from "./componentes/SmartLotSearch";
import { Translated } from "../../traducoes/I18nContext";
import "./buscar-lotes.css";

export function BuscarLotesPage() {
  return (
    <Translated>
      <PageHero
        className="lot-search-hero"
        eyebrow="Rastreabilidade operacional"
        title="Encontre o lote certo sem procurar em sistemas desconectados"
        text="Consulte produto, origem, condição, etapa da cadeia e classificação de risco em uma busca rápida, criada para apoiar decisões sob pressão."
      />
      <SmartLotSearch />
    </Translated>
  );
}
