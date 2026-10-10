import { useEffect, useRef, useState } from "react";
import { SiteCopilot } from "./copilot/SiteCopilot";
import { Translated } from "../traducoes/I18nContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  readStoredValue,
  storageKeys,
  writeStoredValue,
} from "../utilitarios/browserStorage";
import { SiteSearch } from "./SiteSearch";
import { OperationsNav } from "./OperationsNav";
import { useRevealObserver } from "../hooks/useRevealObserver";

export function AppLayout({ currentPath, routes, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(
    () => readStoredValue(storageKeys.theme) === "dark",
  );
  const [showBackTop, setShowBackTop] = useState(false);
  const progressRef = useRef(null);
  const contentRef = useRef(null);
  const navToggleRef = useRef(null);
  const previousPathRef = useRef(currentPath);
  const navigationRoutes = routes.filter(
    (route) => route.showInNavigation !== false,
  );
  const primaryRoutes = navigationRoutes.filter(
    (route) => !route.isCallToAction,
  );
  const actionRoutes = navigationRoutes.filter((route) => route.isCallToAction);
  const currentRoute = routes.find((route) => route.path === currentPath);

  const getNavigationState = (route) => {
    const href = route.navigationHref ?? route.path;
    const isCurrentPage = currentPath === href;
    const isCurrentSection =
      route.section && route.section === currentRoute?.section;
    return {
      href,
      ariaCurrent: isCurrentPage
        ? "page"
        : isCurrentSection
          ? "location"
          : undefined,
    };
  };

  useRevealObserver(contentRef, currentPath);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    writeStoredValue(storageKeys.theme, dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    if (previousPathRef.current === currentPath) return undefined;
    previousPathRef.current = currentPath;
    const focusFrame = window.requestAnimationFrame(() => {
      contentRef.current?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [currentPath]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      navToggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const closeOnResize = () => window.innerWidth > 1160 && setMenuOpen(false);
    window.addEventListener("resize", closeOnResize, { passive: true });
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty(
        "transform",
        `scaleX(${max > 0 ? window.scrollY / max : 0})`,
      );
      setShowBackTop(window.scrollY > 440);
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, [currentPath]);

  return (
    <Translated>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
      <header className={`site-header ${menuOpen ? "menu-open" : ""}`}>
        <nav className="site-nav container" aria-label="Navegação principal">
          <a className="brand" href="/" onClick={() => setMenuOpen(false)}>
            <span>Fresh</span>Sense
          </a>
          <button
            ref={navToggleRef}
            className="nav-toggle"
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            <span className="nav-toggle-icon" aria-hidden="true">
              {menuOpen ? "×" : "☰"}
            </span>
            <span>{menuOpen ? "Fechar" : "Menu"}</span>
          </button>
          <div className="nav-panel" id="primary-navigation">
            <ul className="nav-menu" aria-label="Páginas institucionais">
              {primaryRoutes.map((route) => {
                const navigationState = getNavigationState(route);
                return (
                  <li key={route.path}>
                    <a
                      className="nav-link"
                      aria-current={navigationState.ariaCurrent}
                      href={navigationState.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {route.navigationLabel ?? route.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            <ul className="nav-actions" aria-label="Ações do site">
              <SiteSearch
                pages={routes}
                onNavigate={() => setMenuOpen(false)}
              />
              <LanguageSwitcher />
              <li>
                <button
                  className="theme-toggle"
                  type="button"
                  onClick={() => setDark((value) => !value)}
                  aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
                  title={dark ? "Ativar modo claro" : "Ativar modo escuro"}
                >
                  <svg
                    className="nav-control-icon"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    {dark ? (
                      <>
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
                      </>
                    ) : (
                      <path d="M20.4 14.2A8.5 8.5 0 0 1 9.8 3.6 8.5 8.5 0 1 0 20.4 14.2Z" />
                    )}
                  </svg>
                  <span className="nav-control-label">
                    {dark ? "Modo claro" : "Modo escuro"}
                  </span>
                </button>
              </li>
              {actionRoutes.map((route) => (
                <li key={route.path}>
                  <a
                    className="nav-link nav-cta"
                    aria-current={
                      currentPath === route.path ? "page" : undefined
                    }
                    href={route.path}
                    onClick={() => setMenuOpen(false)}
                  >
                    {route.navigationLabel ?? route.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>
      <OperationsNav currentPath={currentPath} routes={routes} />
      <main ref={contentRef} id="conteudo" tabIndex={-1}>
        {children}
      </main>
      <footer className="footer">
        <div className="container footer-grid">
          <strong>FreshSense • Inteligência para cadeia fria</strong>
          <span>
            Visibilidade contínua. Resposta coordenada. Qualidade preservada.
          </span>
        </div>
      </footer>
      <SiteCopilot currentPath={currentPath} />
      <button
        className={`back-to-top ${showBackTop ? "visible" : ""}`}
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Voltar ao topo"
      >
        ↑
      </button>
    </Translated>
  );
}
