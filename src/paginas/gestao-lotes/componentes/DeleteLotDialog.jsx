import { Dialog } from "../../../componentes/Dialog";
import { Translated } from "../../../traducoes/I18nContext";

export function DeleteLotDialog({ lot, relations, onConfirm, onClose }) {
  const destinationCount = relations?.destinations ?? 0;
  const decisionCount = relations?.decisions ?? 0;
  const blocked = destinationCount > 0 || decisionCount > 0;

  return (
    <Dialog
      open={Boolean(lot)}
      onClose={onClose}
      role="alertdialog"
      labelledBy="lot-delete-title"
      describedBy="lot-delete-description"
      className="lot-delete-dialog"
    >
      <Translated>
        {lot && (
          <>
            <span>Confirmação necessária</span>
            <h2 id="lot-delete-title">
              {blocked ? (
                <>O lote {lot.id} possui histórico operacional</>
              ) : (
                <>Excluir o lote {lot.id}?</>
              )}
            </h2>
            {blocked ? (
              <p id="lot-delete-description">
                A exclusão foi bloqueada para preservar {destinationCount}{" "}
                {destinationCount === 1 ? "destinação" : "destinações"} e{" "}
                {decisionCount}{" "}
                {decisionCount === 1
                  ? "decisão de resgate"
                  : "decisões de resgate"}
                . Mantenha o lote como registro auditável dos fluxos
                relacionados.
              </p>
            ) : (
              <p id="lot-delete-description">
                O registro de {lot.product} será removido da gestão, da busca e
                do monitoramento deste navegador.
              </p>
            )}
            <div>
              {!blocked && (
                <button className="danger" type="button" onClick={onConfirm}>
                  Sim, excluir lote
                </button>
              )}
              <button data-autofocus type="button" onClick={onClose}>
                {blocked ? "Entendi" : "Cancelar"}
              </button>
            </div>
          </>
        )}
      </Translated>
    </Dialog>
  );
}
