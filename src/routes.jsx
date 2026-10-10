import { lazy } from "react";

function lazyPage(loader, exportName) {
  return lazy(() =>
    loader().then((module) => ({ default: module[exportName] })),
  );
}

const InicioPage = lazyPage(
  () => import("./paginas/inicio/InicioPage"),
  "InicioPage",
);
const ProblemaPage = lazyPage(
  () => import("./paginas/problema/ProblemaPage"),
  "ProblemaPage",
);
const SolucaoPage = lazyPage(
  () => import("./paginas/solucao/SolucaoPage"),
  "SolucaoPage",
);
const SimuladorPage = lazyPage(
  () => import("./paginas/simulador/SimuladorPage"),
  "SimuladorPage",
);
const GestaoLotesPage = lazyPage(
  () => import("./paginas/gestao-lotes/GestaoLotesPage"),
  "GestaoLotesPage",
);
const ResgateCargaPage = lazyPage(
  () => import("./paginas/resgate-carga/ResgateCargaPage"),
  "ResgateCargaPage",
);
const DestinacaoPage = lazyPage(
  () => import("./paginas/destinacao/DestinacaoPage"),
  "DestinacaoPage",
);
const UsuariosPage = lazyPage(
  () => import("./paginas/usuarios/UsuariosPage"),
  "UsuariosPage",
);
const ContatoPage = lazyPage(
  () => import("./paginas/contato/ContatoPage"),
  "ContatoPage",
);
const MonitoramentoPage = lazyPage(
  () => import("./paginas/monitoramento/MonitoramentoPage"),
  "MonitoramentoPage",
);
const BuscarLotesPage = lazyPage(
  () => import("./paginas/buscar-lotes/BuscarLotesPage"),
  "BuscarLotesPage",
);
const PassaporteLotePage = lazyPage(
  () => import("./paginas/passaporte-lote/PassaporteLotePage"),
  "PassaporteLotePage",
);

export const appRoutes = [
  {
    path: "/",
    label: "Início",
    title: "Início",
    description:
      "Visibilidade operacional para proteger qualidade, reduzir perdas e tornar cada decisão rastreável.",
    searchTerms: "home cadeia fria telemetria lotes alertas rastreabilidade",
    Component: InicioPage,
  },
  {
    path: "/problema",
    label: "Problema",
    title: "Problema",
    description:
      "Onde a cadeia fria perde visibilidade, tempo de resposta e qualidade.",
    searchTerms: "perdas desperdício cadeia fria temperatura umidade",
    Component: ProblemaPage,
  },
  {
    path: "/solucao",
    label: "Solução",
    title: "Solução",
    description:
      "Como a FreshSense conecta telemetria, contexto do lote e resposta operacional.",
    searchTerms: "dashboard sensores alertas lotes rastreabilidade",
    Component: SolucaoPage,
  },
  {
    path: "/simulador",
    label: "Simulador",
    title: "Simulador de risco",
    description:
      "Análise comparativa de exposição, impacto, incerteza e medidas de controle.",
    searchTerms: "simulador risco temperatura umidade alimento recomendação",
    section: "operations",
    operationLabel: "Simular risco",
    operationOrder: 7,
    showInNavigation: false,
    Component: SimuladorPage,
  },
  {
    path: "/gestao-lotes",
    label: "Lotes",
    title: "Gestão de lotes",
    description:
      "Cadastro, edição e acompanhamento dos lotes da operação em um registro centralizado.",
    searchTerms:
      "gestão cadastro cadastrar editar excluir remover lote sensor origem destino fase 6",
    navigationLabel: "Operação",
    navigationHref: "/fase5",
    section: "operations",
    operationLabel: "Gerenciar lotes",
    operationOrder: 2,
    Component: GestaoLotesPage,
  },
  {
    path: "/resgate-carga",
    label: "Resgate de carga",
    title: "Central de Resgate de Carga",
    description:
      "Compare planos de contenção, estime o orçamento térmico e reconstrua a jornada dos lotes.",
    searchTerms:
      "resgate carga orçamento térmico replay cadeia fria resposta contenção plano decisão",
    section: "operations",
    operationLabel: "Resgatar carga",
    operationOrder: 4,
    showInNavigation: false,
    Component: ResgateCargaPage,
  },
  {
    path: "/destinacao",
    label: "Destinação de lotes",
    title: "Destinação inteligente de lotes",
    description:
      "Planejamento e acompanhamento de doações, vendas prioritárias, descontos e transferências de lotes.",
    searchTerms:
      "destinação lotes doação venda desconto transferência desperdício aproveitamento",
    section: "operations",
    operationLabel: "Destinar lotes",
    operationOrder: 5,
    showInNavigation: false,
    Component: DestinacaoPage,
  },
  {
    path: "/publico-alvo",
    label: "Usuários",
    title: "Usuários",
    description:
      "Uma visão compartilhada para produção, logística, qualidade e distribuição.",
    searchTerms: "público produtor logística distribuição cooperativa",
    Component: UsuariosPage,
  },
  {
    path: "/contato",
    label: "Fale Conosco",
    title: "Fale Conosco",
    description:
      "Converse sobre visibilidade, rastreabilidade e implantação na sua operação.",
    searchTerms: "contato formulário email mensagem parceria",
    isCallToAction: true,
    Component: ContatoPage,
  },
  {
    path: "/fase5",
    label: "Monitoramento",
    title: "Monitoramento",
    description:
      "Controle unificado da cadeia fria, com telemetria, alertas, ativos e lotes em tempo real.",
    searchTerms:
      "monitoramento tempo real estoque produção disponibilidade qualidade alertas lotes",
    section: "operations",
    operationLabel: "Monitorar",
    operationOrder: 1,
    showInNavigation: false,
    Component: MonitoramentoPage,
  },
  {
    path: "/buscar-lotes",
    label: "Buscar lotes",
    title: "Buscar lotes",
    description:
      "Localização rápida de lotes por produto, condição, origem, risco e etapa da cadeia.",
    searchTerms:
      "buscar lotes filtros produto risco temperatura origem etapa cadeia",
    section: "operations",
    operationLabel: "Buscar lotes",
    operationOrder: 3,
    showInNavigation: false,
    Component: BuscarLotesPage,
  },
  {
    path: "/passaporte-lote",
    label: "Passaporte Digital",
    title: "Passaporte Digital do Lote",
    description:
      "Certificado compartilhável com QR Code, condição ambiental, jornada logística e trilha de evidências do lote.",
    searchTerms:
      "passaporte digital lote qr code certificado qualidade rastreabilidade origem sensor compartilhar imprimir pdf",
    section: "operations",
    operationLabel: "Passaporte",
    operationOrder: 6,
    showInNavigation: false,
    Component: PassaporteLotePage,
  },
];

export function findRoute(path) {
  return appRoutes.find((route) => route.path === path);
}
