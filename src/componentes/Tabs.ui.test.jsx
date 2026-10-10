import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, test } from "vitest";
import { TabList } from "./Tabs";

const items = [
  { id: "overview", label: "Visão geral" },
  { id: "operation", label: "Operação" },
  { id: "assets", label: "Ativos" },
];

function TabsFixture() {
  const [activeId, setActiveId] = useState("overview");
  return (
    <TabList
      items={items}
      activeId={activeId}
      onChange={setActiveId}
      label="Áreas"
      idPrefix="tab"
      panelIdPrefix="panel"
    >
      {(item) => item.label}
    </TabList>
  );
}

afterEach(cleanup);

describe("TabList", () => {
  test("navega com as setas e mantém apenas a aba ativa no tab order", () => {
    render(<TabsFixture />);
    const tabs = screen.getAllByRole("tab");

    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });

    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(tabs[1].tabIndex).toBe(0);
    expect(tabs[0].tabIndex).toBe(-1);
  });
});
