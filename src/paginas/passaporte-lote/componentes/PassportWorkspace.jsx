import { useEffect, useMemo, useState } from "react";
import { useDestinations } from "../../../contextos/useDestinations";
import { useLots } from "../../../contextos/useLots";
import { useRescueOperations } from "../../../contextos/useRescueOperations";
import { Translated } from "../../../traducoes/I18nContext";
import {
  buildDigitalPassport,
  buildPassportUrl,
} from "../modelo/passportModel";
import { PassportDocument } from "./PassportDocument";
import { PassportSelector } from "./PassportSelector";

const riskPriority = { alto: 0, medio: 1, baixo: 2 };

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const temporaryField = document.createElement("textarea");
  temporaryField.value = value;
  temporaryField.setAttribute("readonly", "");
  temporaryField.style.position = "fixed";
  temporaryField.style.opacity = "0";
  document.body.appendChild(temporaryField);
  temporaryField.select();
  document.execCommand("copy");
  temporaryField.remove();
}

export function PassportWorkspace() {
  const { lots } = useLots();
  const { destinations } = useDestinations();
  const { decisions } = useRescueOperations();
  const orderedLots = useMemo(
    () =>
      [...lots].sort(
        (left, right) =>
          riskPriority[left.risk] - riskPriority[right.risk] ||
          left.id.localeCompare(right.id),
      ),
    [lots],
  );
  const requestedLotId = new URLSearchParams(window.location.search).get(
    "lote",
  );
  const [selectedLotId, setSelectedLotId] = useState(() =>
    lots.some((lot) => lot.id === requestedLotId)
      ? requestedLotId
      : (orderedLots[0]?.id ?? ""),
  );
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (lots.some((lot) => lot.id === selectedLotId)) return;
    setSelectedLotId(orderedLots[0]?.id ?? "");
  }, [lots, orderedLots, selectedLotId]);

  useEffect(() => {
    if (!feedback) return undefined;
    const timeout = window.setTimeout(() => setFeedback(""), 3600);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const selectedLot = lots.find((lot) => lot.id === selectedLotId);
  const passport = useMemo(
    () =>
      buildDigitalPassport(selectedLot, {
        decisions,
        destinations,
      }),
    [decisions, destinations, selectedLot],
  );
  const shareUrl = selectedLot
    ? buildPassportUrl(selectedLot.id, window.location.origin)
    : "";
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const visibleLots = orderedLots.filter((lot) =>
    [lot.id, lot.product, lot.category, lot.origin, lot.destination]
      .join(" ")
      .toLocaleLowerCase("pt-BR")
      .includes(normalizedQuery),
  );

  function selectLot(lotId) {
    setSelectedLotId(lotId);
    const nextUrl = buildPassportUrl(lotId, window.location.origin);
    window.history.replaceState({}, "", nextUrl);
    if (window.matchMedia("(max-width: 900px)").matches) {
      requestAnimationFrame(() =>
        document.getElementById("digital-passport")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      );
    }
  }

  async function copyLink() {
    try {
      await copyText(shareUrl);
      setFeedback("Link verificável copiado.");
    } catch {
      setFeedback("Não foi possível copiar o link neste navegador.");
    }
  }

  async function sharePassport() {
    if (!passport) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Passaporte FreshSense · ${passport.lot.id}`,
          text: `Consulte o passaporte digital verificável do lote ${passport.lot.id}.`,
          url: shareUrl,
        });
        setFeedback("Passaporte compartilhado.");
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    await copyLink();
  }

  return (
    <Translated>
      <section className="section passport-section">
        <div className="container">
          <div className="passport-intro">
            <div>
              <span>Rastreabilidade compartilhável</span>
              <h2>Uma identidade digital para cada lote</h2>
            </div>
            <p>
              O passaporte consolida identidade, condição ambiental, jornada,
              decisões e destinações em um certificado único com QR Code.
            </p>
          </div>

          <div className="passport-workspace">
            <PassportSelector
              lots={visibleLots}
              selectedLotId={selectedLotId}
              query={query}
              onQueryChange={setQuery}
              onSelect={selectLot}
            />

            {passport ? (
              <PassportDocument
                passport={passport}
                shareUrl={shareUrl}
                feedback={feedback}
                onCopy={copyLink}
                onShare={sharePassport}
                onPrint={() => window.print()}
              />
            ) : (
              <div className="passport-empty ui-empty-state" role="status">
                <strong>Nenhum lote disponível para certificação.</strong>
                <span>Cadastre um lote para gerar seu passaporte digital.</span>
                <a className="btn-fresh" href="/gestao-lotes">
                  Abrir Gestão de Lotes
                </a>
              </div>
            )}
          </div>

          <div className="passport-assurance-note">
            <span aria-hidden="true">i</span>
            <p>
              Ambiente demonstrativo: o QR Code usa o endereço atual do site.
              Quando publicado, o mesmo link pode ser aberto por destinatários e
              equipes autorizadas em qualquer dispositivo.
            </p>
          </div>
        </div>
      </section>
    </Translated>
  );
}
