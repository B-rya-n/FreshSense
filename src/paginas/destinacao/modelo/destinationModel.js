export const destinationTypes = Object.freeze({
  doacao: "Doação",
  venda: "Venda prioritária",
  desconto: "Aplicação de desconto",
  transferencia: "Transferência entre unidades",
});

export const destinationStatus = Object.freeze({
  pendente: "Pendente",
  aprovada: "Aprovada",
  transporte: "Em transporte",
  concluida: "Concluída",
  cancelada: "Cancelada",
});

export const institutions = [
  {
    id: "INS-01",
    name: "Banco de Alimentos de São Paulo",
    city: "São Paulo - SP",
    type: "Banco de alimentos",
  },
  {
    id: "INS-02",
    name: "Rede Solidária do Alto Tietê",
    city: "Suzano - SP",
    type: "Organização social",
  },
  {
    id: "INS-03",
    name: "Cozinha Comunitária Esperança",
    city: "Mogi das Cruzes - SP",
    type: "Cozinha comunitária",
  },
  {
    id: "UNI-01",
    name: "Centro de Distribuição Campinas",
    city: "Campinas - SP",
    type: "Unidade FreshSense",
  },
  {
    id: "VAR-01",
    name: "FreshMarket Pinheiros",
    city: "São Paulo - SP",
    type: "Ponto de venda",
  },
];

export const initialDestinations = [
  {
    id: "DST-2401",
    lotId: "LT-1038",
    product: "Morango",
    type: "doacao",
    quantity: 60,
    unit: "kg",
    recipient: "Rede Solidária do Alto Tietê",
    responsible: "Marina Costa",
    pickupDate: "2026-10-08",
    notes: "Retirada refrigerada após liberação da equipe de qualidade.",
    status: "aprovada",
    createdAt: "28/09/2026 10:40",
    origin: "Atibaia - SP",
    history: [
      { status: "pendente", date: "28/09/2026 10:40" },
      { status: "aprovada", date: "28/09/2026 11:15" },
    ],
  },
];

const allowedTransitions = Object.freeze({
  pendente: ["aprovada", "cancelada"],
  aprovada: ["transporte", "cancelada"],
  transporte: ["concluida", "cancelada"],
  concluida: [],
  cancelada: [],
});

export function getLotQuantity(lot) {
  return Number(lot?.weight ?? lot?.quantity ?? 0);
}

export function getLotUnit(lot) {
  return lot?.unit ?? "kg";
}

export function getCommittedQuantity(destinations, lotId) {
  return destinations
    .filter((item) => item.lotId === lotId && item.status !== "cancelada")
    .reduce((total, item) => total + Number(item.quantity || 0), 0);
}

export function getAvailableQuantity(lot, destinations = []) {
  if (!lot) return 0;
  return Math.max(
    0,
    getLotQuantity(lot) - getCommittedQuantity(destinations, lot.id),
  );
}

export function suggestDestination(lot) {
  if (!lot) return null;

  if (lot.risk === "alto") {
    return {
      type: "doacao",
      title: "Priorizar destinação após liberação da qualidade",
      reason:
        "O desvio exige resposta rápida; a doação só deve seguir após inspeção e liberação sanitária.",
    };
  }

  if (lot.risk === "medio") {
    return {
      type: "desconto",
      title: "Antecipar a saída comercial do lote",
      reason:
        "A condição requer atenção e um desconto pode acelerar o giro antes da perda de qualidade.",
    };
  }

  return {
    type: "transferencia",
    title: "Rebalancear o estoque entre unidades",
    reason:
      "O lote está estável e pode atender uma unidade com maior demanda sem comprometer a qualidade.",
  };
}

export function validateDestination(values, lot, availableQuantity) {
  const errors = {};
  const quantity = Number(values.quantity);
  const available = Number.isFinite(availableQuantity)
    ? availableQuantity
    : getLotQuantity(lot);

  if (!lot) errors.lotId = "Selecione um lote.";
  if (!values.type) errors.type = "Escolha uma forma de destinação.";
  if (!Number.isFinite(quantity) || quantity <= 0) {
    errors.quantity = "Informe uma quantidade maior que zero.";
  } else if (lot && quantity > available) {
    errors.quantity = `A quantidade máxima disponível é ${available.toLocaleString("pt-BR")} ${getLotUnit(lot)}.`;
  }
  if (!values.recipient) errors.recipient = "Selecione o destino do lote.";
  if (
    String(values.responsible ?? "")
      .trim()
      .split(/\s+/).length < 2
  ) {
    errors.responsible = "Informe o nome e o sobrenome do responsável.";
  }
  if (!values.pickupDate) {
    errors.pickupDate = "Informe a data prevista.";
  } else {
    const selected = new Date(`${values.pickupDate}T12:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(selected.getTime()) || selected < today) {
      errors.pickupDate = "A data não pode estar no passado.";
    }
  }
  if (String(values.notes ?? "").length > 240) {
    errors.notes = "Use no máximo 240 caracteres.";
  }

  return errors;
}

export function createDestination(
  values,
  lot,
  recipientName,
  now = new Date(),
) {
  const stamp = now.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
  const uniqueToken =
    globalThis.crypto?.randomUUID?.().slice(0, 8).toUpperCase() ??
    Math.random().toString(36).slice(2, 10).toUpperCase();

  return {
    id: `DST-${now.getTime().toString(36).toUpperCase()}-${uniqueToken}`,
    lotId: lot.id,
    product: lot.product,
    type: values.type,
    quantity: Number(values.quantity),
    unit: getLotUnit(lot),
    recipient: recipientName,
    responsible: values.responsible.trim(),
    pickupDate: values.pickupDate,
    notes: values.notes.trim(),
    status: "pendente",
    createdAt: stamp,
    origin: lot.origin,
    history: [{ status: "pendente", date: stamp }],
  };
}

export function advanceDestination(destination, nextStatus, now = new Date()) {
  if (!allowedTransitions[destination.status]?.includes(nextStatus)) {
    return destination;
  }

  const date = now.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return {
    ...destination,
    status: nextStatus,
    history: [...destination.history, { status: nextStatus, date }],
  };
}

export function getNextDestinationStatus(currentStatus) {
  return (
    allowedTransitions[currentStatus]?.find(
      (status) => status !== "cancelada",
    ) ?? null
  );
}

export function formatPickupDate(value, locale = "pt-BR") {
  return new Intl.DateTimeFormat(locale).format(new Date(`${value}T12:00:00`));
}
