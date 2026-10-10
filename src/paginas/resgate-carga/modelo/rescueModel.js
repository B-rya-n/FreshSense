import { clamp, round } from "../../../utilitarios/number.js";

const CATEGORY_PROFILES = {
  laticínios: { shelfLifeHours: 48, toleranceDegreeHours: 4 },
  carnes: { shelfLifeHours: 72, toleranceDegreeHours: 3 },
  frutas: { shelfLifeHours: 120, toleranceDegreeHours: 10 },
  hortaliças: { shelfLifeHours: 96, toleranceDegreeHours: 8 },
};

const DEFAULT_PROFILE = { shelfLifeHours: 72, toleranceDegreeHours: 6 };

const RISK_BASE = { baixo: 10, medio: 38, alto: 68 };

function hashText(value) {
  return [...String(value)].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
}

function getProfile(category) {
  return (
    CATEGORY_PROFILES[String(category).toLocaleLowerCase("pt-BR")] ??
    DEFAULT_PROFILE
  );
}

function getTemperatureDeviation(lot) {
  if (lot.temperature > lot.maxTemperature) {
    return lot.temperature - lot.maxTemperature;
  }

  if (lot.temperature < lot.minTemperature) {
    return lot.minTemperature - lot.temperature;
  }

  return 0;
}

export function calculateThermalBudget(lot) {
  const profile = getProfile(lot.category);
  const deviation = getTemperatureDeviation(lot);
  const riskBase = RISK_BASE[lot.risk] ?? RISK_BASE.medio;
  const exposureMinutes = Math.round(
    18 + (hashText(lot.id) % 37) + deviation * 19 + riskBase * 0.45,
  );
  const degreeHours = (deviation * exposureMinutes) / 60;
  const spentPercent = clamp(
    Math.round(
      riskBase * 0.52 + (degreeHours / profile.toleranceDegreeHours) * 100,
    ),
    4,
    96,
  );
  const remainingPercent = 100 - spentPercent;
  const shelfLifeHours = Math.max(
    2,
    Math.round((profile.shelfLifeHours * remainingPercent) / 100),
  );
  const urgency =
    remainingPercent <= 25
      ? "crítica"
      : remainingPercent <= 55
        ? "atenção"
        : "controlada";

  return {
    deviation: round(deviation),
    exposureMinutes,
    degreeHours: round(degreeHours, 2),
    spentPercent,
    remainingPercent,
    shelfLifeHours,
    urgency,
    baselineHours: profile.shelfLifeHours,
    toleranceDegreeHours: profile.toleranceDegreeHours,
    summary:
      deviation > 0
        ? `${round(deviation).toLocaleString("pt-BR")} °C fora da faixa por aproximadamente ${exposureMinutes} min.`
        : "Temperatura atual dentro da faixa operacional configurada.",
  };
}

export function buildRescueScenarios(
  lot,
  thermalBudget = calculateThermalBudget(lot),
) {
  const weight = Number(lot.weight) || 0;
  const currentLoss = clamp(5 + thermalBudget.spentPercent * 0.3, 6, 42);
  const redirectLoss = clamp(3 + thermalBudget.spentPercent * 0.13, 4, 18);
  const stabilizeLoss = clamp(2 + thermalBudget.spentPercent * 0.075, 3, 11);
  const recommendedId =
    thermalBudget.remainingPercent <= 25 || thermalBudget.deviation >= 3
      ? "stabilize"
      : thermalBudget.remainingPercent <= 55 || lot.stage === "Transporte"
        ? "redirect"
        : "continue";

  const scenarioData = [
    {
      id: "continue",
      eyebrow: "Cenário A",
      title: "Manter rota atual",
      description:
        "Segue o plano logístico sem parada adicional, com monitoramento reforçado do sensor.",
      responseMinutes: 8,
      etaMinutes: 0,
      targetTemperature: lot.temperature,
      lossPercent: currentLoss,
      riskAfter: lot.risk,
      locationAfter: lot.location,
      stageAfter: lot.stage,
      reasons: ["Sem impacto no prazo", "Maior exposição térmica acumulada"],
      actions: [
        "Aumentar frequência de leitura para 2 minutos",
        "Notificar equipe no destino",
        "Reavaliar o lote após 20 minutos",
      ],
    },
    {
      id: "redirect",
      eyebrow: "Cenário B",
      title: "Redirecionar para hub refrigerado",
      description:
        "Interrompe a rota no ponto de apoio mais próximo para inspeção e troca de veículo.",
      responseMinutes: 14,
      etaMinutes: 32,
      targetTemperature: round(
        (Number(lot.minTemperature) + Number(lot.maxTemperature)) / 2,
      ),
      lossPercent: redirectLoss,
      riskAfter: thermalBudget.remainingPercent < 30 ? "medio" : "baixo",
      locationAfter: "Hub refrigerado de contingência",
      stageAfter: "Armazenamento",
      reasons: ["Reduz a progressão do desvio", "Adiciona 32 min ao percurso"],
      actions: [
        "Reservar doca refrigerada",
        "Acionar veículo de contingência",
        "Registrar inspeção de qualidade",
      ],
    },
    {
      id: "stabilize",
      eyebrow: "Cenário C",
      title: "Estabilização térmica imediata",
      description:
        "Prioriza a recuperação da temperatura e a separação preventiva das unidades mais expostas.",
      responseMinutes: 5,
      etaMinutes: 18,
      targetTemperature: round(
        (Number(lot.minTemperature) + Number(lot.maxTemperature)) / 2,
      ),
      lossPercent: stabilizeLoss,
      riskAfter: "baixo",
      locationAfter: "Zona de estabilização térmica",
      stageAfter: "Armazenamento",
      reasons: ["Menor perda projetada", "Exige equipe disponível no local"],
      actions: [
        "Isolar o lote em zona refrigerada",
        "Aplicar protocolo de resfriamento rápido",
        "Liberar somente após duas leituras estáveis",
      ],
    },
  ];

  return scenarioData.map((scenario) => ({
    ...scenario,
    lossPercent: round(scenario.lossPercent),
    savedWeight: Math.max(
      0,
      Math.round((weight * (currentLoss - scenario.lossPercent)) / 100),
    ),
    recommended: scenario.id === recommendedId,
  }));
}

export function applyRescueScenario(lot, scenario, now = new Date()) {
  const remainsCritical = scenario.riskAfter === "alto";
  const needsAttention = scenario.riskAfter === "medio";

  return {
    ...lot,
    temperature: scenario.targetTemperature,
    risk: scenario.riskAfter,
    status: remainsCritical
      ? "critico"
      : needsAttention
        ? "atencao"
        : "estavel",
    location: scenario.locationAfter,
    stage: scenario.stageAfter,
    rescuePlan: scenario.id,
    updatedAt: now.toISOString(),
  };
}

function interpolate(start, end, ratio) {
  return round(start + (end - start) * ratio);
}

export function buildReplayFrames(
  lot,
  decisions = [],
  referenceTime = new Date(),
) {
  const lotDecisions = decisions.filter(
    (decision) => decision.lotId === lot.id,
  );
  const firstSnapshot = lotDecisions
    .filter((decision) => decision.lotSnapshot)
    .toSorted(
      (left, right) => new Date(left.createdAt) - new Date(right.createdAt),
    )[0]?.lotSnapshot;
  const historicalLot = firstSnapshot ? { ...lot, ...firstSnapshot } : lot;
  const hash = hashText(historicalLot.id);
  const currentTemperature = Number(historicalLot.temperature);
  const safeTemperature = round(
    (Number(historicalLot.minTemperature) +
      Number(historicalLot.maxTemperature)) /
      2,
  );
  const baseDate = historicalLot.createdAt ?? "2026-10-02T08:00:00-03:00";
  const baseTime = new Date(baseDate).getTime();
  const currentTime = new Date(referenceTime).getTime();
  const projectedEndTime = baseTime + (hash % 180) * 60_000;
  const endTime = Math.min(
    Number.isFinite(projectedEndTime) ? projectedEndTime : currentTime,
    currentTime,
  );
  const offsets = [-185, -145, -105, -68, -32, 0];
  const labels = [
    "Recebimento confirmado",
    "Sensor vinculado",
    "Saída da origem",
    "Primeira variação",
    "Limite operacional atingido",
    "Condição atual",
  ];
  const locations = [
    historicalLot.origin,
    historicalLot.origin,
    "Corredor logístico",
    historicalLot.location,
    historicalLot.location,
    historicalLot.location,
  ];

  const frames = offsets.map((offset, index) => {
    const ratio = index / (offsets.length - 1);
    const temperature = interpolate(safeTemperature, currentTemperature, ratio);
    const outsideRange =
      temperature < historicalLot.minTemperature ||
      temperature > historicalLot.maxTemperature;

    return {
      id: `${historicalLot.id}-frame-${index}`,
      label: labels[index],
      timestamp: new Date(endTime + offset * 60_000).toISOString(),
      location: locations[index],
      stage: index < 2 ? "Preparação" : historicalLot.stage,
      temperature,
      humidity: Math.round(
        Number(historicalLot.humidity) - 4 + (hash % 5) + ratio * 4,
      ),
      status: outsideRange ? (index >= 4 ? "critical" : "warning") : "stable",
      progress: Math.round(ratio * 100),
      detail: outsideRange
        ? "Leitura fora da faixa configurada para o lote."
        : "Condição compatível com o limite operacional.",
    };
  });

  const decisionFrames = lotDecisions.map((decision, index) => ({
    id: decision.id,
    label: `Plano executado: ${decision.scenarioTitle}`,
    timestamp: decision.createdAt,
    location: decision.location,
    stage: "Resposta operacional",
    temperature: decision.targetTemperature,
    humidity: Number(decision.lotSnapshot?.humidity ?? lot.humidity),
    status: decision.riskAfter === "baixo" ? "stable" : "warning",
    progress: 100,
    detail: `Decisão registrada por ${decision.operator}. Perda projetada de ${decision.lossPercent}%.`,
    sequence: frames.length + index,
  }));

  return [...frames, ...decisionFrames].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  );
}
