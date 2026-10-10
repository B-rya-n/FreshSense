import { useState } from "react";
import { Translated } from "../../../traducoes/I18nContext";

const profiles = {
  operacao: [
    "Controle na origem",
    "Operação estabelece o contexto antes da expedição",
    "Registra produto, faixa esperada, origem, destino e sensor para que cada evento posterior pertença ao lote correto.",
  ],
  logistica: [
    "Resposta em trânsito",
    "Logística intervém enquanto a carga ainda está em movimento",
    "Recebe desvios contextualizados, avalia a janela disponível e coordena rota, veículo e recebimento com as equipes envolvidas.",
  ],
  qualidade: [
    "Decisão técnica",
    "Qualidade investiga com uma trilha completa de evidências",
    "Compara limites, duração, confiabilidade da leitura e ações executadas antes de registrar sua avaliação sobre o lote.",
  ],
  lideranca: [
    "Gestão de desempenho",
    "Liderança transforma ocorrências em melhoria operacional",
    "Acompanha recorrência, tempo de resposta, disponibilidade de ativos e exposição potencial para priorizar investimentos e processos.",
  ],
};

const profileKeys = Object.keys(profiles);

export function ProfileJourney() {
  const [active, setActive] = useState("operacao");
  const profile = profiles[active];

  const handleKey = (event, index) => {
    const direction = ["ArrowRight", "ArrowDown"].includes(event.key)
      ? 1
      : ["ArrowLeft", "ArrowUp"].includes(event.key)
        ? -1
        : 0;
    if (!direction) return;
    event.preventDefault();
    const next =
      profileKeys[
        (index + direction + profileKeys.length) % profileKeys.length
      ];
    setActive(next);
    document.getElementById(`profile-${next}`)?.focus();
  };

  return (
    <Translated>
      <section className="section">
        <div className="container user-journey">
          <div className="section-title reveal">
            <span className="tag">Decisões por responsabilidade</span>
            <h2>Veja como o mesmo evento muda para cada equipe</h2>
          </div>
          <div
            className="journey-picker reveal"
            role="tablist"
            aria-label="Perfis de usuário"
          >
            {profileKeys.map((key, index) => (
              <button
                id={`profile-${key}`}
                key={key}
                type="button"
                className={`btn-soft ${active === key ? "active" : ""}`}
                role="tab"
                aria-selected={active === key}
                aria-controls="profile-result"
                tabIndex={active === key ? 0 : -1}
                onClick={() => setActive(key)}
                onKeyDown={(event) => handleKey(event, index)}
              >
                {key[0].toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
          <article
            id="profile-result"
            className="journey-result card reveal"
            role="tabpanel"
            aria-live="polite"
            aria-labelledby={`profile-${active}`}
          >
            <span className="tag">{profile[0]}</span>
            <h3>{profile[1]}</h3>
            <p>{profile[2]}</p>
          </article>
        </div>
      </section>
    </Translated>
  );
}
