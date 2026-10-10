import { useState } from "react";
import { SelectFormField as SelectField } from "../../../componentes/FormField";
import { Translated } from "../../../traducoes/I18nContext";
import { emptyContactForm, validateContact } from "../modelo/contactValidation";

export function ContactForm() {
  const [data, setData] = useState(emptyContactForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });

  const update = (key, value) => {
    const next = { ...data, [key]: value };
    setData(next);
    setStatus({ type: "", message: "" });
    if (["nome", "email", "mensagem"].includes(key))
      setErrors((current) => ({
        ...current,
        [key]: validateContact(next)[key] ?? "",
      }));
  };

  const fieldClass = (key) =>
    errors[key] ? "is-invalid" : data[key].trim() ? "is-valid" : "";

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateContact(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus({
        type: "error",
        message: "Revise os campos destacados antes de enviar.",
      });
      setTimeout(
        () => document.querySelector(".contact-form .is-invalid")?.focus(),
        0,
      );
      return;
    }
    setStatus({
      type: "success",
      message:
        "Mensagem validada para esta demonstração. Nenhum dado foi enviado para um servidor.",
    });
    setData(emptyContactForm);
    setErrors({});
  };

  return (
    <Translated>
      <section className="section surface">
        <div className="container contact-layout">
          <aside className="contact-panel card reveal">
            <span className="tag">Atendimento FreshSense</span>
            <h2>Como podemos ajudar</h2>
            <p>
              Compartilhe sua necessidade e receba um retorno direcionado para
              operações com alimentos perecíveis.
            </p>
            <div className="contact-list">
              <div>
                <strong>Parcerias</strong>
                <span>Produtores, cooperativas e centros de distribuição.</span>
              </div>
              <div>
                <strong>Dúvidas técnicas</strong>
                <span>Sensores, alertas, rastreabilidade e relatórios.</span>
              </div>
              <div>
                <strong>Implantação operacional</strong>
                <span>
                  Diagnóstico de cadeia fria, prioridades e indicadores.
                </span>
              </div>
            </div>
            <div
              className="contact-metrics"
              aria-label="Indicadores de atendimento"
            >
              <div>
                <span>Retorno</span>
                <strong>até 2 dias</strong>
              </div>
              <div>
                <span>Foco</span>
                <strong>operação real</strong>
              </div>
            </div>
          </aside>
          <form
            id="formContato"
            className="contact-form card reveal"
            noValidate
            onSubmit={submit}
          >
            <div className="form-head">
              <span className="tag">Mensagem</span>
              <h2>Envie sua solicitação</h2>
              <p>
                Preencha os dados principais para que a equipe FreshSense
                entenda seu contexto.
              </p>
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="nome">Nome completo</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  autoComplete="name"
                  placeholder="Ex.: Ana Silva"
                  className={fieldClass("nome")}
                  aria-invalid={Boolean(errors.nome)}
                  aria-describedby="nomeHint nomeErro"
                  aria-required="true"
                  required
                  value={data.nome}
                  onChange={(event) => update("nome", event.target.value)}
                />
                <small id="nomeHint" className="field-hint">
                  Informe nome e sobrenome, com pelo menos 2 letras cada.
                </small>
                <small id="nomeErro" className="field-error" aria-live="polite">
                  {errors.nome}
                </small>
              </div>
              <div className="form-field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="ana@email.com"
                  className={fieldClass("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby="emailErro"
                  aria-required="true"
                  required
                  value={data.email}
                  onChange={(event) => update("email", event.target.value)}
                />
                <small
                  id="emailErro"
                  className="field-error"
                  aria-live="polite"
                >
                  {errors.email}
                </small>
              </div>
              <SelectField
                id="perfil"
                label="Perfil"
                value={data.perfil}
                onChange={(event) => update("perfil", event.target.value)}
              >
                <option value="">Selecione uma opção</option>
                <option>Produtor ou cooperativa</option>
                <option>Transporte e logística</option>
                <option>Armazenagem e distribuição</option>
                <option>Instituição pública ou social</option>
                <option>Equipe de qualidade alimentar</option>
              </SelectField>
              <SelectField
                id="assunto"
                label="Assunto"
                value={data.assunto}
                onChange={(event) => update("assunto", event.target.value)}
              >
                <option value="">Selecione uma opção</option>
                <option>Parceria ou projeto piloto</option>
                <option>Dúvidas sobre sensores</option>
                <option>Rastreabilidade e alertas</option>
                <option>Relatórios e impacto social</option>
              </SelectField>
              <SelectField
                id="operacao"
                label="Tamanho da operação"
                full
                value={data.operacao}
                onChange={(event) => update("operacao", event.target.value)}
              >
                <option value="">Selecione uma opção</option>
                <option>Pequena operação local</option>
                <option>Cooperativa ou produtor recorrente</option>
                <option>Centro de distribuição</option>
                <option>Rede com múltiplas rotas</option>
              </SelectField>
              <div className="form-field full">
                <label htmlFor="mensagem">Descrição da mensagem</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  rows="6"
                  maxLength="500"
                  placeholder="Descreva sua dúvida, sugestão ou proposta"
                  className={fieldClass("mensagem")}
                  aria-invalid={Boolean(errors.mensagem)}
                  aria-describedby="mensagemErro contadorMensagem"
                  aria-required="true"
                  required
                  value={data.mensagem}
                  onChange={(event) => update("mensagem", event.target.value)}
                />
                <div className="field-meta">
                  <small
                    id="mensagemErro"
                    className="field-error"
                    aria-live="polite"
                  >
                    {errors.mensagem}
                  </small>
                  <small
                    id="contadorMensagem"
                    className={`field-counter ${
                      data.mensagem.length > 500 ? "limit-warning" : ""
                    }`}
                  >
                    {data.mensagem.length}/500 caracteres
                  </small>
                </div>
              </div>
              <button className="btn-fresh btn-block" type="submit">
                Enviar mensagem
              </button>
              <p
                className={`status-message ${status.type ? `status-${status.type}` : ""}`}
                role="status"
                aria-live="polite"
              >
                {status.message}
              </p>
            </div>
          </form>
        </div>
      </section>
    </Translated>
  );
}
