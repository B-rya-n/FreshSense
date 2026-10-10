import { useMemo, useState } from "react";
import { LotFormField as Field } from "../../../componentes/FormField";
import { lotStages, riskLabels } from "../../../dados/lotData";
import { Translated } from "../../../traducoes/I18nContext";
import {
  buildLotRecord,
  calculateLotRisk,
  emptyLotForm,
  lotToFormValues,
  validateLot,
} from "../modelo/lotModel";

const categories = ["Frutas", "Hortaliças", "Laticínios", "Carnes", "Outros"];

export function LotForm({ lots, lot, minimumWeight = 0, onSave, onCancel }) {
  const [values, setValues] = useState(() =>
    lot ? lotToFormValues(lot) : { ...emptyLotForm },
  );
  const [errors, setErrors] = useState({});
  const editingId = lot?.id.toUpperCase() ?? null;
  const riskPreview = useMemo(
    () =>
      calculateLotRisk(
        values.temperature,
        values.minTemperature,
        values.maxTemperature,
      ),
    [values.maxTemperature, values.minTemperature, values.temperature],
  );

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: "" }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validateLot(values, lots, editingId, minimumWeight);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() =>
        document.querySelector("#lot-form .is-invalid")?.focus(),
      );
      return;
    }

    onSave(buildLotRecord(values, lot));
    if (!lot) setValues({ ...emptyLotForm });
  }

  return (
    <Translated>
      <form id="lot-form" className="lot-form" noValidate onSubmit={submit}>
        <div className="lot-form-heading">
          <div>
            <span>{lot ? "Edição de registro" : "Novo registro"}</span>
            <h2>{lot ? `Editar ${lot.id}` : "Cadastrar lote"}</h2>
            <p>
              Informe a identificação, a condição ambiental e o sensor
              responsável pelo acompanhamento.
            </p>
          </div>
          <div className={`lot-risk-preview risk-${riskPreview}`}>
            <span>Risco calculado</span>
            <strong>{riskLabels[riskPreview]}</strong>
          </div>
        </div>

        <div className="lot-form-grid">
          <Field
            id="lot-id"
            label="Código do lote"
            error={errors.id}
            hint="Use letras, números e hífens. Ex.: LT-2048."
          >
            {({ description, invalid }) => (
              <input
                id="lot-id"
                value={values.id}
                onChange={(event) =>
                  update("id", event.target.value.toUpperCase())
                }
                aria-describedby={description}
                aria-invalid={invalid}
                className={invalid ? "is-invalid" : ""}
                disabled={Boolean(lot)}
                autoComplete="off"
              />
            )}
          </Field>

          <Field id="lot-product" label="Produto" error={errors.product}>
            {({ description, invalid }) => (
              <input
                id="lot-product"
                value={values.product}
                onChange={(event) => update("product", event.target.value)}
                aria-describedby={description}
                aria-invalid={invalid}
                className={invalid ? "is-invalid" : ""}
                placeholder="Ex.: Morango"
              />
            )}
          </Field>

          <Field id="lot-category" label="Categoria" error={errors.category}>
            {({ description, invalid }) => (
              <select
                id="lot-category"
                value={values.category}
                onChange={(event) => update("category", event.target.value)}
                aria-describedby={description}
                aria-invalid={invalid}
                className={invalid ? "is-invalid" : ""}
              >
                <option value="">Selecione</option>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            )}
          </Field>

          <Field id="lot-stage" label="Etapa da cadeia" error={errors.stage}>
            {({ description, invalid }) => (
              <select
                id="lot-stage"
                value={values.stage}
                onChange={(event) => update("stage", event.target.value)}
                aria-describedby={description}
                aria-invalid={invalid}
                className={invalid ? "is-invalid" : ""}
              >
                {lotStages.map((stage) => (
                  <option key={stage}>{stage}</option>
                ))}
              </select>
            )}
          </Field>

          <Field id="lot-origin" label="Origem" error={errors.origin}>
            {({ description, invalid }) => (
              <input
                id="lot-origin"
                value={values.origin}
                onChange={(event) => update("origin", event.target.value)}
                aria-describedby={description}
                aria-invalid={invalid}
                className={invalid ? "is-invalid" : ""}
                placeholder="Ex.: Atibaia - SP"
              />
            )}
          </Field>

          <Field
            id="lot-destination"
            label="Destino"
            error={errors.destination}
          >
            {({ description, invalid }) => (
              <input
                id="lot-destination"
                value={values.destination}
                onChange={(event) => update("destination", event.target.value)}
                aria-describedby={description}
                aria-invalid={invalid}
                className={invalid ? "is-invalid" : ""}
                placeholder="Ex.: São Paulo - SP"
              />
            )}
          </Field>

          <Field
            id="lot-location"
            label="Localização atual"
            error={errors.location}
          >
            {({ description, invalid }) => (
              <input
                id="lot-location"
                value={values.location}
                onChange={(event) => update("location", event.target.value)}
                aria-describedby={description}
                aria-invalid={invalid}
                className={invalid ? "is-invalid" : ""}
                placeholder="Ex.: Câmara A"
              />
            )}
          </Field>

          <Field
            id="lot-sensor"
            label="Sensor vinculado"
            error={errors.sensorId}
          >
            {({ description, invalid }) => (
              <input
                id="lot-sensor"
                value={values.sensorId}
                onChange={(event) =>
                  update("sensorId", event.target.value.toUpperCase())
                }
                aria-describedby={description}
                aria-invalid={invalid}
                className={invalid ? "is-invalid" : ""}
                placeholder="Ex.: TS-101"
              />
            )}
          </Field>

          <Field
            id="lot-temperature"
            label="Temperatura atual (°C)"
            error={errors.temperature}
          >
            {({ description, invalid }) => (
              <input
                id="lot-temperature"
                type="number"
                step="0.1"
                value={values.temperature}
                onChange={(event) => update("temperature", event.target.value)}
                aria-describedby={description}
                aria-invalid={invalid}
                className={invalid ? "is-invalid" : ""}
              />
            )}
          </Field>

          <Field
            id="lot-humidity"
            label="Umidade atual (%)"
            error={errors.humidity}
          >
            {({ description, invalid }) => (
              <input
                id="lot-humidity"
                type="number"
                min="0"
                max="100"
                step="1"
                value={values.humidity}
                onChange={(event) => update("humidity", event.target.value)}
                aria-describedby={description}
                aria-invalid={invalid}
                className={invalid ? "is-invalid" : ""}
              />
            )}
          </Field>

          <Field
            id="lot-min-temperature"
            label="Limite mínimo (°C)"
            error={errors.minTemperature}
          >
            {({ description, invalid }) => (
              <input
                id="lot-min-temperature"
                type="number"
                step="0.1"
                value={values.minTemperature}
                onChange={(event) =>
                  update("minTemperature", event.target.value)
                }
                aria-describedby={description}
                aria-invalid={invalid}
                className={invalid ? "is-invalid" : ""}
              />
            )}
          </Field>

          <Field
            id="lot-max-temperature"
            label="Limite máximo (°C)"
            error={errors.maxTemperature}
          >
            {({ description, invalid }) => (
              <input
                id="lot-max-temperature"
                type="number"
                step="0.1"
                value={values.maxTemperature}
                onChange={(event) =>
                  update("maxTemperature", event.target.value)
                }
                aria-describedby={description}
                aria-invalid={invalid}
                className={invalid ? "is-invalid" : ""}
              />
            )}
          </Field>

          <Field
            id="lot-weight"
            label="Peso do lote (kg)"
            error={errors.weight}
          >
            {({ description, invalid }) => (
              <input
                id="lot-weight"
                type="number"
                min="0.1"
                step="0.1"
                value={values.weight}
                onChange={(event) => update("weight", event.target.value)}
                aria-describedby={description}
                aria-invalid={invalid}
                className={invalid ? "is-invalid" : ""}
              />
            )}
          </Field>
        </div>

        <div className="lot-form-actions">
          <button className="btn-fresh" type="submit">
            {lot ? "Salvar alterações" : "Cadastrar lote"}
          </button>
          {lot && (
            <button className="btn-soft" type="button" onClick={onCancel}>
              Cancelar edição
            </button>
          )}
        </div>
      </form>
    </Translated>
  );
}
