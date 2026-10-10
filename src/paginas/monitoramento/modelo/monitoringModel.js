import { lots as baseLots } from "../../../dados/lotData.js";
import {
  calculateLotRisk,
  riskToStatus,
} from "../../gestao-lotes/modelo/lotModel.js";
import { clamp, round } from "../../../utilitarios/number.js";

export const DEFAULT_LIVE_UPDATE_INTERVAL = 2000;
export const LIVE_UPDATE_INTERVALS = [1000, 2000, 5000];

export const metricDefinitions = [
  {
    key: "stock",
    label: "Estoque disponível",
    shortLabel: "Estoque",
    unit: "kg",
    maximum: 15000,
    target: 10000,
    description: "Volume consolidado nas unidades monitoradas",
  },
  {
    key: "production",
    label: "Ritmo de produção",
    shortLabel: "Produção",
    unit: "kg/h",
    maximum: 160,
    target: 145,
    description: "Produção processada na última hora",
  },
  {
    key: "availability",
    label: "Disponibilidade operacional",
    shortLabel: "Disponibilidade",
    unit: "%",
    maximum: 100,
    target: 97,
    description: "Tempo disponível de linhas e infraestrutura",
  },
  {
    key: "coldChainCompliance",
    label: "Conformidade da cadeia fria",
    shortLabel: "Cadeia fria",
    unit: "%",
    maximum: 100,
    target: 98,
    description: "Leituras dentro das faixas térmicas definidas",
  },
  {
    key: "sensorCoverage",
    label: "Cobertura de sensores",
    shortLabel: "Sensores online",
    unit: "%",
    maximum: 100,
    target: 98,
    description: "Dispositivos transmitindo dentro do intervalo esperado",
  },
  {
    key: "quality",
    label: "Índice de qualidade",
    shortLabel: "Qualidade",
    unit: "%",
    maximum: 100,
    target: 95,
    description: "Qualidade estimada dos lotes ativos",
  },
  {
    key: "wasteAvoided",
    label: "Volume potencial protegido",
    shortLabel: "Volume protegido",
    unit: "kg",
    maximum: 700,
    target: 500,
    description: "Volume potencial associado a intervenções preventivas",
  },
  {
    key: "avgResponse",
    label: "Tempo médio de resposta",
    shortLabel: "Resposta",
    unit: "min",
    maximum: 30,
    target: 12,
    inverse: true,
    description: "Tempo entre detecção e início do tratamento",
  },
];

const FACILITY_BLUEPRINTS = [
  {
    id: "PLT-SP-01",
    name: "Planta São Paulo",
    type: "Produção e distribuição",
    city: "São Paulo, SP",
    baseTemperature: 4.2,
    baseHumidity: 72,
    capacity: 4200,
    totalSensors: 24,
    productionShare: 0.46,
  },
  {
    id: "CD-CPS-02",
    name: "Centro Campinas",
    type: "Centro de distribuição",
    city: "Campinas, SP",
    baseTemperature: 5.1,
    baseHumidity: 76,
    capacity: 3100,
    totalSensors: 18,
    productionShare: 0.28,
  },
  {
    id: "ARM-SOR-03",
    name: "Armazém Sorocaba",
    type: "Armazenamento refrigerado",
    city: "Sorocaba, SP",
    baseTemperature: 3.6,
    baseHumidity: 68,
    capacity: 2600,
    totalSensors: 16,
    productionShare: 0.16,
  },
  {
    id: "HUB-SJC-04",
    name: "Hub São José",
    type: "Cross-docking",
    city: "São José dos Campos, SP",
    baseTemperature: 6.4,
    baseHumidity: 71,
    capacity: 1800,
    totalSensors: 12,
    productionShare: 0.1,
  },
];

const SENSOR_BLUEPRINTS = [
  ["TS-101", "PLT-SP-01", "Câmara A", "Temperatura + umidade", 3.8, 74, 92],
  ["TS-102", "PLT-SP-01", "Linha de laticínios", "Temperatura", 5.2, 68, 88],
  ["TS-103", "PLT-SP-01", "Doca 2", "Temperatura + umidade", 7.4, 76, 71],
  [
    "TS-204",
    "CD-CPS-02",
    "Câmara de hortaliças",
    "Temperatura + umidade",
    4.1,
    89,
    83,
  ],
  ["TS-205", "CD-CPS-02", "Área de separação", "Temperatura", 8.6, 73, 64],
  ["TS-306", "ARM-SOR-03", "Câmara B", "Temperatura + umidade", 2.2, 66, 79],
  ["TS-307", "ARM-SOR-03", "Estoque 3", "Temperatura + umidade", 7.9, 90, 57],
  ["TS-408", "HUB-SJC-04", "Doca refrigerada", "Temperatura", 6.7, 70, 46],
];

const ROUTE_BLUEPRINTS = [
  {
    id: "RT-SP-04",
    vehicle: "FR-2048",
    facilityId: "PLT-SP-01",
    product: "Frutas",
    origin: "São Paulo",
    destination: "Campinas",
    baseProgress: 63,
    baseTemperature: 6.2,
    eta: 48,
  },
  {
    id: "RT-CPS-11",
    vehicle: "FR-1182",
    facilityId: "CD-CPS-02",
    product: "Laticínios",
    origin: "Campinas",
    destination: "Sorocaba",
    baseProgress: 41,
    baseTemperature: 4.6,
    eta: 72,
  },
  {
    id: "RT-SOR-07",
    vehicle: "FR-3091",
    facilityId: "ARM-SOR-03",
    product: "Carnes",
    origin: "Sorocaba",
    destination: "São Paulo",
    baseProgress: 78,
    baseTemperature: 2.3,
    eta: 31,
  },
  {
    id: "RT-SJC-09",
    vehicle: "FR-4420",
    facilityId: "HUB-SJC-04",
    product: "Hortaliças",
    origin: "São José dos Campos",
    destination: "São Paulo",
    baseProgress: 24,
    baseTemperature: 5.4,
    eta: 96,
  },
];

const INVENTORY_CAPACITIES = Object.freeze({
  Laticínios: 3500,
  Hortaliças: 4500,
  Frutas: 3500,
  Carnes: 2500,
  Outros: 1500,
});

const RISK_FRESHNESS = Object.freeze({
  baixo: 97,
  medio: 88,
  alto: 72,
});

const EVENT_TEMPLATES = [
  {
    facilityId: "PLT-SP-01",
    tone: "success",
    severity: "informativo",
    category: "produção",
    title: "Produção atualizada",
    text: "A linha principal registrou um novo ciclo de produção.",
    source: "Linha L-01",
    location: "Planta São Paulo",
    recommendation: "Manter acompanhamento do ritmo por hora.",
  },
  {
    facilityId: null,
    tone: "info",
    severity: "baixa",
    category: "estoque",
    title: "Estoque sincronizado",
    text: "Entradas e saídas foram consolidadas no estoque disponível.",
    source: "WMS FreshSense",
    location: "Todas as unidades",
    recommendation: "Nenhuma ação imediata necessária.",
  },
  {
    facilityId: "PLT-SP-01",
    tone: "warning",
    severity: "alta",
    category: "temperatura",
    title: "Lote em observação",
    text: "Uma variação de temperatura entrou na faixa de atenção.",
    source: "Sensor TS-103",
    location: "Doca 2 · Planta São Paulo",
    recommendation: "Validar leitura e priorizar descarga do lote LT-811.",
  },
  {
    facilityId: "ARM-SOR-03",
    tone: "success",
    severity: "informativo",
    category: "expedição",
    title: "Expedição liberada",
    text: "Uma carga foi validada e está pronta para distribuição.",
    source: "Rota RT-SOR-07",
    location: "Armazém Sorocaba",
    recommendation: "Confirmar lacre e documentação de transporte.",
  },
  {
    facilityId: null,
    tone: "info",
    severity: "média",
    category: "qualidade",
    title: "Qualidade recalculada",
    text: "Os indicadores de conservação foram processados novamente.",
    source: "Motor de qualidade",
    location: "Operação consolidada",
    recommendation: "Revisar lotes com índice inferior a 90%.",
  },
  {
    facilityId: "HUB-SJC-04",
    tone: "warning",
    severity: "crítica",
    category: "conectividade",
    title: "Sensor com comunicação instável",
    text: "O intervalo desde a última transmissão excedeu o limite operacional.",
    source: "Sensor TS-408",
    location: "Hub São José",
    recommendation: "Acionar inspeção do gateway e conferir a leitura local.",
  },
];

function wave(tick, speed, amplitude, phase = 0) {
  return Math.sin(tick * speed + phase) * amplitude;
}

function calculateMetrics(tick) {
  return {
    stock: Math.round(2860 + wave(tick, 0.62, 90) + wave(tick, 0.21, 35, 1.4)),
    production: Math.round(132 + wave(tick, 0.8, 15)),
    availability: round(97.1 + wave(tick, 0.43, 1.1, 1), 1),
    coldChainCompliance: round(98.2 + wave(tick, 0.31, 0.9, 0.5), 1),
    sensorCoverage: round(97.4 + wave(tick, 0.27, 1.4, 1.8), 1),
    quality: round(95.2 + wave(tick, 0.37, 1.4), 1),
    wasteAvoided: Math.round(486 + wave(tick, 0.24, 46, 0.8)),
    avgResponse: round(11.6 + wave(tick, 0.34, 2.1, 2.4), 1),
    activeLots: 184 + (tick % 5),
    alerts: 1 + (tick % 6 === 0 ? 1 : 0),
    shipments: 18 + (tick % 7),
    energyEfficiency: round(91.8 + wave(tick, 0.19, 2.4), 1),
  };
}

function createFacilities(tick, metrics) {
  return FACILITY_BLUEPRINTS.map((facility, index) => {
    const temperature = round(
      facility.baseTemperature + wave(tick, 0.35, 0.38, index),
      1,
    );
    const humidity = Math.round(
      facility.baseHumidity + wave(tick, 0.29, 2.2, index * 0.7),
    );
    const offlineSensors = index === 3 && tick % 7 < 3 ? 1 : 0;
    const alertCount = temperature > 6.7 || offlineSensors ? 1 : 0;

    return {
      ...facility,
      temperature,
      humidity,
      occupancy: Math.round(62 + index * 7 + wave(tick, 0.22, 5, index)),
      onlineSensors: facility.totalSensors - offlineSensors,
      alertCount,
      production: Math.round(metrics.production * facility.productionShare),
      status: alertCount ? "atencao" : "operacional",
    };
  });
}

function createSensors(tick) {
  return SENSOR_BLUEPRINTS.map((sensor, index) => {
    const [
      id,
      facilityId,
      location,
      type,
      baseTemperature,
      baseHumidity,
      baseBattery,
    ] = sensor;
    const temperature = round(
      baseTemperature + wave(tick, 0.41, 0.32, index * 0.8),
      1,
    );
    const humidity = Math.round(
      baseHumidity + wave(tick, 0.33, 2, index * 0.6),
    );
    const battery = Math.max(12, round(baseBattery - (tick % 120) * 0.03, 1));
    const intermittent = id === "TS-408" && tick % 7 < 3;
    const signal = intermittent
      ? 31
      : Math.round(74 + wave(tick, 0.26, 14, index));
    const thermalAlert = temperature > 7.6 && ["TS-103", "TS-307"].includes(id);

    return {
      id,
      facilityId,
      location,
      type,
      temperature,
      humidity,
      battery,
      signal,
      lastSeenSeconds: intermittent
        ? 84 + (tick % 10)
        : 2 + ((tick + index) % 6),
      status: intermittent
        ? "offline"
        : thermalAlert || battery < 50
          ? "atencao"
          : "online",
    };
  });
}

function createRoutes(tick) {
  return ROUTE_BLUEPRINTS.map((route, index) => {
    const progress = clamp(route.baseProgress + (tick % 50) * 0.45, 0, 98);
    const temperature = round(
      route.baseTemperature + wave(tick, 0.38, 0.42, index),
      1,
    );
    const attention = index === 0 && temperature > 6.35;

    return {
      ...route,
      progress: round(progress, 1),
      temperature,
      eta: Math.max(8, route.eta - (tick % 30)),
      status: attention ? "atencao" : "em-rota",
    };
  });
}

function createInventory(tick, lots) {
  const categories = [...new Set(lots.map((lot) => lot.category || "Outros"))];

  return categories.sort().map((category, index) => {
    const categoryLots = lots.filter(
      (lot) => (lot.category || "Outros") === category,
    );
    const amount = Math.round(
      categoryLots.reduce((total, lot) => total + Number(lot.weight || 0), 0),
    );
    const configuredCapacity =
      INVENTORY_CAPACITIES[category] ?? INVENTORY_CAPACITIES.Outros;
    const capacity = Math.max(
      configuredCapacity,
      Math.ceil((amount * 1.15) / 100) * 100,
    );
    const freshnessBase =
      categoryLots.reduce(
        (total, lot) => total + (RISK_FRESHNESS[lot.risk] ?? 85),
        0,
      ) / Math.max(categoryLots.length, 1);

    return {
      category,
      amount,
      capacity,
      occupancy: Math.round((amount / capacity) * 100),
      freshness: round(
        clamp(freshnessBase + wave(tick, 0.18, 0.6, index), 0, 100),
        1,
      ),
      turnoverHours: Math.round(18 + index * 4 + wave(tick, 0.16, 3, index)),
    };
  });
}

export function createMonitoringEvent(tick, date = new Date()) {
  const template = EVENT_TEMPLATES[tick % EVENT_TEMPLATES.length];

  return {
    id: `${date.getTime()}-${tick}`,
    incidentId: `INC-${String(1042 + tick).padStart(5, "0")}`,
    ...template,
    status: "aberto",
    owner: null,
    time: date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
}

export function createOperationsSnapshot(tick, sourceLots = baseLots) {
  const metrics = { ...calculateMetrics(tick), activeLots: sourceLots.length };
  const lots = sourceLots.map((lot, index) => {
    const temperature = round(
      lot.temperature + wave(tick, 0.65, 0.28, index),
      1,
    );
    const humidity = Math.round(
      clamp(lot.humidity + wave(tick, 0.42, 2, index + 1.4), 0, 100),
    );
    const risk = calculateLotRisk(
      temperature,
      lot.minTemperature,
      lot.maxTemperature,
    );

    return {
      ...lot,
      temperature,
      humidity,
      risk,
      status: riskToStatus(risk),
    };
  });
  metrics.stock = Math.round(
    lots.reduce((total, lot) => total + Number(lot.weight || 0), 0),
  );
  const metricHistory = Array.from({ length: 30 }, (_, index) => {
    const pointTick = Math.max(0, tick - 29 + index);
    return {
      slot: index,
      cycle: pointTick,
      annotation:
        pointTick > 0 && pointTick % 9 === 0 ? "Limite operacional" : null,
      ...calculateMetrics(pointTick),
      stock: metrics.stock,
    };
  });
  const facilities = createFacilities(tick, metrics);
  const sensors = createSensors(tick);
  const routes = createRoutes(tick);
  const inventory = createInventory(tick, lots);
  const attentionLots = lots.filter((lot) => lot.status === "atencao").length;
  const criticalLots = lots.filter((lot) => lot.status === "critico").length;

  return {
    tick,
    metrics,
    lots,
    metricHistory,
    facilities,
    sensors,
    routes,
    inventory,
    qualityDistribution: {
      stable: Math.max(0, lots.length - attentionLots - criticalLots),
      attention: attentionLots,
      critical: criticalLots,
    },
    compliance: {
      dataContinuity: round(99.2 + wave(tick, 0.2, 0.5), 1),
      documentedLots: round(97.6 + wave(tick, 0.23, 0.8, 1), 1),
      excursionMinutes: Math.max(0, Math.round(16 + wave(tick, 0.28, 8))),
      openAudits: 2 + (tick % 3 === 0 ? 1 : 0),
      calibrationDue: sensors.filter((sensor) => sensor.battery < 55).length,
    },
  };
}
