import { useMemo } from "react";
import { useLots } from "../../../contextos/useLots";
import { useDestinations } from "../../../contextos/useDestinations";
import { Translated } from "../../../traducoes/I18nContext";
import { useI18n } from "../../../traducoes/useI18n";
import { DestinationForm } from "./DestinationForm";
import { DestinationList } from "./DestinationList";
import { institutions } from "../modelo/destinationModel";

export function DestinationWorkspace() {
  const { language } = useI18n();
  const locale = language === "pt" ? "pt-BR" : language;
  const { lots } = useLots();
  const { destinations, addDestination, updateDestination } = useDestinations();
  const initialLotId =
    new URLSearchParams(window.location.search).get("lote") ?? "";
  const committedQuantity = useMemo(
    () =>
      destinations
        .filter((item) => item.status !== "cancelada")
        .reduce((sum, item) => sum + item.quantity, 0),
    [destinations],
  );
  const completedQuantity = useMemo(
    () =>
      destinations
        .filter((item) => item.status === "concluida")
        .reduce((sum, item) => sum + item.quantity, 0),
    [destinations],
  );
  const activeOperations = destinations.filter(
    (item) => !["concluida", "cancelada"].includes(item.status),
  ).length;

  return (
    <Translated>
      <section className="section destination-section">
        <div className="container">
          <div className="destination-kpis" aria-label="Resumo das destinações">
            <article>
              <span>Operações em andamento</span>
              <strong>{activeOperations}</strong>
              <small>planos aguardando conclusão</small>
            </article>
            <article>
              <span>Volume comprometido</span>
              <strong>{committedQuantity.toLocaleString(locale)}</strong>
              <small>kg destinados</small>
            </article>
            <article>
              <span>Volume concluído</span>
              <strong>{completedQuantity.toLocaleString(locale)}</strong>
              <small>kg aproveitados</small>
            </article>
          </div>

          <div className="destination-intro">
            <div>
              <span>Fluxo conectado</span>
              <h2>Da identificação do risco à ação operacional</h2>
            </div>
            <p>
              Os saldos vêm diretamente da Gestão de Lotes. As validações
              impedem quantidades indisponíveis, datas inválidas e registros sem
              responsável.
            </p>
          </div>

          <div className="destination-grid">
            <DestinationForm
              key={initialLotId || "destination-form"}
              lots={lots}
              destinations={destinations}
              institutions={institutions}
              initialLotId={initialLotId}
              onCreate={addDestination}
            />
            <DestinationList
              destinations={destinations}
              onUpdate={updateDestination}
            />
          </div>

          <p className="destination-data-note">
            Ambiente demonstrativo: os registros são mantidos localmente pelo
            React neste navegador. A liberação sanitária deve ser confirmada
            pela equipe responsável antes de qualquer movimentação.
          </p>
        </div>
      </section>
    </Translated>
  );
}
