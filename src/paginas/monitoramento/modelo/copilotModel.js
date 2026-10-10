import { resolveLanguage } from "../../../utilitarios/text";

const severityWeight = {
  crítica: 4,
  alta: 3,
  média: 2,
  baixa: 1,
  informativo: 0,
};

const priorityCopy = {
  pt: {
    critical: "Crítica",
    high: "Alta",
    moderate: "Moderada",
    stable: "Estável",
  },
  en: {
    critical: "Critical",
    high: "High",
    moderate: "Moderate",
    stable: "Stable",
  },
  es: {
    critical: "Crítica",
    high: "Alta",
    moderate: "Moderada",
    stable: "Estable",
  },
};

const localeByLanguage = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

const copy = {
  pt: {
    fullScope: "Operação consolidada",
    incidentHeadline: (event) =>
      `${event.incidentId} requer avaliação coordenada`,
    incidentSummary: (event) =>
      `${event.title} em ${event.location}. O Copilot relacionou severidade, origem e contexto operacional para orientar a próxima decisão.`,
    lotHeadline: (lot) => `${lot.id} concentra a maior exposição observada`,
    lotSummary: (lot) =>
      `${lot.product} registra ${lot.temperature.toFixed(1).replace(".", ",")} °C em ${lot.location}. O lote deve ser priorizado na avaliação operacional.`,
    sensorHeadline: (sensor) =>
      `${sensor.id} precisa de verificação operacional`,
    sensorSummary: (sensor) =>
      `${sensor.location} apresenta condição ${sensor.status}. A continuidade da leitura deve ser confirmada antes de decisões sobre os lotes relacionados.`,
    stableHeadline: "Operação sem concentração crítica de risco",
    stableSummary:
      "Os sinais disponíveis permanecem dentro de uma condição administrável. O Copilot recomenda manter a vigilância sobre desvios recentes e ativos com menor cobertura.",
    activeIncidents: "Incidentes ativos",
    activeIncidentsDetail: (count) =>
      `${count} ocorrência${count === 1 ? "" : "s"} aguardando tratamento ou encerramento`,
    exposedLots: "Lotes sob atenção",
    exposedLotsDetail: (count) =>
      `${count} lote${count === 1 ? "" : "s"} fora da condição estável`,
    sensorContinuity: "Continuidade de sensores",
    sensorContinuityDetail: (count) =>
      `${count} ativo${count === 1 ? "" : "s"} offline ou em atenção`,
    coldCompliance: "Conformidade térmica",
    coldComplianceDetail: "Leituras dentro das faixas operacionais definidas",
    actionIncident: "Aplicar o procedimento do incidente",
    actionIncidentDetail: (event) => event.recommendation,
    actionLot: "Priorizar inspeção do lote",
    actionLotDetail: (lot) =>
      `Validar condição, histórico e destino do lote ${lot.id} antes da próxima movimentação.`,
    actionSensor: "Confirmar a confiabilidade da telemetria",
    actionSensorDetail: (sensor) =>
      `Verificar ${sensor.id} em ${sensor.location} e confrontar a leitura com uma referência local.`,
    actionObserve: "Manter observação orientada por exceção",
    actionObserveDetail:
      "Revisar novos alertas e alterações relevantes no próximo ciclo operacional.",
    ownerQuality: "Qualidade",
    ownerOperations: "Operações",
    ownerMaintenance: "Manutenção",
    deadlineNow: "Agora",
    deadline15: "Até 15 min",
    deadlineNext: "Próximo ciclo",
    sources: [
      "Telemetria ao vivo",
      "Histórico de incidentes",
      "Contexto dos lotes",
    ],
    responseTitle: "Leitura operacional do Copilot",
    generalResponse:
      "Cruzei alertas, telemetria, lotes e ativos do escopo atual. A prioridade deve permanecer nas exceções com maior severidade e menor confiabilidade de leitura.",
  },
  en: {
    fullScope: "Consolidated operation",
    incidentHeadline: (event) =>
      `${event.incidentId} requires coordinated assessment`,
    incidentSummary: (event) =>
      `${event.title} at ${event.location}. Copilot connected severity, source, and operational context to guide the next decision.`,
    lotHeadline: (lot) => `${lot.id} has the highest observed exposure`,
    lotSummary: (lot) =>
      `${lot.product} is at ${lot.temperature.toFixed(1)} °C in ${lot.location}. This lot should be prioritized for operational assessment.`,
    sensorHeadline: (sensor) =>
      `${sensor.id} requires operational verification`,
    sensorSummary: (sensor) =>
      `${sensor.location} is currently ${sensor.status}. Reading continuity should be confirmed before decisions are made about related lots.`,
    stableHeadline: "No critical concentration of operational risk",
    stableSummary:
      "Available signals remain within a manageable condition. Copilot recommends continued monitoring of recent deviations and lower-coverage assets.",
    activeIncidents: "Active incidents",
    activeIncidentsDetail: (count) =>
      `${count} occurrence${count === 1 ? "" : "s"} awaiting treatment or closure`,
    exposedLots: "Lots requiring attention",
    exposedLotsDetail: (count) =>
      `${count} lot${count === 1 ? "" : "s"} outside stable condition`,
    sensorContinuity: "Sensor continuity",
    sensorContinuityDetail: (count) =>
      `${count} asset${count === 1 ? "" : "s"} offline or requiring attention`,
    coldCompliance: "Cold-chain compliance",
    coldComplianceDetail: "Readings within defined operating ranges",
    actionIncident: "Apply the incident procedure",
    actionIncidentDetail: (event) => event.recommendation,
    actionLot: "Prioritize lot inspection",
    actionLotDetail: (lot) =>
      `Validate the condition, history, and destination of lot ${lot.id} before its next movement.`,
    actionSensor: "Confirm telemetry reliability",
    actionSensorDetail: (sensor) =>
      `Inspect ${sensor.id} at ${sensor.location} and compare its reading with a local reference.`,
    actionObserve: "Maintain exception-based monitoring",
    actionObserveDetail:
      "Review new alerts and material changes during the next operating cycle.",
    ownerQuality: "Quality",
    ownerOperations: "Operations",
    ownerMaintenance: "Maintenance",
    deadlineNow: "Now",
    deadline15: "Within 15 min",
    deadlineNext: "Next cycle",
    sources: ["Live telemetry", "Incident history", "Lot context"],
    responseTitle: "Copilot operational reading",
    generalResponse:
      "I correlated alerts, telemetry, lots, and assets in the current scope. Priority should remain on exceptions with greater severity and lower reading reliability.",
  },
  es: {
    fullScope: "Operación consolidada",
    incidentHeadline: (event) =>
      `${event.incidentId} requiere evaluación coordinada`,
    incidentSummary: (event) =>
      `${event.title} en ${event.location}. Copilot relacionó severidad, origen y contexto operativo para orientar la próxima decisión.`,
    lotHeadline: (lot) => `${lot.id} concentra la mayor exposición observada`,
    lotSummary: (lot) =>
      `${lot.product} registra ${lot.temperature.toFixed(1).replace(".", ",")} °C en ${lot.location}. El lote debe priorizarse en la evaluación operativa.`,
    sensorHeadline: (sensor) => `${sensor.id} necesita verificación operativa`,
    sensorSummary: (sensor) =>
      `${sensor.location} presenta condición ${sensor.status}. Debe confirmarse la continuidad de la lectura antes de decidir sobre los lotes relacionados.`,
    stableHeadline: "Operación sin concentración crítica de riesgo",
    stableSummary:
      "Las señales disponibles permanecen en una condición manejable. Copilot recomienda mantener la vigilancia sobre desvíos recientes y activos con menor cobertura.",
    activeIncidents: "Incidentes activos",
    activeIncidentsDetail: (count) =>
      `${count} incidencia${count === 1 ? "" : "s"} pendiente de tratamiento o cierre`,
    exposedLots: "Lotes bajo atención",
    exposedLotsDetail: (count) =>
      `${count} lote${count === 1 ? "" : "s"} fuera de condición estable`,
    sensorContinuity: "Continuidad de sensores",
    sensorContinuityDetail: (count) =>
      `${count} activo${count === 1 ? "" : "s"} sin conexión o bajo atención`,
    coldCompliance: "Conformidad térmica",
    coldComplianceDetail: "Lecturas dentro de los rangos operativos definidos",
    actionIncident: "Aplicar el procedimiento del incidente",
    actionIncidentDetail: (event) => event.recommendation,
    actionLot: "Priorizar inspección del lote",
    actionLotDetail: (lot) =>
      `Validar condición, historial y destino del lote ${lot.id} antes del próximo movimiento.`,
    actionSensor: "Confirmar la fiabilidad de la telemetría",
    actionSensorDetail: (sensor) =>
      `Verificar ${sensor.id} en ${sensor.location} y comparar la lectura con una referencia local.`,
    actionObserve: "Mantener observación orientada por excepciones",
    actionObserveDetail:
      "Revisar nuevas alertas y cambios relevantes en el próximo ciclo operativo.",
    ownerQuality: "Calidad",
    ownerOperations: "Operaciones",
    ownerMaintenance: "Mantenimiento",
    deadlineNow: "Ahora",
    deadline15: "Hasta 15 min",
    deadlineNext: "Próximo ciclo",
    sources: [
      "Telemetría en vivo",
      "Historial de incidentes",
      "Contexto de lotes",
    ],
    responseTitle: "Lectura operativa de Copilot",
    generalResponse:
      "Relacioné alertas, telemetría, lotes y activos del alcance actual. La prioridad debe mantenerse en las excepciones con mayor severidad y menor fiabilidad de lectura.",
  },
};

function getPriority(primaryIncident, exposedLots, attentionSensors) {
  if (
    primaryIncident?.severity === "crítica" ||
    exposedLots.some((lot) => lot.status === "critico")
  )
    return "critical";
  if (primaryIncident?.severity === "alta" || exposedLots.length > 1)
    return "high";
  if (primaryIncident || attentionSensors.length) return "moderate";
  return "stable";
}

export function buildCopilotAnalysis(context, language = "pt") {
  const activeLanguage = resolveLanguage(language, copy);
  const text = copy[activeLanguage];
  const activeEvents = context.events
    .filter((event) => event.status !== "resolvido")
    .sort(
      (left, right) =>
        (severityWeight[right.severity] ?? 0) -
        (severityWeight[left.severity] ?? 0),
    );
  const selectedIncident =
    context.selectedIncident?.status !== "resolvido"
      ? context.selectedIncident
      : null;
  const primaryIncident = selectedIncident ?? activeEvents[0] ?? null;
  const exposedLots = [...context.lots]
    .filter((lot) => lot.status !== "estavel")
    .sort((left, right) => {
      const statusDifference =
        (right.status === "critico" ? 2 : 1) -
        (left.status === "critico" ? 2 : 1);
      return statusDifference || right.temperature - left.temperature;
    });
  const attentionSensors = context.sensors.filter(
    (sensor) => sensor.status !== "online",
  );
  const primaryLot = exposedLots[0] ?? null;
  const primarySensor = attentionSensors[0] ?? null;
  const priorityKey = getPriority(
    primaryIncident,
    exposedLots,
    attentionSensors,
  );
  const confidence = Math.min(
    96,
    74 +
      [primaryIncident, primaryLot, primarySensor, context.metrics].filter(
        Boolean,
      ).length *
        5,
  );

  let headline = text.stableHeadline;
  let summary = text.stableSummary;
  if (primaryIncident) {
    headline = text.incidentHeadline(primaryIncident);
    summary = text.incidentSummary(primaryIncident);
  } else if (primaryLot) {
    headline = text.lotHeadline(primaryLot);
    summary = text.lotSummary(primaryLot);
  } else if (primarySensor) {
    headline = text.sensorHeadline(primarySensor);
    summary = text.sensorSummary(primarySensor);
  }

  const actions = [];
  if (primaryIncident) {
    actions.push({
      title: text.actionIncident,
      detail: text.actionIncidentDetail(primaryIncident),
      owner: text.ownerOperations,
      deadline: text.deadlineNow,
    });
  }
  if (primaryLot) {
    actions.push({
      title: text.actionLot,
      detail: text.actionLotDetail(primaryLot),
      owner: text.ownerQuality,
      deadline: text.deadline15,
    });
  }
  if (primarySensor) {
    actions.push({
      title: text.actionSensor,
      detail: text.actionSensorDetail(primarySensor),
      owner: text.ownerMaintenance,
      deadline: text.deadline15,
    });
  }
  if (!actions.length) {
    actions.push({
      title: text.actionObserve,
      detail: text.actionObserveDetail,
      owner: text.ownerOperations,
      deadline: text.deadlineNext,
    });
  }

  return {
    priorityKey,
    priority: priorityCopy[activeLanguage][priorityKey],
    headline,
    summary,
    confidence,
    scope: context.facility?.name ?? text.fullScope,
    updatedAt: context.updatedAt.toLocaleTimeString(
      localeByLanguage[activeLanguage],
    ),
    evidence: [
      {
        label: text.activeIncidents,
        value: String(activeEvents.length),
        detail: text.activeIncidentsDetail(activeEvents.length),
        tone: activeEvents.some((event) =>
          ["crítica", "alta"].includes(event.severity),
        )
          ? "critical"
          : "neutral",
      },
      {
        label: text.exposedLots,
        value: String(exposedLots.length),
        detail: text.exposedLotsDetail(exposedLots.length),
        tone: exposedLots.some((lot) => lot.status === "critico")
          ? "critical"
          : exposedLots.length
            ? "warning"
            : "positive",
      },
      {
        label: text.sensorContinuity,
        value: String(attentionSensors.length),
        detail: text.sensorContinuityDetail(attentionSensors.length),
        tone: attentionSensors.length ? "warning" : "positive",
      },
      {
        label: text.coldCompliance,
        value: `${context.metrics.coldChainCompliance.toFixed(1)}%`,
        detail: text.coldComplianceDetail,
        tone:
          context.metrics.coldChainCompliance >= 98 ? "positive" : "warning",
      },
    ],
    actions: actions.slice(0, 3),
    relatedLots: exposedLots.slice(0, 3),
    sources: text.sources,
    primaryIncident,
  };
}

export function getCopilotPrompts(language = "pt") {
  const prompts = {
    pt: [
      ["priorities", "O que exige atenção agora?"],
      ["forecast", "Quais riscos podem evoluir?"],
      ["traceability", "Quais lotes devo revisar?"],
      ["summary", "Resuma o turno operacional"],
    ],
    en: [
      ["priorities", "What needs attention now?"],
      ["forecast", "Which risks may escalate?"],
      ["traceability", "Which lots should I review?"],
      ["summary", "Summarize the operating shift"],
    ],
    es: [
      ["priorities", "¿Qué necesita atención ahora?"],
      ["forecast", "¿Qué riesgos pueden evolucionar?"],
      ["traceability", "¿Qué lotes debo revisar?"],
      ["summary", "Resume el turno operativo"],
    ],
  };
  return prompts[resolveLanguage(language, prompts)].map(([id, label]) => ({
    id,
    label,
  }));
}

export function answerCopilotQuestion(question, context, language = "pt") {
  const activeLanguage = resolveLanguage(language, copy);
  const text = copy[activeLanguage];
  const analysis = buildCopilotAnalysis(context, activeLanguage);
  const attentionSensors = context.sensors.filter(
    (sensor) => sensor.status !== "online",
  );
  const normalizedQuestion = String(question).toLocaleLowerCase(activeLanguage);
  let mode = question;

  if (!getCopilotPrompts(activeLanguage).some((prompt) => prompt.id === mode)) {
    if (/lote|lot|trazabilidad|traceability/.test(normalizedQuestion))
      mode = "traceability";
    else if (
      /sensor|telemetr|dispositivo|device|activo|asset/.test(normalizedQuestion)
    )
      mode = "sensors";
    else if (/risco|risk|riesgo|evolu|previs|forecast/.test(normalizedQuestion))
      mode = "forecast";
    else if (/turno|shift|resum|summary/.test(normalizedQuestion))
      mode = "summary";
    else if (/aten|prior|agora|now/.test(normalizedQuestion))
      mode = "priorities";
  }

  const responses = {
    pt: {
      priorities: () => ({
        title: "Prioridade operacional",
        message: analysis.summary,
        points: analysis.actions.map(
          (action) => `${action.title} · ${action.deadline}`,
        ),
      }),
      forecast: () => ({
        title: "Sinais com potencial de evolução",
        message: analysis.relatedLots.length
          ? `Os lotes ${analysis.relatedLots.map((lot) => lot.id).join(", ")} concentram as principais exceções atuais. A tendência deve ser reavaliada junto da continuidade dos sensores.`
          : "Não há lote crítico no escopo atual. O principal ponto preventivo é acompanhar a continuidade dos sensores e novos alertas.",
        points: analysis.evidence
          .filter((item) => item.tone !== "positive")
          .map((item) => `${item.label}: ${item.value}`),
      }),
      traceability: () => ({
        title: "Lotes para revisão",
        message: analysis.relatedLots.length
          ? "A seleção considera condição atual, temperatura e classificação operacional do lote."
          : "Todos os lotes visíveis estão classificados como estáveis neste momento.",
        points: analysis.relatedLots.map(
          (lot) =>
            `${lot.id} · ${lot.product} · ${lot.temperature.toFixed(1).replace(".", ",")} °C · ${lot.location}`,
        ),
      }),
      sensors: () => ({
        title: "Sensores que exigem verificação",
        message: attentionSensors.length
          ? "A priorização considera disponibilidade, condição térmica, bateria e qualidade do sinal no escopo atual."
          : "Todos os sensores visíveis estão transmitindo dentro da condição operacional esperada.",
        points: attentionSensors.map(
          (sensor) =>
            `${sensor.id} · ${sensor.location} · ${sensor.status === "offline" ? "sem comunicação" : "em atenção"} · ${sensor.temperature.toFixed(1).replace(".", ",")} °C`,
        ),
      }),
      summary: () => ({
        title: "Resumo do turno",
        message: `${analysis.scope}: conformidade térmica em ${context.metrics.coldChainCompliance.toFixed(1).replace(".", ",")}% e tempo médio de resposta de ${context.metrics.avgResponse.toFixed(1).replace(".", ",")} min.`,
        points: analysis.evidence
          .slice(0, 3)
          .map((item) => `${item.label}: ${item.value}`),
      }),
    },
    en: {
      priorities: () => ({
        title: "Operational priority",
        message: analysis.summary,
        points: analysis.actions.map(
          (action) => `${action.title} · ${action.deadline}`,
        ),
      }),
      forecast: () => ({
        title: "Signals that may escalate",
        message: analysis.relatedLots.length
          ? `Lots ${analysis.relatedLots.map((lot) => lot.id).join(", ")} concentrate the main current exceptions. Reassess the trend together with sensor continuity.`
          : "There is no critical lot in the current scope. Monitor sensor continuity and new alerts as the primary preventive measure.",
        points: analysis.evidence
          .filter((item) => item.tone !== "positive")
          .map((item) => `${item.label}: ${item.value}`),
      }),
      traceability: () => ({
        title: "Lots to review",
        message: analysis.relatedLots.length
          ? "The selection considers current condition, temperature, and operational lot classification."
          : "All visible lots are currently classified as stable.",
        points: analysis.relatedLots.map(
          (lot) =>
            `${lot.id} · ${lot.product} · ${lot.temperature.toFixed(1)} °C · ${lot.location}`,
        ),
      }),
      sensors: () => ({
        title: "Sensors requiring verification",
        message: attentionSensors.length
          ? "Prioritization considers availability, thermal condition, battery, and signal quality in the current scope."
          : "All visible sensors are transmitting within the expected operating condition.",
        points: attentionSensors.map(
          (sensor) =>
            `${sensor.id} · ${sensor.location} · ${sensor.status === "offline" ? "not communicating" : "requires attention"} · ${sensor.temperature.toFixed(1)} °C`,
        ),
      }),
      summary: () => ({
        title: "Shift summary",
        message: `${analysis.scope}: cold-chain compliance at ${context.metrics.coldChainCompliance.toFixed(1)}% and average response time of ${context.metrics.avgResponse.toFixed(1)} min.`,
        points: analysis.evidence
          .slice(0, 3)
          .map((item) => `${item.label}: ${item.value}`),
      }),
    },
    es: {
      priorities: () => ({
        title: "Prioridad operativa",
        message: analysis.summary,
        points: analysis.actions.map(
          (action) => `${action.title} · ${action.deadline}`,
        ),
      }),
      forecast: () => ({
        title: "Señales con potencial de evolución",
        message: analysis.relatedLots.length
          ? `Los lotes ${analysis.relatedLots.map((lot) => lot.id).join(", ")} concentran las principales excepciones actuales. La tendencia debe reevaluarse junto con la continuidad de los sensores.`
          : "No hay lotes críticos en el alcance actual. El principal punto preventivo es vigilar la continuidad de los sensores y nuevas alertas.",
        points: analysis.evidence
          .filter((item) => item.tone !== "positive")
          .map((item) => `${item.label}: ${item.value}`),
      }),
      traceability: () => ({
        title: "Lotes para revisión",
        message: analysis.relatedLots.length
          ? "La selección considera condición actual, temperatura y clasificación operativa del lote."
          : "Todos los lotes visibles están clasificados como estables en este momento.",
        points: analysis.relatedLots.map(
          (lot) =>
            `${lot.id} · ${lot.product} · ${lot.temperature.toFixed(1).replace(".", ",")} °C · ${lot.location}`,
        ),
      }),
      sensors: () => ({
        title: "Sensores que requieren verificación",
        message: attentionSensors.length
          ? "La priorización considera disponibilidad, condición térmica, batería y calidad de señal en el alcance actual."
          : "Todos los sensores visibles transmiten dentro de la condición operativa esperada.",
        points: attentionSensors.map(
          (sensor) =>
            `${sensor.id} · ${sensor.location} · ${sensor.status === "offline" ? "sin comunicación" : "bajo atención"} · ${sensor.temperature.toFixed(1).replace(".", ",")} °C`,
        ),
      }),
      summary: () => ({
        title: "Resumen del turno",
        message: `${analysis.scope}: conformidad térmica en ${context.metrics.coldChainCompliance.toFixed(1).replace(".", ",")}% y tiempo medio de respuesta de ${context.metrics.avgResponse.toFixed(1).replace(".", ",")} min.`,
        points: analysis.evidence
          .slice(0, 3)
          .map((item) => `${item.label}: ${item.value}`),
      }),
    },
  };

  const responseFactory = responses[activeLanguage][mode];
  return responseFactory
    ? { ...responseFactory(), sources: analysis.sources }
    : {
        title: text.responseTitle,
        message: text.generalResponse,
        points: analysis.actions.map((action) => action.title),
        sources: analysis.sources,
      };
}
