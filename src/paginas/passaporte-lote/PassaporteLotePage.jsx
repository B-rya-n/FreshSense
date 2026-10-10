import { PageHero } from "../../componentes/PageHero";
import { Translated } from "../../traducoes/I18nContext";
import { PassportWorkspace } from "./componentes/PassportWorkspace";
import "./passaporte-lote.css";

export function PassaporteLotePage() {
  return (
    <Translated>
      <PageHero
        className="passport-hero"
        eyebrow="Identidade verificável · Nova funcionalidade"
        title="Passaporte Digital do Lote"
        text="Transforme dados operacionais em um registro compartilhável com QR Code, certificado de integridade e trilha completa de evidências."
      />
      <PassportWorkspace />
    </Translated>
  );
}
