import { getSupabase } from "./supabaseClient.js";

/* ============================================================
   NAVEGACIÓN PRINCIPAL — Etiquetas
   ============================================================ */
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function activateTab(name) {
  tabs.forEach(t => t.setAttribute("aria-current", String(t.dataset.tab === name)));
  panels.forEach(p => p.classList.toggle("is-active", p.dataset.panel === name));
  history.replaceState(null, "", `#${name}`);
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
});

const initial = location.hash.replace("#", "");
activateTab([...tabs].some(t => t.dataset.tab === initial) ? initial : "proyecto");

/* ============================================================
   SUBTABS — Trabajos de estudiantes
   ============================================================ */
const subtabs = document.querySelectorAll(".subtab");
const subpanels = document.querySelectorAll(".sub-panel");

subtabs.forEach(st => {
  st.addEventListener("click", () => {
    subtabs.forEach(s => s.classList.toggle("is-active", s === st));
    subpanels.forEach(sp => sp.classList.toggle("is-active", sp.dataset.subpanel === st.dataset.sub));
  });
});

/* ============================================================
   DATOS DE RESPALDO (mientras se completa Supabase)
   ============================================================ */
const FALLBACK_VOCES = [
  { nombre: "María Luisa Bemberg", zona: "CABA", tematica: "Dirección de cine", nota: "Pionera del cine de autor en Argentina, referente ineludible del Capítulo I." },
  { nombre: "Lita Stantic", zona: "CABA", tematica: "Producción", nota: "Productora clave de la nueva narrativa audiovisual argentina." },
  { nombre: "Referente a completar", zona: "Córdoba", tematica: "Guión", nota: "Ficha en elaboración por el equipo de investigación." },
  { nombre: "Referente a completar", zona: "Rosario", tematica: "Montaje", nota: "Ficha en elaboración por el equipo de investigación." },
  { nombre: "Referente a completar", zona: "Patagonia", tematica: "Documental", nota: "Ficha en elaboración por el equipo de investigación." },
  { nombre: "Referente a completar", zona: "NOA", tematica: "Radio y podcast", nota: "Ficha en elaboración por el equipo de investigación." },
];

const FALLBACK_EVENTOS = [
  { fecha: "18 mar 2026", titulo: "Conversatorio: mujeres detrás de cámara", institucion: "A completar", modalidad: "Presencial", tipo: "taller", asistentes: "—" },
  { fecha: "22 jun 2026", titulo: "Ponencia en jornadas de comunicación y género", institucion: "A completar", modalidad: "Virtual", tipo: "academico", asistentes: "—" },
  { fecha: "abr 2027", titulo: "Presentación pública del archivo transmedia", institucion: "A completar", modalidad: "A confirmar", tipo: "proximo", asistentes: "—" },
];

const FALLBACK_TRABAJOS = {
  ensayos: [
    { titulo: "Brecha de género en los equipos técnicos de rodaje", autoras: "A completar", url: "#" },
    { titulo: "Genealogía de directoras argentinas 1960–2000", autoras: "A completar", url: "#" },
  ],
  audiovisual: [
    { titulo: "Microdocumental: voces detrás de escena", autoras: "A completar", url: "#" },
  ],
  semblanzas: [
    { titulo: "Semblanza en elaboración", autoras: "A completar", url: "#" },
  ],
};

/* ============================================================
   ETIQUETA 2 — INVENTARIO DE VOCES
   ============================================================ */
const invGrid = document.getElementById("inv-grid");
const invSearch = document.getElementById("inv-search");
const invFilter = document.getElementById("inv-filter");
const invStatus = document.getElementById("inv-status");

let voces = [];

function renderVoces(list) {
  invGrid.innerHTML = "";
  if (!list.length) {
    invGrid.innerHTML = `<p class="muted">No hay resultados para esta búsqueda todavía.</p>`;
    return;
  }
  const frag = document.createDocumentFragment();
  list.forEach(v => {
    const card = document.createElement("article");
    card.className = "voz-card";
    card.innerHTML = `
      <h4>${v.nombre}</h4>
      <div class="voz-meta">${v.zona} · ${v.tematica}</div>
      <p>${v.nota ?? ""}</p>
    `;
    frag.appendChild(card);
  });
  invGrid.appendChild(frag);
}

function populateFilter(list) {
  const temas = [...new Set(list.map(v => v.tematica))].sort();
  invFilter.innerHTML = `<option value="">Todas las temáticas</option>` +
    temas.map(t => `<option value="${t}">${t}</option>`).join("");
}

function applyInvFilters() {
  const q = invSearch.value.trim().toLowerCase();
  const tema = invFilter.value;
  const filtered = voces.filter(v => {
    const matchesQ = !q || `${v.nombre} ${v.zona} ${v.tematica}`.toLowerCase().includes(q);
    const matchesTema = !tema || v.tematica === tema;
    return matchesQ && matchesTema;
  });
  renderVoces(filtered);
}

invSearch?.addEventListener("input", applyInvFilters);
invFilter?.addEventListener("change", applyInvFilters);

async function loadVoces() {
  const supabase = await getSupabase();

  if (!supabase) {
    voces = FALLBACK_VOCES;
    invStatus.textContent = "Mostrando datos de referencia — conectá Supabase en js/supabaseClient.js para ver el inventario real.";
    populateFilter(voces);
    renderVoces(voces);
    return;
  }

  const { data, error } = await supabase
    .from("voces")
    .select("nombre, zona, tematica, nota")
    .order("nombre", { ascending: true });

  if (error || !data || !data.length) {
    voces = FALLBACK_VOCES;
    invStatus.textContent = "No se pudo leer la tabla 'voces' en Supabase — mostrando datos de referencia.";
  } else {
    voces = data;
    invStatus.textContent = `${data.length} referentes cargadas desde Supabase.`;
  }
  populateFilter(voces);
  renderVoces(voces);
}

loadVoces();

/* ============================================================
   ETIQUETA 4 — PRESENTACIONES Y ACTIVIDADES
   ============================================================ */
const evList = document.getElementById("ev-list");
const evFilters = document.querySelectorAll(".ev-filter");
let eventos = [];

function renderEventos(list) {
  evList.innerHTML = "";
  if (!list.length) {
    evList.innerHTML = `<p class="muted">Todavía no hay eventos cargados en esta categoría.</p>`;
    return;
  }
  const frag = document.createDocumentFragment();
  list.forEach(ev => {
    const item = document.createElement("div");
    item.className = "ev-item";
    const tagLabel = ev.tipo === "proximo" ? "Próximo" : ev.tipo === "academico" ? "Académico" : "Taller";
    item.innerHTML = `
      <div class="ev-item__date">${ev.fecha}</div>
      <div>
        <div class="ev-item__title">${ev.titulo}</div>
        <div class="ev-item__meta">${ev.institucion} · ${ev.modalidad} · ${ev.asistentes} asistentes</div>
      </div>
      <span class="ev-item__tag ${ev.tipo === "proximo" ? "proximo" : ""}">${tagLabel}</span>
    `;
    frag.appendChild(item);
  });
  evList.appendChild(frag);
}

evFilters.forEach(btn => {
  btn.addEventListener("click", () => {
    evFilters.forEach(b => b.classList.toggle("is-active", b === btn));
    const f = btn.dataset.filter;
    renderEventos(f === "todos" ? eventos : eventos.filter(e => e.tipo === f));
  });
});

async function loadEventos() {
  const supabase = await getSupabase();

  if (!supabase) {
    eventos = FALLBACK_EVENTOS;
    renderEventos(eventos);
    return;
  }

  const { data, error } = await supabase
    .from("eventos")
    .select("fecha, titulo, institucion, modalidad, tipo, asistentes")
    .order("fecha", { ascending: true });

  eventos = (!error && data && data.length) ? data : FALLBACK_EVENTOS;
  renderEventos(eventos);
}

loadEventos();

/* ============================================================
   ETIQUETA 5 — TRABAJOS DE ESTUDIANTES
   ============================================================ */
function renderTrabajos(containerId, list) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = list.map(t => `
    <li>
      <a href="${t.url}" target="_blank" rel="noopener">${t.titulo}</a>
      <span class="work-status">${t.autoras}</span>
    </li>
  `).join("");
}

async function loadTrabajos() {
  const supabase = await getSupabase();

  if (!supabase) {
    renderTrabajos("work-ensayos", FALLBACK_TRABAJOS.ensayos);
    renderTrabajos("work-audiovisual", FALLBACK_TRABAJOS.audiovisual);
    renderTrabajos("work-semblanzas", FALLBACK_TRABAJOS.semblanzas);
    return;
  }

  const { data, error } = await supabase
    .from("trabajos")
    .select("titulo, autoras, url, categoria, orden")
    .order("orden", { ascending: true });

  if (error || !data || !data.length) {
    renderTrabajos("work-ensayos", FALLBACK_TRABAJOS.ensayos);
    renderTrabajos("work-audiovisual", FALLBACK_TRABAJOS.audiovisual);
    renderTrabajos("work-semblanzas", FALLBACK_TRABAJOS.semblanzas);
    return;
  }

  ["ensayos", "audiovisual", "semblanzas"].forEach(cat => {
    renderTrabajos(`work-${cat}`, data.filter(t => t.categoria === cat));
  });
}

loadTrabajos();
