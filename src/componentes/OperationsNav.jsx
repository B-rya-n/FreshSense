import { useEffect, useRef } from "react";
import { Translated } from "../traducoes/I18nContext";

export function OperationsNav({ currentPath, routes }) {
  const activeLinkRef = useRef(null);
  const operationRoutes = routes
    .filter((route) => route.section === "operations")
    .sort((a, b) => a.operationOrder - b.operationOrder);

  useEffect(() => {
    activeLinkRef.current?.scrollIntoView?.({
      behavior: "auto",
      block: "nearest",
      inline: "center",
    });
  }, [currentPath]);

  if (!operationRoutes.some((route) => route.path === currentPath)) {
    return null;
  }

  return (
    <Translated>
      <nav className="operations-nav" aria-label="Ferramentas operacionais">
        <div className="container operations-nav-inner">
          <div className="operations-nav-heading">
            <span>Workspace</span>
            <strong>Operação</strong>
          </div>
          <div className="operations-nav-scroll">
            {operationRoutes.map((route) => (
              <a
                className="operations-nav-link"
                aria-current={currentPath === route.path ? "page" : undefined}
                href={route.path}
                key={route.path}
                ref={currentPath === route.path ? activeLinkRef : undefined}
              >
                <span>{String(route.operationOrder).padStart(2, "0")}</span>
                {route.operationLabel}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </Translated>
  );
}
