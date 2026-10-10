import { PageHero } from "../../componentes/PageHero";
import { ContactForm } from "./componentes/ContactForm";
import { Translated } from "../../traducoes/I18nContext";
import "./contato.css";

export function ContatoPage() {
  return (
    <Translated>
      <PageHero
        className="contact-hero"
        eyebrow="Fale Conosco"
        title="Converse com a FreshSense sobre sua operação alimentar"
        text="Conte seu cenário de produção, transporte ou armazenagem para avaliarmos como sensores, alertas e rastreabilidade podem ajudar a reduzir perdas."
      />

      <ContactForm />
    </Translated>
  );
}
