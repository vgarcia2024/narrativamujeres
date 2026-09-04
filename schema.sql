-- ============================================================
-- Esquema Supabase — Mujeres en la Comunicación Audiovisual
-- Pegar este archivo en Supabase > SQL Editor > New query > Run
-- ============================================================

-- 1) Inventario de voces (Etiqueta 2)
create table if not exists voces (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  zona        text,          -- ej: "CABA", "Córdoba", "Patagonia"
  tematica    text,          -- ej: "Dirección de cine", "Guión"
  nota        text,          -- breve semblanza / testimonio
  created_at  timestamptz default now()
);

-- 2) Presentaciones y actividades (Etiqueta 4)
create table if not exists eventos (
  id            uuid primary key default gen_random_uuid(),
  fecha         text not null,          -- texto libre: "18 mar 2026" o "abr 2027"
  titulo        text not null,
  institucion   text,
  modalidad     text,                   -- "Presencial" | "Virtual" | "A confirmar"
  tipo          text not null,          -- "taller" | "academico" | "proximo"
  integrantes   text,
  asistentes    text,
  flyer_url     text,
  registro_url  text,
  created_at    timestamptz default now()
);

-- 3) Trabajos de estudiantes (Etiqueta 5)
create table if not exists trabajos (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  autoras     text,
  categoria   text not null,   -- "ensayos" | "audiovisual" | "semblanzas"
  url         text,
  orden       int default 0,   -- orden de destacado, menor = primero
  created_at  timestamptz default now()
);

-- ============================================================
-- Row Level Security: lectura pública, escritura solo autenticada
-- ============================================================
alter table voces    enable row level security;
alter table eventos  enable row level security;
alter table trabajos enable row level security;

create policy "Lectura publica de voces"    on voces    for select using (true);
create policy "Lectura publica de eventos"  on eventos  for select using (true);
create policy "Lectura publica de trabajos" on trabajos for select using (true);

-- Para permitir carga desde el equipo editor, crear usuarios en
-- Supabase Auth y habilitar policies de insert/update para
-- authenticated, por ejemplo:
--
-- create policy "Insert autenticado en voces" on voces
--   for insert to authenticated with check (true);
