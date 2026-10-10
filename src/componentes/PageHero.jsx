import { Translated } from "../traducoes/I18nContext";

export function PageHero({ eyebrow, title, text, className = "" }) {
  return (
    <Translated>
      <section className={`page-hero ${className}`}>
        <div className="container reveal visible">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="lead-text">{text}</p>
        </div>
      </section>
    </Translated>
  );
}
