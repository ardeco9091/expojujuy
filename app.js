const goalContent = {
  proveedores: {
    title: "Empresas que necesitás conocer",
    first: "PunaTech",
    second: "Ronda de vinculación empresarial",
    third: "Pabellón de industria y servicios"
  },
  innovacion: {
    title: "Innovaciones seleccionadas para vos",
    first: "PunaTech y automatización productiva",
    second: "IA aplicada a la producción regional",
    third: "Zona de demostraciones"
  },
  agenda: {
    title: "Tu día, organizado de punta a punta",
    first: "Primera actividad recomendada",
    second: "Conferencia en Auditorio Central",
    third: "Recorrido por empresas guardadas"
  }
};

const phaseContent = {
  before: {
    kicker: "DESAFÍO DIGITAL · PROTOTIPO",
    headline: "La expo que se",
    accent: "adapta a vos.",
    description: "Elegí tu objetivo y convertí toda la información del evento en un recorrido personal.",
    action: "Comenzar mi recorrido"
  },
  live: {
    kicker: "EXPOJUY · SUCEDIENDO AHORA",
    headline: "Todo lo que pasa,",
    accent: "en tiempo real.",
    description: "Actividades en curso, próximos encuentros y la ruta más simple para llegar a cada espacio.",
    action: "Ver qué está pasando"
  },
  after: {
    kicker: "LAS CONEXIONES CONTINÚAN",
    headline: "La experiencia sigue",
    accent: "después de la expo.",
    description: "Recuperá empresas, actividades y contactos guardados para continuar generando oportunidades.",
    action: "Revisar mis conexiones"
  }
};

const standData = {
  A12: { id: "ex-punatech", company: "PunaTech", sector: "Tecnología", distance: "4 min", description: "Automatización y datos para la producción regional." },
  B08: { id: "ex-andina", company: "Andina Solar", sector: "Energía", distance: "7 min", description: "Soluciones renovables para empresas y comunidades." },
  C21: { id: "ex-litica", company: "Lítica Circular", sector: "Industria", distance: "9 min", description: "Procesos industriales con foco en economía circular." },
  D05: { id: "ex-norte", company: "Norte Logística", sector: "Logística", distance: "12 min", description: "Transporte inteligente y conexión con mercados regionales." }
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let selectedFilter = "all";
let selectedStand = "A12";
let toastTimer;
let saved = [];
let drawerBackdropTimer;
let drawerReturnFocus;

try {
  saved = JSON.parse(localStorage.getItem("expojuy-saved") || "[]");
  if (!Array.isArray(saved)) saved = [];
} catch {
  saved = [];
}

function transition(update) {
  if (document.startViewTransition && !prefersReducedMotion.matches) {
    document.startViewTransition(update);
  } else {
    update();
  }
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function saveState() {
  localStorage.setItem("expojuy-saved", JSON.stringify(saved));
  renderSaved();
}

function normalizeSearch(value) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function updateSelectedStandButton() {
  const button = document.querySelector("#saveSelectedStand");
  const isSaved = saved.some((item) => item.id === standData[selectedStand].id);
  button.setAttribute("aria-pressed", String(isSaved));
  button.classList.toggle("saved", isSaved);
  button.firstChild.textContent = isSaved ? "Destino guardado " : "Guardar destino ";
  button.querySelector("span").textContent = isSaved ? "✓" : "＋";
}

function toggleSaved(item) {
  const index = saved.findIndex((entry) => entry.id === item.id);
  if (index >= 0) {
    saved.splice(index, 1);
    showToast(`${item.title} se eliminó de tu recorrido`);
  } else {
    saved.push(item);
    showToast(`${item.title} se guardó en Mi ExpoJuy`);
  }
  saveState();
}

function renderSaved() {
  const container = document.querySelector("#savedItems");
  const empty = document.querySelector("#drawerEmpty");
  const count = saved.length;
  document.querySelector("#savedCount").textContent = count;
  document.querySelector("#drawerCount").textContent = count;
  empty.hidden = count > 0;
  container.hidden = count === 0;
  container.replaceChildren();

  saved.forEach((item) => {
    const article = document.createElement("article");
    article.className = "saved-item";
    const content = document.createElement("div");
    const kind = document.createElement("small");
    kind.textContent = item.kind;
    const title = document.createElement("strong");
    title.textContent = item.title;
    const meta = document.createElement("span");
    meta.textContent = item.meta;
    content.append(kind, title, meta);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.setAttribute("aria-label", `Eliminar ${item.title}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => toggleSaved(item));
    article.append(content, remove);
    container.append(article);
  });

  document.querySelectorAll("[data-save-id]").forEach((button) => {
    const isSaved = saved.some((item) => item.id === button.dataset.saveId);
    button.classList.toggle("saved", isSaved);
    button.setAttribute("aria-pressed", String(isSaved));
    const symbol = button.querySelector("span:first-child");
    const label = button.querySelector(".save-label");
    if (symbol) symbol.textContent = isSaved ? "✓" : "＋";
    if (label) label.textContent = isSaved ? "Guardado" : button.classList.contains("compact") ? "Sumar" : "Guardar";
  });

  updateSelectedStandButton();
}

document.querySelectorAll(".save-button[data-save-id]").forEach((button) => {
  button.addEventListener("click", () => toggleSaved({
    id: button.dataset.saveId,
    title: button.dataset.title,
    meta: button.dataset.meta,
    kind: button.dataset.kind
  }));
});

document.querySelectorAll(".goal").forEach((button) => {
  button.addEventListener("click", () => {
    transition(() => {
      document.querySelectorAll(".goal").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      const content = goalContent[button.dataset.goal];
      document.querySelector("#routeTitle").textContent = content.title;
      const nodes = document.querySelectorAll(".route-node strong");
      nodes[0].textContent = content.first;
      nodes[1].textContent = content.second;
      nodes[2].textContent = content.third;
    });
  });
});

document.querySelectorAll(".phase").forEach((button) => {
  button.addEventListener("click", () => {
    transition(() => {
      document.querySelectorAll(".phase").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      const content = phaseContent[button.dataset.phase];
      document.querySelector("#phaseKicker").textContent = content.kicker;
      document.querySelector("#phaseHeadline").textContent = content.headline;
      document.querySelector("#phaseAccent").textContent = content.accent;
      document.querySelector("#phaseDescription").textContent = content.description;
      document.querySelector(".primary-action").childNodes[0].textContent = `${content.action} `;
      document.body.dataset.phase = button.dataset.phase;
    });
  });
});

function filterExhibitors() {
  const query = normalizeSearch(document.querySelector("#exhibitorSearch").value.trim());
  let visible = 0;
  document.querySelectorAll(".exhibitor-card").forEach((card) => {
    const matchesFilter = selectedFilter === "all" || card.dataset.sector === selectedFilter;
    const matchesSearch = !query || normalizeSearch(card.dataset.search).includes(query);
    card.hidden = !(matchesFilter && matchesSearch);
    if (!card.hidden) visible += 1;
  });
  document.querySelector("#resultsCount").textContent = `${visible} ${visible === 1 ? "oportunidad encontrada" : "oportunidades encontradas"}`;
  document.querySelector("#emptyResults").hidden = visible !== 0;
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    selectedFilter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    filterExhibitors();
  });
});

document.querySelector("#exhibitorSearch").addEventListener("input", filterExhibitors);
document.addEventListener("keydown", (event) => {
  const activeTag = document.activeElement?.tagName;
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(activeTag)) {
    event.preventDefault();
    document.querySelector("#explorar").scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
    setTimeout(() => document.querySelector("#exhibitorSearch").focus(), 250);
  }
  if (event.key === "Escape") closeDrawer();
  if (event.key === "Tab" && drawer.classList.contains("open")) {
    const controls = [...drawer.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || !drawer.contains(document.activeElement))) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !drawer.contains(document.activeElement))) {
      event.preventDefault(); first?.focus();
    }
  }
});

const agendaData = {
  jue: {
    label: "jueves 8",
    items: [
      { time: "10:30", location: "Auditorio Central", title: "IA aplicada a la producción regional", meta: "Innovación · 45 min", id: "ag-ia", recommended: true },
      { time: "12:00", location: "Sala Norte", title: "El futuro de la energía en la región", meta: "Energía · 60 min", id: "ag-energia" },
      { time: "14:15", location: "Espacio Conecta", title: "Ronda de vinculación empresarial", meta: "Negocios · 90 min", id: "ag-ronda" }
    ]
  },
  vie: {
    label: "viernes 9",
    items: [
      { time: "09:30", location: "Auditorio Central", title: "Financiamiento para pymes exportadoras", meta: "Negocios · 45 min", id: "ag-vie-financiamiento", recommended: true },
      { time: "11:15", location: "Pabellón B", title: "Litio y minería sustentable: el mapa regional", meta: "Minería · 50 min", id: "ag-vie-mineria" },
      { time: "16:00", location: "Espacio Conecta", title: "Rueda de negocios internacional", meta: "Negocios · 120 min", id: "ag-vie-rueda" }
    ]
  },
  sab: {
    label: "sábado 10",
    items: [
      { time: "10:00", location: "Sala Norte", title: "Economía del conocimiento: empleos del futuro", meta: "Economía del Conocimiento · 45 min", id: "ag-sab-economia", recommended: true },
      { time: "13:00", location: "Zona Exterior", title: "Demostración de logística y transporte inteligente", meta: "Logística · 40 min", id: "ag-sab-logistica" },
      { time: "17:30", location: "Auditorio Central", title: "Cierre y entrega de reconocimientos ExpoJuy 2026", meta: "Institucional · 30 min", id: "ag-sab-cierre" }
    ]
  }
};

function renderAgendaDay(dayKey) {
  const day = agendaData[dayKey];
  if (!day) return;
  document.querySelector("#timeline").setAttribute("aria-label", `Actividades del ${day.label}`);
  day.items.forEach((activity, index) => {
    const article = document.querySelector(`#timelineItem${index}`);
    if (!article) return;
    article.classList.toggle("now", Boolean(activity.recommended));
    article.querySelector("time").textContent = activity.time;
    const locationP = article.querySelector(".activity-card p");
    locationP.replaceChildren();
    if (activity.recommended) {
      const pill = document.createElement("span");
      pill.className = "live-pill";
      pill.textContent = "RECOMENDADA";
      locationP.append(pill, " ");
    }
    const locationSpan = document.createElement("span");
    locationSpan.className = "timeline-location";
    locationSpan.textContent = activity.location;
    locationP.append(locationSpan);
    article.querySelector("h3").textContent = activity.title;
    article.querySelector(".timeline-meta").textContent = activity.meta;
    const button = article.querySelector(".save-button");
    button.dataset.saveId = activity.id;
    button.dataset.title = activity.title;
    button.dataset.meta = `${day.label} · ${activity.time} · ${activity.location}`;
    button.dataset.kind = "Actividad";
  });
  renderSaved();
}

document.querySelectorAll(".day").forEach((button) => {
  button.addEventListener("click", () => {
    transition(() => {
      document.querySelectorAll(".day").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      renderAgendaDay(button.dataset.day);
    });
    showToast(`Mostrando la agenda del ${agendaData[button.dataset.day].label}`);
  });
});

function selectStand(code) {
  const stand = standData[code];
  if (!stand) return;
  selectedStand = code;
  document.querySelectorAll(".stand-marker").forEach((button) => button.classList.toggle("active", button.dataset.stand === code));
  document.querySelector("#selectedStand").textContent = code;
  document.querySelector("#selectedCompany").textContent = stand.company;
  document.querySelector("#selectedDescription").textContent = stand.description;
  document.querySelector("#selectedSector").textContent = stand.sector;
  document.querySelector("#selectedDistance").textContent = stand.distance;
  updateSelectedStandButton();
}

document.querySelectorAll("[data-stand]").forEach((button) => {
  button.addEventListener("click", () => {
    selectStand(button.dataset.stand);
    if (button.closest("#mapList")) toggleMapView(false);
  });
});

document.querySelector("#saveSelectedStand").addEventListener("click", () => {
  const stand = standData[selectedStand];
  toggleSaved({ id: stand.id, title: stand.company, meta: `Stand ${selectedStand} · ${stand.sector}`, kind: "Expositor" });
});

document.querySelector("#generateRoute").addEventListener("click", () => {
  document.querySelector(".map-route").classList.add("active");
  const destinations = saved.filter((item) => item.kind === "Expositor").length || 1;
  const destinationLabel = destinations === 1 ? "destino" : "destinos";
  document.querySelector("#routeStatus").textContent = `Ruta ilustrativa · ${destinations} ${destinationLabel} · recorrido demostrativo`;
  showToast("Mostrando un recorrido demostrativo");
});

function toggleMapView(forceList) {
  const map = document.querySelector("#venueMap");
  const detail = document.querySelector(".map-detail");
  const list = document.querySelector("#mapList");
  const button = document.querySelector("#listMap");
  const showList = typeof forceList === "boolean" ? forceList : list.hidden;
  map.hidden = showList;
  detail.hidden = showList;
  list.hidden = !showList;
  button.setAttribute("aria-pressed", String(showList));
  button.textContent = showList ? "Ver mapa visual" : "Ver como lista";
}

document.querySelector("#listMap").addEventListener("click", () => toggleMapView());

const drawer = document.querySelector("#savedDrawer");
const drawerBackdrop = document.querySelector("#drawerBackdrop");
function openDrawer() {
  clearTimeout(drawerBackdropTimer);
  drawerReturnFocus = document.activeElement;
  drawerBackdrop.hidden = false;
  drawer.inert = false;
  drawer.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => drawer.classList.add("open"));
  document.body.style.overflow = "hidden";
  setTimeout(() => document.querySelector("#closeDrawer").focus(), 200);
}
function closeDrawer() {
  if (!drawer.classList.contains("open")) return;
  drawer.classList.remove("open");
  drawer.inert = true;
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  drawerBackdropTimer = setTimeout(() => { drawerBackdrop.hidden = true; }, 350);
  if (drawerReturnFocus instanceof HTMLElement) drawerReturnFocus.focus();
}
document.querySelector("#openDrawer").addEventListener("click", openDrawer);
document.querySelector("#openDrawerMobile").addEventListener("click", openDrawer);
document.querySelector("#closeDrawer").addEventListener("click", closeDrawer);
drawerBackdrop.addEventListener("click", closeDrawer);
document.querySelector("#drawerRoute").addEventListener("click", () => {
  closeDrawer();
  document.querySelector("#mapa").scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
  setTimeout(() => document.querySelector("#generateRoute").focus(), 450);
});

document.querySelector("#accessToggle").addEventListener("click", (event) => {
  const active = document.body.classList.toggle("high-contrast");
  event.currentTarget.setAttribute("aria-pressed", String(active));
  event.currentTarget.title = active ? "Desactivar alto contraste" : "Activar alto contraste";
  localStorage.setItem("expojuy-high-contrast", String(active));
  showToast(active ? "Alto contraste activado" : "Alto contraste desactivado");
});

const assistant = document.querySelector("#assistantDialog");
document.querySelector("#openAssistant").addEventListener("click", () => assistant.showModal());

function assistantAnswer(question) {
  const normalized = question.toLocaleLowerCase("es");
  if (normalized.includes("energ")) return "Andina Solar está en el stand B08. También podés sumar la actividad “El futuro de la energía en la región”, a las 12:00 en Sala Norte.";
  if (normalized.includes("10:30") || normalized.includes("ia ") || normalized.startsWith("ia")) return "A las 10:30 se realiza “IA aplicada a la producción regional” en el Auditorio Central. Podés agregarla desde la agenda.";
  if (normalized.includes("punatech") || normalized.includes("a12")) return "PunaTech está en el stand A12 del Pabellón A. Desde la ubicación demostrativa son aproximadamente 4 minutos.";
  if (normalized.includes("logíst") || normalized.includes("logist")) return "Norte Logística está en el stand D05 de la Zona Exterior y ofrece soluciones de transporte inteligente.";
  return "Encontré resultados relacionados en Expositores y Agenda. En una versión final, esta respuesta se generaría únicamente con información oficial verificada.";
}

function submitAssistant(question) {
  document.querySelector("#assistantResponse p").textContent = assistantAnswer(question);
}

document.querySelector("#assistantForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#assistantInput");
  submitAssistant(input.value);
  input.value = "";
});
document.querySelectorAll(".question-chips button").forEach((button) => {
  button.addEventListener("click", () => submitAssistant(button.textContent));
});

const textSizeSteps = [100, 112, 125];
let textSizeIndex = Number(localStorage.getItem("expojuy-text-size") || 0);
if (!Number.isInteger(textSizeIndex) || textSizeIndex < 0 || textSizeIndex >= textSizeSteps.length) textSizeIndex = 0;

function applyTextSize() {
  document.documentElement.style.setProperty("--text-scale", `${textSizeSteps[textSizeIndex]}%`);
  document.querySelector("#textSizeDown").disabled = textSizeIndex === 0;
  document.querySelector("#textSizeUp").disabled = textSizeIndex === textSizeSteps.length - 1;
  localStorage.setItem("expojuy-text-size", String(textSizeIndex));
}
document.querySelector("#textSizeUp").addEventListener("click", () => {
  if (textSizeIndex < textSizeSteps.length - 1) textSizeIndex += 1;
  applyTextSize();
  showToast(`Tamaño de texto: ${textSizeSteps[textSizeIndex]}%`);
});
document.querySelector("#textSizeDown").addEventListener("click", () => {
  if (textSizeIndex > 0) textSizeIndex -= 1;
  applyTextSize();
  showToast(`Tamaño de texto: ${textSizeSteps[textSizeIndex]}%`);
});
applyTextSize();

const highContrastEnabled = localStorage.getItem("expojuy-high-contrast") === "true";
document.body.classList.toggle("high-contrast", highContrastEnabled);
document.querySelector("#accessToggle").setAttribute("aria-pressed", String(highContrastEnabled));
document.querySelector("#accessToggle").title = highContrastEnabled ? "Desactivar alto contraste" : "Activar alto contraste";

renderAgendaDay("jue");
filterExhibitors();
selectStand(selectedStand);
