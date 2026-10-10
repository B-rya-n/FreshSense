import { Translated } from "../../../traducoes/I18nContext";

export function RiskMethodology() {
  return (
    <Translated>
      <section className="risk-methodology" id="metodologia-risco">
        <div className="risk-methodology-heading">
          <div>
            <span className="risk-kicker">Transparência do modelo</span>
            <h2>Como o índice é construído</h2>
          </div>
          <p>
            O modelo mantém pesos explícitos e separa condição observada,
            impacto, incerteza e tratamento. Assim, cada mudança no resultado
            pode ser compreendida e revisada.
          </p>
        </div>

        <div className="risk-method-grid">
          <article>
            <span>01</span>
            <h3>Contextualizar</h3>
            <p>Produto, volume, etapa, vida útil e condições de controle.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Analisar</h3>
            <p>Dez fatores ponderados formam o índice de probabilidade.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Avaliar</h3>
            <p>Probabilidade e impacto posicionam o cenário na matriz 5 × 5.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Tratar e revisar</h3>
            <p>
              Medidas de controle permitem comparar risco residual e orientar a
              verificação.
            </p>
          </article>
        </div>

        <div className="risk-formula-panel">
          <div>
            <span>Índice final</span>
            <strong>72% fatores ponderados + 28% matriz normalizada</strong>
          </div>
          <div>
            <span>Confiança</span>
            <strong>Qualidade do sensor + cobertura temporal</strong>
          </div>
          <div>
            <span>Incerteza</span>
            <strong>Margem ampliada quando faltam dados confiáveis</strong>
          </div>
          <div>
            <span>Volume estimado</span>
            <strong>
              Peso × taxa indicativa de 3–32%; parcela potencialmente evitável
              de 68%
            </strong>
          </div>
        </div>

        <div className="risk-reference-grid">
          <article>
            <span>Gestão de risco</span>
            <h3>ISO 31000:2018</h3>
            <p>
              Referência para identificar, analisar, avaliar, tratar, monitorar
              e comunicar riscos.
            </p>
            <a
              href="https://www.iso.org/standard/65694.html"
              target="_blank"
              rel="noreferrer"
            >
              Consultar ISO <span aria-hidden="true">↗</span>
            </a>
          </article>
          <article>
            <span>Rastreabilidade</span>
            <h3>GS1 EPCIS 2.0.1</h3>
            <p>
              Referência para registrar eventos com identidade, tempo, local,
              contexto de negócio e condição observada.
            </p>
            <a
              href="https://ref.gs1.org/standards/epcis/2.0.1/"
              target="_blank"
              rel="noreferrer"
            >
              Consultar GS1 <span aria-hidden="true">↗</span>
            </a>
          </article>
          <article>
            <span>Controle preventivo</span>
            <h3>Codex / FAO HACCP</h3>
            <p>
              Orientação para monitorar limites, executar ação corretiva,
              verificar e manter registros.
            </p>
            <a
              href="https://www.fao.org/good-hygiene-practices-haccp-toolbox/haccp/step-9-monitoring-critical-limits/en"
              target="_blank"
              rel="noreferrer"
            >
              Consultar FAO <span aria-hidden="true">↗</span>
            </a>
          </article>
          <article>
            <span>Transporte de alimentos</span>
            <h3>FDA Sanitary Transportation</h3>
            <p>
              Referência para controle de temperatura, embalagem, comunicação e
              resposta a possíveis falhas durante o transporte.
            </p>
            <a
              href="https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-industry-sanitary-transportation-food"
              target="_blank"
              rel="noreferrer"
            >
              Consultar FDA <span aria-hidden="true">↗</span>
            </a>
          </article>
        </div>

        <div className="risk-safety-notice">
          <strong>Limite de uso</strong>
          <p>
            Esta ferramenta apoia a comparação de cenários com parâmetros
            configuráveis. Não substitui avaliação microbiológica, plano HACCP,
            legislação aplicável, validação do processo ou decisão de um
            responsável técnico. Uma excursão pode exigir retenção preventiva do
            produto até avaliação competente.
          </p>
        </div>
      </section>
    </Translated>
  );
}
