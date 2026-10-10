import { normalizeSearchTerm } from "../../../utilitarios/text";

export const defaultLotFilters = {
  query: "",
  category: "todos",
  risk: "todos",
  temperature: "todas",
  stage: "todas",
};

export function filterLots(lots, filters) {
  const term = normalizeSearchTerm(filters.query.trim());

  return lots.filter((lot) => {
    const searchableFields = [
      lot.id,
      lot.product,
      lot.category,
      lot.origin,
      lot.stage,
    ];
    const matchesQuery =
      !term ||
      searchableFields.some((field) =>
        normalizeSearchTerm(field).includes(term),
      );
    const matchesCategory =
      filters.category === "todos" || lot.category === filters.category;
    const matchesRisk = filters.risk === "todos" || lot.risk === filters.risk;
    const matchesStage =
      filters.stage === "todas" || lot.stage === filters.stage;
    const matchesTemperature =
      filters.temperature === "todas" ||
      (filters.temperature === "ate5" && lot.temperature <= 5) ||
      (filters.temperature === "5a8" &&
        lot.temperature > 5 &&
        lot.temperature <= 8) ||
      (filters.temperature === "acima8" && lot.temperature > 8);

    return (
      matchesQuery &&
      matchesCategory &&
      matchesRisk &&
      matchesStage &&
      matchesTemperature
    );
  });
}
