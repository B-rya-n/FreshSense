import { useEffect, useState } from "react";
import { normalizePath } from "../utilitarios/text";

function readLocation() {
  return {
    pathname: normalizePath(window.location.pathname),
    search: window.location.search,
    hash: window.location.hash,
  };
}

export function useRouter() {
  const [location, setLocation] = useState(readLocation);

  useEffect(() => {
    const syncLocation = () => setLocation(readLocation());
    const handleClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;

      const link = event.target.closest("a[href]");
      if (
        !link ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self") ||
        link.origin !== window.location.origin
      )
        return;

      const href = link.getAttribute("href");
      if (!href?.startsWith("/") || href.startsWith("//")) return;

      event.preventDefault();
      window.history.pushState({}, "", href);
      syncLocation();
    };

    window.addEventListener("popstate", syncLocation);
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("popstate", syncLocation);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return location;
}
