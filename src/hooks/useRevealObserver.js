import { useEffect } from "react";

export function useRevealObserver(containerRef, refreshKey) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const supportsIntersection = "IntersectionObserver" in window;
    const intersectionObserver = supportsIntersection
      ? new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("visible");
              intersectionObserver.unobserve(entry.target);
            }),
          { threshold: 0.12 },
        )
      : null;

    function register(node) {
      if (!(node instanceof Element)) return;
      const items = [
        ...(node.matches(".reveal") ? [node] : []),
        ...node.querySelectorAll(".reveal"),
      ];

      items.forEach((item) => {
        if (intersectionObserver) intersectionObserver.observe(item);
        else item.classList.add("visible");
      });
    }

    register(container);
    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach(register));
    });
    mutationObserver.observe(container, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      intersectionObserver?.disconnect();
    };
  }, [containerRef, refreshKey]);
}
