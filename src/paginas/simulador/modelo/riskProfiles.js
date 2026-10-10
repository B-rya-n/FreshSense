export const foodProfiles = {
  frutas: {
    label: "Frutas",
    sensitivity: 10,
    impact: 3,
    temp: [6, 12],
    humidity: [70, 90],
    maxTime: 18,
  },
  verduras: {
    label: "Verduras",
    sensitivity: 14,
    impact: 3,
    temp: [2, 7],
    humidity: [82, 96],
    maxTime: 12,
  },
  laticinios: {
    label: "Laticínios",
    sensitivity: 22,
    impact: 4,
    temp: [1, 5],
    humidity: [60, 78],
    maxTime: 8,
  },
  carnes: {
    label: "Carnes",
    sensitivity: 26,
    impact: 5,
    temp: [-1, 4],
    humidity: [60, 75],
    maxTime: 6,
  },
  graos: {
    label: "Grãos",
    sensitivity: 6,
    impact: 2,
    temp: [12, 25],
    humidity: [45, 65],
    maxTime: 72,
  },
  outros: {
    label: "Outros",
    sensitivity: 12,
    impact: 3,
    temp: [4, 14],
    humidity: [55, 80],
    maxTime: 16,
  },
};

export const stageProfiles = {
  producao: { label: "Produção", risk: 2 },
  armazenamento: { label: "Armazenamento", risk: 7 },
  transporte: { label: "Transporte", risk: 15 },
  distribuicao: { label: "Distribuição", risk: 13 },
};

export const sensorProfiles = {
  normal: { label: "Normal", risk: 0, confidencePenalty: 0 },
  instavel: { label: "Instável", risk: 12, confidencePenalty: 18 },
  "sem-sinal": { label: "Sem sinal", risk: 26, confidencePenalty: 42 },
};

export const packagingProfiles = {
  integra: { label: "Íntegra e lacrada", risk: 0 },
  danificada: { label: "Danos visíveis", risk: 6 },
  aberta: { label: "Aberta ou sem lacre", risk: 12 },
};

export const historyProfiles = {
  estavel: { label: "Sem desvios anteriores", risk: 0 },
  pontual: { label: "Um desvio breve", risk: 7 },
  recorrente: { label: "Desvios recorrentes", risk: 14 },
};

export const coverageProfiles = {
  continua: { label: "Leitura contínua", risk: 0, confidencePenalty: 0 },
  intermitente: {
    label: "Leitura intermitente",
    risk: 4,
    confidencePenalty: 15,
  },
  pontual: { label: "Leitura pontual", risk: 8, confidencePenalty: 30 },
};

export const initialRiskValues = {
  produto: "frutas",
  peso: 480,
  vidaUtil: 72,
  etapa: "producao",
  temperatura: 7,
  umidade: 78,
  tempo: 8,
  atraso: 0,
  embalagem: "integra",
  historico: "estavel",
  sensor: "normal",
  cobertura: "continua",
};

export const mitigationOptions = [
  {
    id: "temperature",
    label: "Restabelecer condição térmica",
    description: "Simula transferência para a faixa central do produto.",
  },
  {
    id: "exposure",
    label: "Reduzir exposição e atraso",
    description: "Simula priorização da rota e eliminação do atraso.",
  },
  {
    id: "sensor",
    label: "Restaurar telemetria",
    description: "Simula sensor normal e cobertura contínua.",
  },
  {
    id: "packaging",
    label: "Conter e proteger o lote",
    description: "Simula embalagem íntegra e interrupção de recorrência.",
  },
];
