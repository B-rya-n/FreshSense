import { useMemo, useState } from "react";
import { PageHero } from "../../componentes/PageHero";
import { useLots } from "../../contextos/useLots";
import { useDestinations } from "../../contextos/useDestinations";
import { useRescueOperations } from "../../contextos/useRescueOperations";
import { Translated } from "../../traducoes/I18nContext";
import { normalizeSearchTerm } from "../../utilitarios/text";
import { getCommittedQuantity } from "../destinacao/modelo/destinationModel";
import { DeleteLotDialog } from "./componentes/DeleteLotDialog";
import { LotForm } from "./componentes/LotForm";
import { LotRegistry } from "./componentes/LotRegistry";
import { LotSummary } from "./componentes/LotSummary";
import "./gestao-lotes.css";

export function GestaoLotesPage() {
  const { lots, addLot, updateLot, deleteLot } = useLots();
  const { destinations } = useDestinations();
  const { decisions } = useRescueOperations();
  const [editingLot, setEditingLot] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const normalizedQuery = normalizeSearchTerm(query.trim());
  const visibleLots = useMemo(
    () =>
      lots.filter((lot) => {
        const searchableText = normalizeSearchTerm(
          [
            lot.id,
            lot.product,
            lot.category,
            lot.origin,
            lot.location,
            lot.sensorId,
          ].join(" "),
        );

        return searchableText.includes(normalizedQuery);
      }),
    [lots, normalizedQuery],
  );
  const summary = useMemo(
    () => ({
      stable: lots.filter((lot) => lot.status === "estavel").length,
      attention: lots.filter((lot) => lot.status === "atencao").length,
      critical: lots.filter((lot) => lot.status === "critico").length,
    }),
    [lots],
  );
  const minimumEditingWeight = editingLot
    ? getCommittedQuantity(destinations, editingLot.id)
    : 0;
  const deleteRelations = useMemo(() => {
    if (!deleteTarget) return { destinations: 0, decisions: 0 };

    return {
      destinations: destinations.filter(
        (destination) => destination.lotId === deleteTarget.id,
      ).length,
      decisions: decisions.filter(
        (decision) => decision.lotId === deleteTarget.id,
      ).length,
    };
  }, [decisions, deleteTarget, destinations]);

  function showForm() {
    requestAnimationFrame(() => {
      document.getElementById("cadastro-lote")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      document.getElementById("lot-id")?.focus();
    });
  }

  function startCreating() {
    setEditingLot(null);
    setMessage("");
    showForm();
  }

  function saveLot(lot) {
    if (editingLot) {
      updateLot(editingLot.id, lot);
      setMessage(`Lote ${lot.id} atualizado com sucesso.`);
      setEditingLot(null);
      return;
    }

    addLot(lot);
    setMessage(`Lote ${lot.id} cadastrado com sucesso.`);
  }

  function startEditing(lot) {
    setEditingLot(lot);
    setMessage("");
    showForm();
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    if (deleteRelations.destinations || deleteRelations.decisions) return;
    deleteLot(deleteTarget.id);
    if (editingLot?.id === deleteTarget.id) setEditingLot(null);
    setMessage(`Lote ${deleteTarget.id} excluído.`);
    setDeleteTarget(null);
  }

  return (
    <Translated>
      <PageHero
        className="lot-management-hero"
        eyebrow="Funcionalidade da Fase 6"
        title="Cadastre e gerencie os lotes da operação"
        text="Mantenha identificação, origem, destino, limites ambientais e sensor em um registro único que alimenta a busca e o monitoramento."
      />

      <section className="section lot-management-section">
        <div className="container">
          <div className="lot-management-toolbar">
            <div>
              <span>Registro operacional</span>
              <h2>Visão geral dos lotes</h2>
              <p>
                Os registros ficam salvos neste navegador e podem ser alterados
                sempre que a condição operacional mudar.
              </p>
            </div>
            <div className="lot-management-toolbar-actions">
              <a className="btn-soft" href="/destinacao">
                Destinação de lotes
              </a>
              <a className="btn-soft" href="/resgate-carga">
                Central de resgate
              </a>
              <button
                className="btn-fresh"
                type="button"
                onClick={startCreating}
              >
                + Cadastrar novo lote
              </button>
            </div>
          </div>

          <LotSummary
            total={lots.length}
            stable={summary.stable}
            attention={summary.attention}
            critical={summary.critical}
          />

          {message && (
            <p className="lot-management-message" role="status">
              {message}
            </p>
          )}

          <LotRegistry
            lots={visibleLots}
            query={query}
            onQueryChange={setQuery}
            onEdit={startEditing}
            onDelete={setDeleteTarget}
          />

          <div className="lot-form-shell" id="cadastro-lote">
            <LotForm
              key={editingLot?.id ?? "new"}
              lots={lots}
              lot={editingLot}
              minimumWeight={minimumEditingWeight}
              onSave={saveLot}
              onCancel={() => setEditingLot(null)}
            />
          </div>
        </div>
      </section>

      <DeleteLotDialog
        lot={deleteTarget}
        relations={deleteRelations}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </Translated>
  );
}
