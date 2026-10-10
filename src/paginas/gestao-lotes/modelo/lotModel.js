export const emptyLotForm = Object.freeze({
  id: "",
  product: "",
  category: "",
  origin: "",
  destination: "",
  stage: "Produção",
  location: "",
  temperature: "",
  humidity: "",
  minTemperature: "",
  maxTemperature: "",
  sensorId: "",
  weight: "",
});

const requiredTextFields = {
  product: "Informe o produto.",
  category: "Selecione a categoria.",
  origin: "Informe a origem.",
  destination: "Informe o destino.",
  stage: "Selecione a etapa da cadeia.",
  location: "Informe a localização atual.",
  sensorId: "Informe o sensor vinculado.",
};

export function calculateLotRisk(temperature, minTemperature, maxTemperature) {
  const current = Number(temperature);
  const minimum = Number(minTemperature);
  const maximum = Number(maxTemperature);

  if (![current, minimum, maximum].every(Number.isFinite)) return "baixo";
  if (current < minimum - 2 || current > maximum + 2) return "alto";
  if (current < minimum || current > maximum) return "medio";
  return "baixo";
}

export function riskToStatus(risk) {
  return { baixo: "estavel", medio: "atencao", alto: "critico" }[risk];
}

export function validateLot(
  values,
  lots = [],
  editingId = null,
  minimumWeight = 0,
) {
  const errors = {};
  const id = String(values.id ?? "")
    .trim()
    .toUpperCase();

  if (!id) errors.id = "Informe o código do lote.";
  else if (!/^[A-Z0-9-]{3,20}$/.test(id))
    errors.id = "Use de 3 a 20 letras, números ou hífens.";
  else if (
    lots.some(
      (lot) =>
        lot.id.toUpperCase() === id && lot.id.toUpperCase() !== editingId,
    )
  )
    errors.id = "Já existe um lote com este código.";

  Object.entries(requiredTextFields).forEach(([field, message]) => {
    if (!String(values[field] ?? "").trim()) errors[field] = message;
  });

  const temperature = Number(values.temperature);
  const humidity = Number(values.humidity);
  const minTemperature = Number(values.minTemperature);
  const maxTemperature = Number(values.maxTemperature);
  const weight = Number(values.weight);
  const hasValue = (value) => String(value ?? "").trim() !== "";

  if (!hasValue(values.temperature) || !Number.isFinite(temperature))
    errors.temperature = "Informe uma temperatura válida.";
  if (
    !hasValue(values.humidity) ||
    !Number.isFinite(humidity) ||
    humidity < 0 ||
    humidity > 100
  )
    errors.humidity = "A umidade deve estar entre 0 e 100%.";
  if (!hasValue(values.minTemperature) || !Number.isFinite(minTemperature))
    errors.minTemperature = "Informe o limite mínimo.";
  if (!hasValue(values.maxTemperature) || !Number.isFinite(maxTemperature))
    errors.maxTemperature = "Informe o limite máximo.";
  if (
    hasValue(values.minTemperature) &&
    hasValue(values.maxTemperature) &&
    Number.isFinite(minTemperature) &&
    Number.isFinite(maxTemperature) &&
    minTemperature >= maxTemperature
  )
    errors.maxTemperature = "O limite máximo deve ser maior que o mínimo.";
  if (!hasValue(values.weight) || !Number.isFinite(weight) || weight <= 0)
    errors.weight = "O peso deve ser maior que zero.";
  else if (weight < minimumWeight)
    errors.weight = `O peso não pode ser menor que ${minimumWeight.toLocaleString("pt-BR")} kg já comprometidos em destinações.`;

  return errors;
}

export function buildLotRecord(values, previous = null, now = new Date()) {
  const temperature = Number(values.temperature);
  const minTemperature = Number(values.minTemperature);
  const maxTemperature = Number(values.maxTemperature);
  const risk = calculateLotRisk(temperature, minTemperature, maxTemperature);

  return {
    id: String(values.id).trim().toUpperCase(),
    product: String(values.product).trim(),
    category: String(values.category).trim(),
    origin: String(values.origin).trim(),
    destination: String(values.destination).trim(),
    stage: String(values.stage).trim(),
    location: String(values.location).trim(),
    temperature,
    humidity: Number(values.humidity),
    minTemperature,
    maxTemperature,
    sensorId: String(values.sensorId).trim().toUpperCase(),
    weight: Number(values.weight),
    risk,
    status: riskToStatus(risk),
    createdAt: previous?.createdAt ?? now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

export function lotToFormValues(lot) {
  return Object.fromEntries(
    Object.keys(emptyLotForm).map((key) => [key, String(lot[key] ?? "")]),
  );
}
