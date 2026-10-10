import { useMemo, useRef, useState } from "react";
import { riskLabels } from "../../../dados/lotData";
import { Translated } from "../../../traducoes/I18nContext";
import { useI18n } from "../../../traducoes/useI18n";
import {
  createDestination,
  destinationTypes,
  getAvailableQuantity,
  getLotUnit,
  suggestDestination,
  validateDestination,
} from "../modelo/destinationModel";

function buildEmptyForm(initialLotId = "") {
  return {
    lotId: initialLotId,
    type: "",
    quantity: "",
    recipient: "",
    responsible: "",
    pickupDate: "",
    notes: "",
  };
}

function todayAsInputValue() {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - offset).toISOString().slice(0, 10);
}

const fieldOrder = [
  "lotId",
  "type",
  "quantity",
  "recipient",
  "pickupDate",
  "responsible",
  "notes",
];

export function DestinationForm({
  lots,
  destinations,
  institutions,
  initialLotId,
  onCreate,
}) {
  const { language, t } = useI18n();
  const locale = language === "pt" ? "pt-BR" : language;
  const validInitialLot = lots.some((lot) => lot.id === initialLotId)
    ? initialLotId
    : "";
  const [values, setValues] = useState(() => buildEmptyForm(validInitialLot));
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const fieldRefs = useRef({});
  const selectedLot = useMemo(
    () => lots.find((lot) => lot.id === values.lotId),
    [lots, values.lotId],
  );
  const availableQuantity = useMemo(
    () => getAvailableQuantity(selectedLot, destinations),
    [destinations, selectedLot],
  );
  const suggestion = useMemo(
    () => suggestDestination(selectedLot),
    [selectedLot],
  );

  function update(key, value) {
    setValues((current) =>
      key === "lotId"
        ? { ...current, lotId: value, type: "", quantity: "" }
        : { ...current, [key]: value },
    );
    setErrors((current) =>
      key === "lotId"
        ? {
            ...current,
            lotId: undefined,
            type: undefined,
            quantity: undefined,
          }
        : { ...current, [key]: undefined },
    );
    setSuccess("");
  }

  function applySuggestion() {
    if (suggestion) update("type", suggestion.type);
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validateDestination(
      values,
      selectedLot,
      availableQuantity,
    );
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstInvalidField = fieldOrder.find((key) => nextErrors[key]);
      fieldRefs.current[firstInvalidField]?.focus();
      return;
    }

    const recipient = institutions.find((item) => item.id === values.recipient);
    const destination = createDestination(values, selectedLot, recipient.name);
    onCreate(destination);
    setSuccess(`${destination.id} ${t("registrado com sucesso.")}`);
    setValues(buildEmptyForm(selectedLot.id));
  }

  return (
    <Translated>
      <article className="destination-panel destination-form-panel">
        <div className="destination-panel-heading">
          <span>Novo plano</span>
          <h2>Registrar destinação</h2>
          <p>Selecione um lote ativo e formalize sua próxima movimentação.</p>
        </div>

        <form onSubmit={submit} noValidate>
          <label htmlFor="destination-lot">
            <span>Lote</span>
            <select
              id="destination-lot"
              ref={(node) => {
                fieldRefs.current.lotId = node;
              }}
              value={values.lotId}
              onChange={(event) => update("lotId", event.target.value)}
              aria-invalid={Boolean(errors.lotId)}
              aria-describedby={
                errors.lotId ? "destination-lot-error" : undefined
              }
            >
              <option value="">Selecione...</option>
              {lots.map((lot) => {
                const available = getAvailableQuantity(lot, destinations);
                return (
                  <option key={lot.id} value={lot.id} disabled={available <= 0}>
                    {lot.id} · {t(lot.product)} ·{" "}
                    {available.toLocaleString(locale)} kg {t("disponíveis")}
                  </option>
                );
              })}
            </select>
            {errors.lotId && (
              <small
                className="destination-field-error"
                id="destination-lot-error"
              >
                {errors.lotId}
              </small>
            )}
          </label>

          {selectedLot && (
            <div className={`destination-lot-card risk-${selectedLot.risk}`}>
              <div>
                <span>
                  {t("Risco")} {t(riskLabels[selectedLot.risk])}
                </span>
                <strong>
                  {t(selectedLot.product)} · {selectedLot.id}
                </strong>
                <small>
                  {selectedLot.origin} → {selectedLot.destination} ·{" "}
                  {selectedLot.temperature.toLocaleString(locale)} °C
                </small>
              </div>
              <div>
                <strong>
                  {availableQuantity.toLocaleString(locale)}{" "}
                  {getLotUnit(selectedLot)}
                </strong>
                <small>saldo disponível</small>
              </div>
            </div>
          )}

          {suggestion && availableQuantity > 0 && (
            <div className="destination-suggestion">
              <span>Recomendação FreshSense</span>
              <strong>{t(suggestion.title)}</strong>
              <p>{t(suggestion.reason)}</p>
              <button type="button" onClick={applySuggestion}>
                Aplicar sugestão
              </button>
            </div>
          )}

          <div className="destination-form-grid">
            <label htmlFor="destination-type">
              <span>Tipo de destinação</span>
              <select
                id="destination-type"
                ref={(node) => {
                  fieldRefs.current.type = node;
                }}
                value={values.type}
                onChange={(event) => update("type", event.target.value)}
                aria-invalid={Boolean(errors.type)}
                aria-describedby={
                  errors.type ? "destination-type-error" : undefined
                }
              >
                <option value="">Selecione...</option>
                {Object.entries(destinationTypes).map(([key, label]) => (
                  <option key={key} value={key}>
                    {t(label)}
                  </option>
                ))}
              </select>
              {errors.type && (
                <small
                  className="destination-field-error"
                  id="destination-type-error"
                >
                  {errors.type}
                </small>
              )}
            </label>

            <label htmlFor="destination-quantity">
              <span>Quantidade</span>
              <div className="destination-quantity-input">
                <input
                  id="destination-quantity"
                  ref={(node) => {
                    fieldRefs.current.quantity = node;
                  }}
                  type="number"
                  min="1"
                  max={availableQuantity || undefined}
                  step="1"
                  placeholder="Ex.: 80"
                  value={values.quantity}
                  onChange={(event) => update("quantity", event.target.value)}
                  aria-invalid={Boolean(errors.quantity)}
                  aria-describedby={
                    errors.quantity ? "destination-quantity-error" : undefined
                  }
                />
                <b>{getLotUnit(selectedLot)}</b>
              </div>
              {errors.quantity && (
                <small
                  className="destination-field-error"
                  id="destination-quantity-error"
                >
                  {errors.quantity}
                </small>
              )}
            </label>

            <label htmlFor="destination-recipient">
              <span>Destino</span>
              <select
                id="destination-recipient"
                ref={(node) => {
                  fieldRefs.current.recipient = node;
                }}
                value={values.recipient}
                onChange={(event) => update("recipient", event.target.value)}
                aria-invalid={Boolean(errors.recipient)}
                aria-describedby={
                  errors.recipient ? "destination-recipient-error" : undefined
                }
              >
                <option value="">Selecione...</option>
                {institutions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.city}
                  </option>
                ))}
              </select>
              {errors.recipient && (
                <small
                  className="destination-field-error"
                  id="destination-recipient-error"
                >
                  {errors.recipient}
                </small>
              )}
            </label>

            <label htmlFor="destination-pickup-date">
              <span>Data prevista</span>
              <input
                id="destination-pickup-date"
                ref={(node) => {
                  fieldRefs.current.pickupDate = node;
                }}
                type="date"
                min={todayAsInputValue()}
                value={values.pickupDate}
                onChange={(event) => update("pickupDate", event.target.value)}
                aria-invalid={Boolean(errors.pickupDate)}
                aria-describedby={
                  errors.pickupDate
                    ? "destination-pickup-date-error"
                    : undefined
                }
              />
              {errors.pickupDate && (
                <small
                  className="destination-field-error"
                  id="destination-pickup-date-error"
                >
                  {errors.pickupDate}
                </small>
              )}
            </label>
          </div>

          <label htmlFor="destination-responsible">
            <span>Responsável</span>
            <input
              id="destination-responsible"
              ref={(node) => {
                fieldRefs.current.responsible = node;
              }}
              type="text"
              placeholder="Nome e sobrenome"
              value={values.responsible}
              onChange={(event) => update("responsible", event.target.value)}
              aria-invalid={Boolean(errors.responsible)}
              aria-describedby={
                errors.responsible ? "destination-responsible-error" : undefined
              }
            />
            {errors.responsible && (
              <small
                className="destination-field-error"
                id="destination-responsible-error"
              >
                {errors.responsible}
              </small>
            )}
          </label>

          <label htmlFor="destination-notes">
            <span>
              Observações <small>(opcional)</small>
            </span>
            <textarea
              id="destination-notes"
              ref={(node) => {
                fieldRefs.current.notes = node;
              }}
              rows="3"
              maxLength="240"
              placeholder="Orientações para retirada, transporte ou conferência..."
              value={values.notes}
              onChange={(event) => update("notes", event.target.value)}
              aria-invalid={Boolean(errors.notes)}
              aria-describedby={`destination-notes-count${
                errors.notes ? " destination-notes-error" : ""
              }`}
            />
            <small
              className="destination-character-count"
              id="destination-notes-count"
            >
              {values.notes.length}/240
            </small>
            {errors.notes && (
              <small
                className="destination-field-error"
                id="destination-notes-error"
              >
                {errors.notes}
              </small>
            )}
          </label>

          <p className="destination-compliance-note">
            <span aria-hidden="true">i</span>A destinação não substitui a
            inspeção de qualidade nem a liberação sanitária do lote.
          </p>

          {success && (
            <p className="destination-success" role="status">
              <span aria-hidden="true">✓</span> {success}
            </p>
          )}

          <button
            className="destination-submit"
            type="submit"
            disabled={!lots.length}
          >
            Registrar destinação
          </button>
        </form>
      </article>
    </Translated>
  );
}
