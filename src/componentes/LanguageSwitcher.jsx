import { Translated } from "../traducoes/I18nContext";
import { useI18n } from "../traducoes/useI18n";

const languages = ["pt", "en", "es"];

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  return (
    <Translated>
      <li>
        <div className="language-switcher" role="group" aria-label="Idioma">
          {languages.map((item) => (
            <button
              key={item}
              type="button"
              className={language === item ? "active" : ""}
              aria-pressed={language === item}
              onClick={() => setLanguage(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </li>
    </Translated>
  );
}
