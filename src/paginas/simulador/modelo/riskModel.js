import {
  coverageProfiles,
  foodProfiles,
  historyProfiles,
  packagingProfiles,
  sensorProfiles,
  stageProfiles,
} from "./riskProfiles.js";
import { clamp, round } from "../../../utilitarios/number.js";

export {
  coverageProfiles,
  foodProfiles,
  historyProfiles,
  initialRiskValues,
  mitigationOptions,
  packagingProfiles,
  sensorProfiles,
  stageProfiles,
} from "./riskProfiles.js";

const deviation = (value, [min, max]) =>
  value < min ? min - value : value > max ? value - max : 0;

function levelFor(score) {
  if (score <= 24)
    return {
      label: "Risco baixo",
      className: "risk-low",
      short: "Baixo",
    };
  if (score <= 49)
    return {
      label: "Risco moderado",
      className: "risk-medium",
      short: "Moderado",
    };
  if (score <= 74)
    return { label: "Risco alto", className: "risk-high", short: "Alto" };
  return {
    label: "Risco crítico",
    className: "risk-critical",
    short: "Crítico",
  };
}

function impactFrom(food, weight, remainingShelfLife) {
  const volumeImpact =
    weight < 100
      ? 1
      : weight < 500
        ? 2
        : weight < 1500
          ? 3
          : weight < 5000
            ? 4
            : 5;
  const shelfImpact =
    remainingShelfLife <= 20 ? 5 : remainingShelfLife <= 40 ? 4 : 2;
  return clamp(
    Math.round(food.impact * 0.55 + volumeImpact * 0.3 + shelfImpact * 0.15),
    1,
    5,
  );
}

function buildActionPlan(level, highestFactor, sensor) {
  const immediate = level.className === "risk-critical";
  const elevated = ["risk-critical", "risk-high"].includes(level.className);

  return [
    {
      order: "01",
      title: immediate ? "Conter o lote" : "Confirmar a ocorrência",
      description: immediate
        ? "Suspender movimentação e manter o lote identificado até avaliação responsável."
        : "Validar a leitura, o horário e a associação ao lote antes de decidir.",
      owner: "Líder de qualidade",
      deadline: immediate ? "Agora · até 15 min" : "Até 30 min",
    },
    {
      order: "02",
      title: "Tratar o principal desvio",
      description: `Atuar primeiro sobre ${highestFactor.label.toLowerCase()}, atualmente o maior componente do índice.`,
      owner: "Equipe operacional",
      deadline: elevated ? "Até 45 min" : "Próximo ciclo",
    },
    {
      order: "03",
      title:
        sensor.label === "Normal"
          ? "Confirmar estabilidade"
          : "Restaurar telemetria",
      description:
        sensor.label === "Normal"
          ? "Coletar nova leitura e verificar se a condição permanece dentro da faixa."
          : "Inspecionar o dispositivo e obter uma medição independente para reduzir incerteza.",
      owner: "Manutenção / IoT",
      deadline: elevated ? "Até 1 h" : "Até 2 h",
    },
    {
      order: "04",
      title: "Registrar decisão e evidências",
      description:
        "Documentar leituras, responsável, ação executada, condição final e destino do lote.",
      owner: "Responsável pelo lote",
      deadline: "Antes do encerramento",
    },
  ];
}

export function normalizeRiskValues(values) {
  const normalizeNumber = (value) => {
    if (value === null || (typeof value === "string" && !value.trim())) {
      return Number.NaN;
    }

    return Number(value);
  };

  return {
    ...values,
    temperatura: normalizeNumber(values.temperatura),
    umidade: normalizeNumber(values.umidade),
    tempo: normalizeNumber(values.tempo),
    atraso: normalizeNumber(values.atraso),
    peso: normalizeNumber(values.peso),
    vidaUtil: normalizeNumber(values.vidaUtil),
  };
}

export function validateRiskValues(values) {
  const errors = [];
  if (
    !Number.isFinite(values.temperatura) ||
    values.temperatura < -10 ||
    values.temperatura > 40
  )
    errors.push("Temperatura deve estar entre -10°C e 40°C.");
  if (
    !Number.isFinite(values.umidade) ||
    values.umidade < 0 ||
    values.umidade > 100
  )
    errors.push("Umidade deve estar entre 0% e 100%.");
  if (!Number.isFinite(values.tempo) || values.tempo <= 0 || values.tempo > 240)
    errors.push("Tempo deve ser maior que 0 e até 240 horas.");
  if (
    "peso" in values &&
    (!Number.isFinite(values.peso) || values.peso < 1 || values.peso > 50000)
  )
    errors.push("Peso deve estar entre 1 kg e 50.000 kg.");
  if (
    "vidaUtil" in values &&
    (!Number.isFinite(values.vidaUtil) ||
      values.vidaUtil < 0 ||
      values.vidaUtil > 100)
  )
    errors.push("Vida útil remanescente deve estar entre 0% e 100%.");
  if (
    "atraso" in values &&
    (!Number.isFinite(values.atraso) || values.atraso < 0 || values.atraso > 72)
  )
    errors.push("Atraso deve estar entre 0 e 72 horas.");
  return errors;
}

export function calculateRisk(values) {
  const food = foodProfiles[values.produto] ?? foodProfiles.outros;
  const stage = stageProfiles[values.etapa] ?? stageProfiles.producao;
  const sensor = sensorProfiles[values.sensor] ?? sensorProfiles.normal;
  const packaging =
    packagingProfiles[values.embalagem] ?? packagingProfiles.integra;
  const history = historyProfiles[values.historico] ?? historyProfiles.estavel;
  const coverage =
    coverageProfiles[values.cobertura] ?? coverageProfiles.continua;
  const weight = Number.isFinite(values.peso) ? values.peso : 100;
  const remainingShelfLife = Number.isFinite(values.vidaUtil)
    ? values.vidaUtil
    : 70;
  const delay = Number.isFinite(values.atraso) ? values.atraso : 0;

  const tempDeviation = deviation(values.temperatura, food.temp);
  const humidityDeviation = deviation(values.umidade, food.humidity);
  const tempSpan = Math.max(food.temp[1] - food.temp[0], 2);

  const factors = [
    {
      id: "food",
      label: "Sensibilidade do produto",
      value: round((food.sensitivity / 30) * 8),
      max: 8,
    },
    {
      id: "temperature",
      label: "Desvio de temperatura",
      value: round(clamp(tempDeviation / (tempSpan * 1.25), 0, 1) * 23),
      max: 23,
    },
    {
      id: "humidity",
      label: "Desvio de umidade",
      value: round(clamp(humidityDeviation / 18, 0, 1) * 9),
      max: 9,
    },
    {
      id: "exposure",
      label: "Tempo de exposição",
      value: round(clamp(values.tempo / (food.maxTime * 2), 0, 1) * 14),
      max: 14,
    },
    {
      id: "delay",
      label: "Atraso logístico",
      value: round(clamp(delay / 12, 0, 1) * 6),
      max: 6,
    },
    {
      id: "stage",
      label: "Etapa da cadeia",
      value: round((stage.risk / 15) * 5),
      max: 5,
    },
    {
      id: "packaging",
      label: "Integridade da embalagem",
      value: round((packaging.risk / 12) * 10),
      max: 10,
    },
    {
      id: "history",
      label: "Histórico de desvios",
      value: round((history.risk / 14) * 12),
      max: 12,
    },
    {
      id: "sensor",
      label: "Confiabilidade do sensor",
      value: round((sensor.risk / 26) * 7),
      max: 7,
    },
    {
      id: "coverage",
      label: "Cobertura dos dados",
      value: round((coverage.risk / 8) * 6),
      max: 6,
    },
  ].map((factor) => ({
    ...factor,
    percentage: Math.round((factor.value / factor.max) * 100),
  }));

  const probabilityIndex = clamp(
    factors.reduce((sum, factor) => sum + factor.value, 0),
    0,
    100,
  );
  const likelihood = clamp(Math.ceil(Math.max(probabilityIndex, 1) / 20), 1, 5);
  const impact = impactFrom(food, weight, remainingShelfLife);
  const matrixScore = likelihood * impact;
  const score = Math.round(
    clamp(probabilityIndex * 0.72 + (matrixScore / 25) * 100 * 0.28, 0, 100),
  );
  const level = levelFor(score);
  const confidence = clamp(
    96 - sensor.confidencePenalty - coverage.confidencePenalty,
    30,
    96,
  );
  const uncertaintyMargin = Math.round(2 + (100 - confidence) * 0.16);
  const highestFactor = factors.reduce((highest, factor) =>
    factor.value > highest.value ? factor : highest,
  );
  const estimatedExposure = Math.round(
    weight * clamp(0.03 + (score / 100) * 0.29, 0.03, 0.32),
  );
  const avoidableExposure = Math.round(estimatedExposure * 0.68);

  const decisionWindow =
    level.className === "risk-critical"
      ? "Imediata · até 15 min"
      : level.className === "risk-high"
        ? "Prioritária · até 1 h"
        : level.className === "risk-medium"
          ? "Programada · até 4 h"
          : "Rotina · próxima leitura";

  return {
    score,
    level,
    probabilityIndex: Math.round(probabilityIndex),
    likelihood,
    impact,
    matrixScore,
    confidence,
    uncertainty: {
      min: clamp(score - uncertaintyMargin, 0, 100),
      max: clamp(score + uncertaintyMargin, 0, 100),
      margin: uncertaintyMargin,
    },
    food,
    stage,
    sensor,
    packaging,
    history,
    coverage,
    factors: [...factors].sort((a, b) => b.value - a.value),
    highestFactor,
    decisionWindow,
    estimatedExposure,
    avoidableExposure,
    actionPlan: buildActionPlan(level, highestFactor, sensor),
    thresholds: {
      temperature: food.temp,
      humidity: food.humidity,
      maxTime: food.maxTime,
      currentTemperature: values.temperatura,
      currentHumidity: values.umidade,
      currentTime: values.tempo,
      tempDeviation,
      humidityDeviation,
    },
  };
}

export function applyMitigations(values, selectedControls) {
  const next = { ...values };
  const selected = new Set(selectedControls);
  const food = foodProfiles[next.produto] ?? foodProfiles.outros;

  if (selected.has("temperature")) {
    next.temperatura = round((food.temp[0] + food.temp[1]) / 2);
    next.umidade = Math.round((food.humidity[0] + food.humidity[1]) / 2);
  }
  if (selected.has("exposure")) {
    next.tempo = Math.min(next.tempo, round(food.maxTime * 0.5));
    next.atraso = 0;
  }
  if (selected.has("sensor")) {
    next.sensor = "normal";
    next.cobertura = "continua";
  }
  if (selected.has("packaging")) {
    next.embalagem = "integra";
    next.historico = "estavel";
  }

  return next;
}
