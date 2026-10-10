# FreshSense — Fase 6

Aplicação web acadêmica para apoiar decisões na cadeia fria de alimentos. A Fase 6 evolui a experiência construída nas etapas anteriores para uma SPA em React com módulos operacionais conectados: cadastro de lotes, busca, monitoramento, análise de risco, resgate de carga, destinação e passaporte digital verificável.

Os dados do ambiente demonstrativo são processados no navegador. Não há backend, autenticação ou integração com sensores reais nesta versão.

## Visão geral

O fluxo principal da plataforma conecta o ciclo de decisão de ponta a ponta:

```text
Gestão de lotes → Busca e monitoramento → Análise de risco
        ↓                                      ↓
  Destinação ← Registro da decisão ← Resgate de carga
        ↓
  Passaporte digital com QR Code e trilha de evidências
```

### Funcionalidades da Fase 6

- **Gestão de lotes:** cadastro, edição, consulta e exclusão, com validação dos campos, cálculo automático de risco/status e proteção de registros que já possuem destinações ou decisões de resgate relacionadas.
- **Busca inteligente:** filtros combináveis por texto, categoria, risco, temperatura e etapa da cadeia, com atualização adiada da consulta para manter a interface responsiva.
- **Monitoramento operacional:** painel com indicadores, telemetria simulada, alertas, unidades, rotas refrigeradas, inventário, conformidade, frota de sensores e lotes favoritos. Permite pausar ou atualizar a simulação, alterar a frequência e tratar incidentes.
- **Simulador de risco:** análise de exposição, impacto e incerteza, matriz 5 × 5, contribuição por fator, comparação do risco residual, medidas de controle e histórico da sessão.
- **Central de Resgate de Carga:** orçamento térmico, comparação de três cenários, execução do plano escolhido, atualização do lote, histórico de decisões e replay da cadeia fria.
- **Destinação inteligente:** planejamento de doações, vendas prioritárias, descontos e transferências; validação do saldo disponível; acompanhamento de status, histórico e indicadores de volume.
- **Passaporte Digital do Lote:** certificado individual compartilhável com QR Code real, identidade do lote, condição ambiental, orçamento térmico, vida útil estimada, jornada logística, disponibilidade e trilha cronológica de evidências de resgate e destinação.
- **Experiência integrada:** navegação operacional, busca global pelo atalho `/`, FreshSense Copilot contextual, tema claro/escuro, interface responsiva e conteúdo em português, inglês e espanhol.

> As leituras, projeções, recomendações e eventos exibidos são simulados para fins acadêmicos. Decisões sanitárias e logísticas reais exigem validação técnica qualificada.

## Tecnologias

| Área                    | Tecnologia                                                |
| ----------------------- | --------------------------------------------------------- |
| Interface               | React 19, React DOM, QRCode e JavaScript com ES Modules   |
| Desenvolvimento e build | Vite 8                                                    |
| Estilos                 | CSS global por camadas e CSS específico por página        |
| Estado compartilhado    | Context API e hooks React                                 |
| Persistência            | `localStorage` com validação, migração e fallback seguro  |
| Testes unitários        | Node.js Test Runner                                       |
| Testes de interface     | Vitest, Testing Library, User Event e jsdom               |
| Qualidade               | ESLint e Prettier                                         |
| Publicação              | Build estático com rewrite de SPA configurado para Vercel |

## Rotas

As páginas são carregadas sob demanda com `React.lazy` e `Suspense`. O roteamento é feito pelo hook próprio `useRouter`, que usa a History API para navegação interna sem recarregar a página.

| Rota               | Página              | Finalidade                                                                                      |
| ------------------ | ------------------- | ----------------------------------------------------------------------------------------------- |
| `/`                | Início              | Visão geral da plataforma e acesso aos módulos                                                  |
| `/problema`        | Problema            | Contextualização das perdas e lacunas da cadeia fria                                            |
| `/solucao`         | Solução             | Jornada, arquitetura e implantação da solução                                                   |
| `/simulador`       | Simulador de risco  | Análise comparativa de risco e medidas de controle                                              |
| `/gestao-lotes`    | Gestão de lotes     | Cadastro, edição, exclusão e visão consolidada dos lotes                                        |
| `/buscar-lotes`    | Buscar lotes        | Consulta operacional com filtros combináveis                                                    |
| `/fase5`           | Monitoramento       | Central operacional em tempo real; a URL foi preservada por compatibilidade com a fase anterior |
| `/resgate-carga`   | Resgate de carga    | Cenários de contenção, orçamento térmico e replay                                               |
| `/destinacao`      | Destinação de lotes | Planejamento e acompanhamento do aproveitamento dos lotes                                       |
| `/passaporte-lote` | Passaporte Digital  | Certificado verificável, QR Code e evidências consolidadas de cada lote                         |
| `/publico-alvo`    | Usuários            | Jornadas para produção, logística, qualidade e distribuição                                     |
| `/contato`         | Fale Conosco        | Formulário validado de contato                                                                  |

Qualquer caminho não cadastrado apresenta a página de erro da própria aplicação. Em produção, o rewrite definido em `vercel.json` direciona as requisições para `index.html`, permitindo abrir rotas internas diretamente.

## Arquitetura

A aplicação adota componentes funcionais e separa apresentação, estado compartilhado, regras de negócio e infraestrutura do navegador.

```text
I18nProvider
└── LotesProvider
    └── DestinationsProvider
        └── RescueOperationsProvider
            └── App
                └── AppLayout
                    └── Página selecionada pela rota
```

- `src/main.jsx`: inicializa o React e compõe os providers globais.
- `src/App.jsx`: resolve a rota, atualiza o título, fornece o layout comum e trata o carregamento e a página não encontrada.
- `src/routes.jsx`: centraliza metadados de navegação, busca e carregamento sob demanda das páginas.
- `src/componentes`: componentes compartilhados, navegação, diálogos, abas, busca global e copilots.
- `src/contextos`: estado e operações compartilhadas de lotes, destinações e resgates.
- `src/paginas`: módulos organizados por funcionalidade; cada página mantém próximos seus componentes, modelos, dados, hooks, estilos e testes exclusivos.
- `src/dados`: dados iniciais compartilhados do domínio.
- `src/hooks`: roteamento, persistência e comportamentos reutilizáveis.
- `src/traducoes`: contexto de internacionalização e dicionários `pt`, `en` e `es`.
- `src/utilitarios`: acesso defensivo ao armazenamento do navegador.
- `src/estilos`: base visual e ordem global da cascata.
- `src/test`: utilitários comuns para renderização dos testes de interface.

As regras determinísticas ficam em módulos `modelo`, sem dependência da interface. Isso permite testar cálculos, validações e transições de estado separadamente dos componentes React.

## Persistência no navegador

O hook `usePersistedState` restaura, valida, migra e salva o estado. Estruturas inválidas retornam aos valores iniciais, e falhas de acesso ao armazenamento não interrompem a aplicação.

| Chave                                | Conteúdo persistido                           |
| ------------------------------------ | --------------------------------------------- |
| `freshsense-lots`                    | Lotes cadastrados e alterações operacionais   |
| `freshsense-destinations`            | Destinações, status e histórico               |
| `freshsense-rescue-decisions`        | Até 50 decisões de resgate mais recentes      |
| `freshsense-favorites`               | Lotes favoritos no monitoramento              |
| `freshsense-monitoring-refresh-rate` | Frequência escolhida para a simulação ao vivo |
| `freshsense-language`                | Idioma ativo                                  |
| `freshsense-theme`                   | Tema claro ou escuro                          |

Os dados pertencem ao navegador e à origem em que a aplicação foi aberta. Limpar o armazenamento do site remove as personalizações e os registros locais. O histórico do simulador e o estado corrente dos alertas permanecem apenas durante a sessão da página.

## Acessibilidade e internacionalização

Entre os recursos implementados estão:

- link para pular diretamente ao conteúdo e landmarks semânticos;
- navegação por teclado em abas, fechamento por `Escape` e gerenciamento/restauração de foco em diálogos;
- labels associados aos campos e mensagens de erro ligadas por `aria-describedby`;
- uso de `aria-current`, `aria-expanded`, `aria-pressed`, `aria-live`, `role="status"`, `dialog`, `alertdialog`, `tablist` e `tabpanel` conforme o contexto;
- alternativas textuais para gráficos e indicadores visuais;
- atualização do atributo `lang` do documento ao trocar o idioma;
- suporte a movimento reduzido nos estilos e layout adaptável a diferentes larguras de tela.

Esses recursos melhoram a navegação assistiva, mas não representam uma certificação formal de conformidade com WCAG.

## Requisitos e execução

Pré-requisito: **Node.js `^20.19.0` ou `>=22.12.0`**.

Instale as dependências a partir do lockfile e inicie o servidor de desenvolvimento:

```bash
npm ci
npm run dev
```

O Vite informa no terminal o endereço local da aplicação, normalmente `http://localhost:5173`.

Para gerar e conferir a versão de produção:

```bash
npm run build
npm run preview
```

No Windows, se a política do PowerShell bloquear o shim `npm.ps1`, use `npm.cmd` nos mesmos comandos.

## Testes e qualidade

Execute toda a esteira antes de entregar alterações:

```bash
npm run check
```

O comando executa, nesta ordem, lint, verificação de formatação, testes unitários, testes de interface e build de produção.

| Comando                | Verificação                                                                      |
| ---------------------- | -------------------------------------------------------------------------------- |
| `npm run lint`         | Regras JavaScript, React Hooks e React Refresh                                   |
| `npm run format:check` | Formatação sem alterar arquivos                                                  |
| `npm run test:unit`    | 37 testes dos modelos de lotes, risco, resgate, destinação, passaporte e contato |
| `npm run test:ui`      | 24 testes de componentes, diálogos, roteamento, formulários e persistência       |
| `npm test`             | Testes unitários e de interface                                                  |
| `npm run build`        | Compilação otimizada de produção                                                 |
| `npm run format`       | Aplica a formatação do Prettier aos arquivos do projeto                          |

Os scripts `scripts/functional-audit.mjs` e `scripts/visual-audit.mjs` complementam a esteira com auditorias locais em navegador. Eles dependem de Chrome e Playwright disponíveis nos caminhos do ambiente de entrega e, por isso, não fazem parte de `npm run check`.

## UML e mapas de arquitetura

O material de entrega possui duas escalas complementares. O diagrama principal, adequado ao corpo do relatório, apresenta as 12 classes centrais de lote, passaporte, destinação e resgate, com atributos, operações e relações legíveis. O apêndice técnico conserva a modelagem integral da arquitetura em quatro camadas — apresentação, aplicação, domínio e infraestrutura — e representa componentes funcionais React como classificadores conceituais. As relações refletem composição, agregação, associação e dependência verificadas no código; não é utilizada herança de classes na implementação.

![Diagrama UML essencial do FreshSense](./DIAGRAMA_UML_ESSENCIAL_FASE6.svg)

| Artefato                                                                                               | Uso                                                                                  |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| [`output/pdf/FreshSense_Fase6_Diagramas_UML.pdf`](./output/pdf/FreshSense_Fase6_Diagramas_UML.pdf)     | Documento A3: diagrama essencial, visão integral e 18 diagramas modulares sem cortes |
| [`DIAGRAMA_UML_ESSENCIAL_FASE6.svg`](./DIAGRAMA_UML_ESSENCIAL_FASE6.svg)                               | Diagrama essencial vetorial para inserir no relatório                                |
| [`DIAGRAMA_UML_ESSENCIAL_FASE6_EDITAVEL.drawio`](./DIAGRAMA_UML_ESSENCIAL_FASE6_EDITAVEL.drawio)       | Fonte editável do diagrama essencial no diagrams.net                                 |
| [`DIAGRAMA_UML_ESSENCIAL_FASE6_ALTA_RESOLUCAO.png`](./DIAGRAMA_UML_ESSENCIAL_FASE6_ALTA_RESOLUCAO.png) | Alternativa raster em 4520 × 2940 pixels                                             |
| [`DIAGRAMA_UML_FRESHSENSE_EDITAVEL.drawio`](./DIAGRAMA_UML_FRESHSENSE_EDITAVEL.drawio)                 | Fonte editável do diagrama completo no diagrams.net                                  |
| [`DIAGRAMA_UML_FRESHSENSE_VETORIAL.svg`](./DIAGRAMA_UML_FRESHSENSE_VETORIAL.svg)                       | Diagrama completo vetorial                                                           |
| [`DIAGRAMA_UML_FRESHSENSE_ALTA_RESOLUCAO.png`](./DIAGRAMA_UML_FRESHSENSE_ALTA_RESOLUCAO.png)           | Exportação completa em 5220 × 6620 pixels                                            |
| [`diagramas/freshsense-uml.drawio`](./diagramas/freshsense-uml.drawio)                                 | Arquivo editável com as páginas do material técnico                                  |
| [`diagramas/mapa-componentes-react.svg`](./diagramas/mapa-componentes-react.svg)                       | Visão complementar dos componentes e módulos React                                   |

O comando abaixo valida os contratos contra o código-fonte e regenera os diagramas, as exportações e o PDF:

```bash
npm run uml:generate
```

Os arquivos SVG devem ser preferidos na edição do relatório, pois preservam a nitidez em qualquer ampliação. O PNG existe como alternativa para editores que não aceitam SVG.

## Limites do ambiente demonstrativo

- telemetria, alertas, trajetos e projeções são simulados;
- os copilots usam regras e conteúdo locais, sem chamada a um modelo externo;
- o formulário de contato não envia dados para um serviço remoto;
- não há sincronização entre dispositivos ou usuários;
- a persistência depende do `localStorage` do navegador.

---

**FreshSense Fase 6** — visibilidade contínua, resposta coordenada e qualidade preservada na cadeia fria.
