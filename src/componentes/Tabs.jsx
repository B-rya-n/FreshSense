import { useRef } from "react";

export function TabList({
  items,
  activeId,
  onChange,
  label,
  idPrefix,
  panelIdPrefix,
  className = "",
  children,
}) {
  const tabRefs = useRef([]);

  function selectAt(index) {
    const normalizedIndex = (index + items.length) % items.length;
    const nextItem = items[normalizedIndex];
    onChange(nextItem.id);
    requestAnimationFrame(() => tabRefs.current[normalizedIndex]?.focus());
  }

  function handleKeyDown(event, index) {
    const keyTargets = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      Home: 0,
      End: items.length - 1,
    };

    if (!(event.key in keyTargets)) return;
    event.preventDefault();
    selectAt(keyTargets[event.key]);
  }

  return (
    <div className={className} role="tablist" aria-label={label}>
      {items.map((item, index) => {
        const selected = activeId === item.id;
        return (
          <button
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`${idPrefix}-${item.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`${panelIdPrefix}-${item.id}`}
            className={selected ? "active" : undefined}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            key={item.id}
          >
            {children(item, selected)}
          </button>
        );
      })}
    </div>
  );
}
