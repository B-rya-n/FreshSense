import { normalizePath, resolveLanguage } from "../../utilitarios/text";

const localeByLanguage = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

const experienceCopy = {
  pt: {
    available: "Disponível em todo o site",
    defaultScope: "Plataforma FreshSense",
    defaultIntroduction:
      "Explore a plataforma, encontre o módulo certo e avance para a próxima decisão com contexto.",
    pages: {
      "/": {
        scope: "Visão geral da plataforma",
        introduction:
          "Conheça as capacidades da FreshSense e escolha o melhor caminho para monitorar, investigar ou simular.",
        prompts: [
          ["platform", "O que o Copilot pode fazer?"],
          ["monitoring", "Onde acompanho a operação ao vivo?"],
          ["lots", "Como investigar um lote?"],
        ],
      },
      "/problema": {
        scope: "Desafios da cadeia fria",
        introduction:
          "Relacione perdas de visibilidade, demora na resposta e qualidade comprometida às capacidades da plataforma.",
        prompts: [
          ["context", "Quais riscos esta página destaca?"],
          ["platform", "Como a FreshSense reduz esses riscos?"],
          ["monitoring", "Onde vejo os desvios ao vivo?"],
        ],
      },
      "/solucao": {
        scope: "Arquitetura da solução",
        introduction:
          "Entenda como telemetria, contexto, alertas e resposta coordenada formam uma operação conectada.",
        prompts: [
          ["context", "Como a solução funciona?"],
          ["platform", "Quais módulos posso explorar?"],
          ["risk", "Como avaliar um cenário?"],
        ],
      },
      "/publico-alvo": {
        scope: "Jornadas por equipe",
        introduction:
          "Descubra como produção, logística, qualidade e distribuição usam a mesma base operacional.",
        prompts: [
          ["users", "Como o Copilot apoia cada equipe?"],
          ["platform", "Qual módulo devo usar?"],
          ["implementation", "Como conversar sobre implantação?"],
        ],
      },
      "/contato": {
        scope: "Planejamento da implantação",
        introduction:
          "Organize os pontos críticos da operação antes de conversar com a equipe FreshSense.",
        prompts: [
          ["implementation", "O que preparar para uma conversa?"],
          ["platform", "O que posso explorar antes do contato?"],
          ["monitoring", "Quero ver a plataforma em funcionamento"],
        ],
      },
      "/buscar-lotes": {
        scope: "Busca e rastreabilidade",
        introduction:
          "Use produto, condição, origem, temperatura e etapa para chegar rapidamente ao lote relevante.",
        prompts: [
          ["lots", "Como usar a busca de lotes?"],
          ["risk", "Como interpretar a classificação de risco?"],
          ["monitoring", "Onde acompanho a operação ao vivo?"],
        ],
      },
      "/simulador": {
        scope: "Análise de cenários",
        introduction:
          "Compare exposição, impacto, controles e qualidade dos dados antes de definir uma resposta.",
        prompts: [
          ["risk", "Como funciona esta análise?"],
          ["context", "O que influencia o resultado?"],
          ["monitoring", "Quero comparar com a operação ao vivo"],
        ],
      },
      "/passaporte-lote": {
        scope: "Passaporte digital do lote",
        introduction:
          "Consolide identidade, condição ambiental, jornada e decisões do lote em um certificado verificável e compartilhável.",
        prompts: [
          ["passport", "O que este passaporte comprova?"],
          ["lots", "Como investigar outro lote?"],
          ["monitoring", "Onde acompanho a operação ao vivo?"],
        ],
      },
    },
    responses: {
      platform: {
        title: "Uma inteligência que conecta toda a plataforma",
        message:
          "O Copilot orienta a navegação, explica os recursos e conduz você da visão geral à ferramenta mais adequada para cada decisão.",
        actions: [
          [
            "Acompanhar a operação ao vivo",
            "/fase5",
            "Telemetria, incidentes, ativos e indicadores",
          ],
          [
            "Investigar lotes",
            "/buscar-lotes",
            "Condição, origem, risco e etapa da cadeia",
          ],
          [
            "Comparar cenários",
            "/simulador",
            "Exposição, controles e resposta recomendada",
          ],
        ],
      },
      monitoring: {
        title: "Controle operacional em tempo real",
        message:
          "A Central reúne telemetria, indicadores, lotes, rotas, sensores e incidentes. Dentro dela, o Copilot operacional correlaciona evidências e sugere um plano para revisão humana.",
        actions: [
          [
            "Abrir a Central de Monitoramento",
            "/fase5",
            "Acessar a visão operacional completa",
          ],
          [
            "Entender a arquitetura",
            "/solucao",
            "Ver como dados e respostas são conectados",
          ],
        ],
      },
      lots: {
        title: "Investigação orientada por lote",
        message:
          "A busca combina código, produto, temperatura, origem, condição e etapa para reduzir o tempo entre uma dúvida e a evidência operacional relevante.",
        actions: [
          [
            "Abrir a busca de lotes",
            "/buscar-lotes",
            "Filtrar e consultar a rastreabilidade",
          ],
          [
            "Ver os ativos e lotes ao vivo",
            "/fase5",
            "Relacionar lotes à telemetria atual",
          ],
        ],
      },
      risk: {
        title: "Risco explicado antes da decisão",
        message:
          "O simulador permite comparar como exposição, impacto, controles e confiança dos dados alteram a prioridade e o plano de resposta.",
        actions: [
          [
            "Analisar um cenário",
            "/simulador",
            "Comparar risco e medidas de controle",
          ],
          [
            "Consultar a operação atual",
            "/fase5",
            "Confrontar o cenário com sinais ao vivo",
          ],
        ],
      },
      passport: {
        title: "Evidência verificável para cada lote",
        message:
          "O passaporte reúne identificação, certificado, QR Code, condição térmica, jornada logística e eventos de resgate e destinação. O veredito é calculado a partir das evidências atuais e deve ser validado pela equipe de qualidade.",
        actions: [
          [
            "Consultar passaportes",
            "/passaporte-lote",
            "Selecionar um lote e abrir seu certificado",
          ],
          [
            "Gerenciar lotes",
            "/gestao-lotes",
            "Revisar cadastro e dados operacionais",
          ],
        ],
      },
      users: {
        title: "Uma visão comum para diferentes equipes",
        message:
          "Produção observa condições, logística acompanha rotas, qualidade investiga exceções e a gestão acompanha prioridades e tempos de resposta.",
        actions: [
          [
            "Conhecer as jornadas por equipe",
            "/publico-alvo",
            "Ver decisões apoiadas por perfil",
          ],
          [
            "Explorar a Central",
            "/fase5",
            "Visualizar a operação compartilhada",
          ],
        ],
      },
      implementation: {
        title: "Prepare uma implantação com contexto",
        message:
          "Mapeie produtos críticos, pontos de controle, sensores disponíveis, integrações, responsáveis e procedimentos de resposta. Isso torna a conversa mais objetiva.",
        actions: [
          [
            "Falar com a FreshSense",
            "/contato",
            "Apresentar desafios e prioridades da operação",
          ],
          [
            "Revisar como a solução funciona",
            "/solucao",
            "Conhecer arquitetura e jornada operacional",
          ],
        ],
      },
    },
    contextResponses: {
      "/problema": {
        title: "Os principais pontos de ruptura",
        message:
          "A página destaca baixa visibilidade entre etapas, alertas sem contexto, resposta tardia e evidências fragmentadas — condições que ampliam perdas evitáveis.",
        actions: [
          [
            "Ver como a FreshSense responde",
            "/solucao",
            "Conectar detecção, contexto e ação",
          ],
        ],
      },
      "/solucao": {
        title: "Da leitura à resposta coordenada",
        message:
          "Sensores geram sinais, o contexto identifica lote e operação, regras qualificam a criticidade e o fluxo direciona a ocorrência para quem precisa agir.",
        actions: [
          [
            "Explorar a operação conectada",
            "/fase5",
            "Ver o fluxo em uma central interativa",
          ],
        ],
      },
      "/simulador": {
        title: "O que influencia a análise",
        message:
          "Produto, intensidade e duração da exposição, impacto potencial, controles existentes e qualidade dos dados modificam o resultado do cenário.",
        actions: [
          [
            "Usar o simulador",
            "/simulador",
            "Ajustar variáveis e comparar resultados",
          ],
        ],
      },
    },
    inputLabel: "Pergunte sobre a plataforma",
    placeholder: "Ex.: qual ferramenta devo usar para investigar um lote?",
    send: "Perguntar",
    sources: "Base de conhecimento FreshSense · contexto da página",
    fallbackTitle: "Orientação contextual",
    fallbackMessage:
      "Posso orientar você sobre monitoramento ao vivo, lotes, análise de risco, equipes e implantação. Escolha uma sugestão ou descreva o que precisa decidir.",
  },
  en: {
    available: "Available throughout the site",
    defaultScope: "FreshSense platform",
    defaultIntroduction:
      "Explore the platform, find the right module, and move to the next decision with context.",
    pages: {
      "/": {
        scope: "Platform overview",
        introduction:
          "Discover FreshSense capabilities and choose the best path to monitor, investigate, or simulate.",
        prompts: [
          ["platform", "What can Copilot do?"],
          ["monitoring", "Where can I track live operations?"],
          ["lots", "How can I investigate a lot?"],
        ],
      },
      "/problema": {
        scope: "Cold-chain challenges",
        introduction:
          "Connect visibility gaps, slow response, and compromised quality to platform capabilities.",
        prompts: [
          ["context", "Which risks does this page highlight?"],
          ["platform", "How does FreshSense reduce these risks?"],
          ["monitoring", "Where can I see live deviations?"],
        ],
      },
      "/solucao": {
        scope: "Solution architecture",
        introduction:
          "Understand how telemetry, context, alerts, and coordinated response create a connected operation.",
        prompts: [
          ["context", "How does the solution work?"],
          ["platform", "Which modules can I explore?"],
          ["risk", "How can I assess a scenario?"],
        ],
      },
      "/publico-alvo": {
        scope: "Team journeys",
        introduction:
          "See how production, logistics, quality, and distribution work from the same operational foundation.",
        prompts: [
          ["users", "How does Copilot support each team?"],
          ["platform", "Which module should I use?"],
          ["implementation", "How can I discuss implementation?"],
        ],
      },
      "/contato": {
        scope: "Implementation planning",
        introduction:
          "Organize critical operating points before speaking with the FreshSense team.",
        prompts: [
          ["implementation", "What should I prepare for a conversation?"],
          ["platform", "What can I explore before contacting you?"],
          ["monitoring", "I want to see the platform in action"],
        ],
      },
      "/buscar-lotes": {
        scope: "Search and traceability",
        introduction:
          "Use product, condition, origin, temperature, and stage to quickly reach the relevant lot.",
        prompts: [
          ["lots", "How do I use lot search?"],
          ["risk", "How should I interpret risk classification?"],
          ["monitoring", "Where can I track live operations?"],
        ],
      },
      "/simulador": {
        scope: "Scenario analysis",
        introduction:
          "Compare exposure, impact, controls, and data quality before choosing a response.",
        prompts: [
          ["risk", "How does this analysis work?"],
          ["context", "What influences the result?"],
          ["monitoring", "I want to compare it with live operations"],
        ],
      },
      "/passaporte-lote": {
        scope: "Digital lot passport",
        introduction:
          "Consolidate lot identity, environmental condition, journey, and decisions into a verifiable, shareable certificate.",
        prompts: [
          ["passport", "What does this passport verify?"],
          ["lots", "How can I investigate another lot?"],
          ["monitoring", "Where can I track live operations?"],
        ],
      },
    },
    responses: {
      platform: {
        title: "Intelligence that connects the entire platform",
        message:
          "Copilot guides navigation, explains capabilities, and takes you from the overview to the right tool for each decision.",
        actions: [
          [
            "Track live operations",
            "/fase5",
            "Telemetry, incidents, assets, and metrics",
          ],
          [
            "Investigate lots",
            "/buscar-lotes",
            "Condition, origin, risk, and supply-chain stage",
          ],
          [
            "Compare scenarios",
            "/simulador",
            "Exposure, controls, and recommended response",
          ],
        ],
      },
      monitoring: {
        title: "Real-time operational control",
        message:
          "The Control Center combines telemetry, metrics, lots, routes, sensors, and incidents. Its operational Copilot correlates evidence and suggests a plan for human review.",
        actions: [
          [
            "Open the Monitoring Center",
            "/fase5",
            "Access the complete operational view",
          ],
          [
            "Understand the architecture",
            "/solucao",
            "See how data and responses are connected",
          ],
        ],
      },
      lots: {
        title: "Lot-centered investigation",
        message:
          "Search combines code, product, temperature, origin, condition, and stage to shorten the path from a question to relevant operational evidence.",
        actions: [
          [
            "Open lot search",
            "/buscar-lotes",
            "Filter and inspect traceability",
          ],
          [
            "View live assets and lots",
            "/fase5",
            "Connect lots with current telemetry",
          ],
        ],
      },
      risk: {
        title: "Risk explained before the decision",
        message:
          "The simulator compares how exposure, impact, controls, and data confidence change priority and the response plan.",
        actions: [
          [
            "Analyze a scenario",
            "/simulador",
            "Compare risk and control measures",
          ],
          [
            "Review current operations",
            "/fase5",
            "Compare the scenario with live signals",
          ],
        ],
      },
      passport: {
        title: "Verifiable evidence for every lot",
        message:
          "The passport combines identity, certificate, QR Code, thermal condition, logistics journey, and rescue and destination events. Its verdict is derived from current evidence and remains subject to quality-team validation.",
        actions: [
          [
            "View passports",
            "/passaporte-lote",
            "Select a lot and open its certificate",
          ],
          [
            "Manage lots",
            "/gestao-lotes",
            "Review registration and operational data",
          ],
        ],
      },
      users: {
        title: "A shared view for different teams",
        message:
          "Production monitors conditions, logistics tracks routes, quality investigates exceptions, and management follows priorities and response times.",
        actions: [
          [
            "Explore team journeys",
            "/publico-alvo",
            "See supported decisions by role",
          ],
          ["Explore the Control Center", "/fase5", "View the shared operation"],
        ],
      },
      implementation: {
        title: "Prepare an implementation with context",
        message:
          "Map critical products, control points, available sensors, integrations, owners, and response procedures to make the conversation objective.",
        actions: [
          [
            "Talk to FreshSense",
            "/contato",
            "Share operating challenges and priorities",
          ],
          [
            "Review how the solution works",
            "/solucao",
            "Explore the architecture and operating journey",
          ],
        ],
      },
    },
    contextResponses: {
      "/problema": {
        title: "The main breaking points",
        message:
          "This page highlights low visibility between stages, alerts without context, delayed response, and fragmented evidence — conditions that increase avoidable losses.",
        actions: [
          [
            "See how FreshSense responds",
            "/solucao",
            "Connect detection, context, and action",
          ],
        ],
      },
      "/solucao": {
        title: "From reading to coordinated response",
        message:
          "Sensors generate signals, context identifies the lot and operation, rules qualify severity, and the workflow routes the occurrence to the right team.",
        actions: [
          [
            "Explore the connected operation",
            "/fase5",
            "See the workflow in an interactive control center",
          ],
        ],
      },
      "/simulador": {
        title: "What influences the analysis",
        message:
          "Product, exposure intensity and duration, potential impact, existing controls, and data quality change the scenario result.",
        actions: [
          [
            "Use the simulator",
            "/simulador",
            "Adjust variables and compare results",
          ],
        ],
      },
    },
    inputLabel: "Ask about the platform",
    placeholder: "E.g., which tool should I use to investigate a lot?",
    send: "Ask",
    sources: "FreshSense knowledge base · page context",
    fallbackTitle: "Contextual guidance",
    fallbackMessage:
      "I can guide you through live monitoring, lots, risk analysis, teams, and implementation. Choose a suggestion or describe the decision you need to make.",
  },
  es: {
    available: "Disponible en todo el sitio",
    defaultScope: "Plataforma FreshSense",
    defaultIntroduction:
      "Explore la plataforma, encuentre el módulo adecuado y avance hacia la próxima decisión con contexto.",
    pages: {
      "/": {
        scope: "Visión general de la plataforma",
        introduction:
          "Conozca las capacidades de FreshSense y elija el mejor camino para monitorear, investigar o simular.",
        prompts: [
          ["platform", "¿Qué puede hacer Copilot?"],
          ["monitoring", "¿Dónde sigo la operación en vivo?"],
          ["lots", "¿Cómo investigo un lote?"],
        ],
      },
      "/problema": {
        scope: "Desafíos de la cadena de frío",
        introduction:
          "Relacione brechas de visibilidad, respuesta lenta y calidad comprometida con las capacidades de la plataforma.",
        prompts: [
          ["context", "¿Qué riesgos destaca esta página?"],
          ["platform", "¿Cómo reduce FreshSense estos riesgos?"],
          ["monitoring", "¿Dónde veo los desvíos en vivo?"],
        ],
      },
      "/solucao": {
        scope: "Arquitectura de la solución",
        introduction:
          "Entienda cómo telemetría, contexto, alertas y respuesta coordinada crean una operación conectada.",
        prompts: [
          ["context", "¿Cómo funciona la solución?"],
          ["platform", "¿Qué módulos puedo explorar?"],
          ["risk", "¿Cómo evalúo un escenario?"],
        ],
      },
      "/publico-alvo": {
        scope: "Recorridos por equipo",
        introduction:
          "Descubra cómo producción, logística, calidad y distribución utilizan la misma base operativa.",
        prompts: [
          ["users", "¿Cómo apoya Copilot a cada equipo?"],
          ["platform", "¿Qué módulo debo utilizar?"],
          ["implementation", "¿Cómo converso sobre la implementación?"],
        ],
      },
      "/contato": {
        scope: "Planificación de la implementación",
        introduction:
          "Organice los puntos críticos de la operación antes de hablar con el equipo FreshSense.",
        prompts: [
          ["implementation", "¿Qué debo preparar para una conversación?"],
          ["platform", "¿Qué puedo explorar antes del contacto?"],
          ["monitoring", "Quiero ver la plataforma en funcionamiento"],
        ],
      },
      "/buscar-lotes": {
        scope: "Búsqueda y trazabilidad",
        introduction:
          "Use producto, condición, origen, temperatura y etapa para llegar rápidamente al lote relevante.",
        prompts: [
          ["lots", "¿Cómo utilizo la búsqueda de lotes?"],
          ["risk", "¿Cómo interpreto la clasificación de riesgo?"],
          ["monitoring", "¿Dónde sigo la operación en vivo?"],
        ],
      },
      "/simulador": {
        scope: "Análisis de escenarios",
        introduction:
          "Compare exposición, impacto, controles y calidad de datos antes de definir una respuesta.",
        prompts: [
          ["risk", "¿Cómo funciona este análisis?"],
          ["context", "¿Qué influye en el resultado?"],
          ["monitoring", "Quiero compararlo con la operación en vivo"],
        ],
      },
      "/passaporte-lote": {
        scope: "Pasaporte digital del lote",
        introduction:
          "Consolide identidad, condición ambiental, recorrido y decisiones del lote en un certificado verificable y compartible.",
        prompts: [
          ["passport", "¿Qué verifica este pasaporte?"],
          ["lots", "¿Cómo investigo otro lote?"],
          ["monitoring", "¿Dónde sigo la operación en vivo?"],
        ],
      },
    },
    responses: {
      platform: {
        title: "Una inteligencia que conecta toda la plataforma",
        message:
          "Copilot orienta la navegación, explica las capacidades y le lleva de la visión general a la herramienta adecuada para cada decisión.",
        actions: [
          [
            "Seguir la operación en vivo",
            "/fase5",
            "Telemetría, incidentes, activos e indicadores",
          ],
          [
            "Investigar lotes",
            "/buscar-lotes",
            "Condición, origen, riesgo y etapa de la cadena",
          ],
          [
            "Comparar escenarios",
            "/simulador",
            "Exposición, controles y respuesta recomendada",
          ],
        ],
      },
      monitoring: {
        title: "Control operativo en tiempo real",
        message:
          "La Central reúne telemetría, indicadores, lotes, rutas, sensores e incidentes. Su Copilot operativo relaciona evidencias y sugiere un plan para revisión humana.",
        actions: [
          [
            "Abrir la Central de Monitoreo",
            "/fase5",
            "Acceder a la visión operativa completa",
          ],
          [
            "Entender la arquitectura",
            "/solucao",
            "Ver cómo se conectan datos y respuestas",
          ],
        ],
      },
      lots: {
        title: "Investigación orientada por lote",
        message:
          "La búsqueda combina código, producto, temperatura, origen, condición y etapa para reducir el camino entre una pregunta y la evidencia operativa relevante.",
        actions: [
          [
            "Abrir la búsqueda de lotes",
            "/buscar-lotes",
            "Filtrar y consultar la trazabilidad",
          ],
          [
            "Ver activos y lotes en vivo",
            "/fase5",
            "Relacionar lotes con la telemetría actual",
          ],
        ],
      },
      risk: {
        title: "Riesgo explicado antes de la decisión",
        message:
          "El simulador compara cómo exposición, impacto, controles y confianza de datos modifican la prioridad y el plan de respuesta.",
        actions: [
          [
            "Analizar un escenario",
            "/simulador",
            "Comparar riesgo y medidas de control",
          ],
          [
            "Consultar la operación actual",
            "/fase5",
            "Contrastar el escenario con señales en vivo",
          ],
        ],
      },
      passport: {
        title: "Evidencia verificable para cada lote",
        message:
          "El pasaporte reúne identidad, certificado, código QR, condición térmica, recorrido logístico y eventos de rescate y destino. El veredicto se deriva de las evidencias actuales y debe ser validado por el equipo de calidad.",
        actions: [
          [
            "Consultar pasaportes",
            "/passaporte-lote",
            "Seleccionar un lote y abrir su certificado",
          ],
          [
            "Gestionar lotes",
            "/gestao-lotes",
            "Revisar registro y datos operativos",
          ],
        ],
      },
      users: {
        title: "Una visión común para diferentes equipos",
        message:
          "Producción observa condiciones, logística sigue rutas, calidad investiga excepciones y la gestión acompaña prioridades y tiempos de respuesta.",
        actions: [
          [
            "Conocer los recorridos por equipo",
            "/publico-alvo",
            "Ver decisiones apoyadas por perfil",
          ],
          [
            "Explorar la Central",
            "/fase5",
            "Visualizar la operación compartida",
          ],
        ],
      },
      implementation: {
        title: "Prepare una implementación con contexto",
        message:
          "Mapee productos críticos, puntos de control, sensores disponibles, integraciones, responsables y procedimientos de respuesta para hacer la conversación objetiva.",
        actions: [
          [
            "Hablar con FreshSense",
            "/contato",
            "Presentar desafíos y prioridades de la operación",
          ],
          [
            "Revisar cómo funciona la solución",
            "/solucao",
            "Conocer arquitectura y recorrido operativo",
          ],
        ],
      },
    },
    contextResponses: {
      "/problema": {
        title: "Los principales puntos de ruptura",
        message:
          "La página destaca baja visibilidad entre etapas, alertas sin contexto, respuesta tardía y evidencias fragmentadas: condiciones que aumentan pérdidas evitables.",
        actions: [
          [
            "Ver cómo responde FreshSense",
            "/solucao",
            "Conectar detección, contexto y acción",
          ],
        ],
      },
      "/solucao": {
        title: "De la lectura a la respuesta coordinada",
        message:
          "Los sensores generan señales, el contexto identifica lote y operación, las reglas califican la severidad y el flujo dirige la incidencia al equipo adecuado.",
        actions: [
          [
            "Explorar la operación conectada",
            "/fase5",
            "Ver el flujo en una central interactiva",
          ],
        ],
      },
      "/simulador": {
        title: "Qué influye en el análisis",
        message:
          "Producto, intensidad y duración de exposición, impacto potencial, controles existentes y calidad de datos cambian el resultado del escenario.",
        actions: [
          [
            "Usar el simulador",
            "/simulador",
            "Ajustar variables y comparar resultados",
          ],
        ],
      },
    },
    inputLabel: "Pregunte sobre la plataforma",
    placeholder: "Ej.: ¿qué herramienta debo usar para investigar un lote?",
    send: "Preguntar",
    sources: "Base de conocimiento FreshSense · contexto de la página",
    fallbackTitle: "Orientación contextual",
    fallbackMessage:
      "Puedo orientarle sobre monitoreo en vivo, lotes, análisis de riesgo, equipos e implementación. Elija una sugerencia o describa la decisión que necesita tomar.",
  },
};

function identifyIntent(question, language) {
  const normalized = String(question).toLocaleLowerCase(
    localeByLanguage[language],
  );
  if (/lote|lot|rastrea|trace|trazab|carga/.test(normalized)) return "lots";
  if (/risco|risk|riesgo|cen[aá]rio|scenario|escenario|simula/.test(normalized))
    return "risk";
  if (/implant|contat|contact|conversa|demo|integra/.test(normalized))
    return "implementation";
  if (/equipe|team|equipo|usu[aá]rio|user|perfil|role/.test(normalized))
    return "users";
  if (
    /monitor|opera[cç][aã]o|operation|operaci[oó]n|telemetr|alert|incident|desvio|deviation/.test(
      normalized,
    )
  )
    return "monitoring";
  if (
    /plataforma|platform|copilot|m[oó]dulo|module|freshsense|fazer|hacer|do/.test(
      normalized,
    )
  )
    return "platform";
  return "context";
}

function normalizeResponse(response, sources) {
  return {
    ...response,
    actions: response.actions.map(([label, href, description]) => ({
      label,
      href,
      description,
    })),
    sources,
  };
}

export function getSiteCopilotExperience(path, language = "pt") {
  const activeLanguage = resolveLanguage(language, experienceCopy);
  const text = experienceCopy[activeLanguage];
  const page = text.pages[normalizePath(path)];

  return {
    available: text.available,
    scope: page?.scope ?? text.defaultScope,
    introduction: page?.introduction ?? text.defaultIntroduction,
    prompts: (page?.prompts ?? text.pages["/"].prompts).map(([id, label]) => ({
      id,
      label,
    })),
    inputLabel: text.inputLabel,
    placeholder: text.placeholder,
    send: text.send,
  };
}

export function answerSiteCopilotQuestion(question, path, language = "pt") {
  const activeLanguage = resolveLanguage(language, experienceCopy);
  const text = experienceCopy[activeLanguage];
  const currentPath = normalizePath(path);
  const hasExplicitIntent =
    Boolean(text.responses[question]) || question === "context";
  const intent = hasExplicitIntent
    ? question
    : identifyIntent(question, activeLanguage);
  const response =
    intent === "context"
      ? text.contextResponses[currentPath]
      : text.responses[intent];

  if (!response) {
    return {
      title: text.fallbackTitle,
      message: text.fallbackMessage,
      actions: [],
      sources: text.sources,
    };
  }

  return normalizeResponse(response, text.sources);
}
