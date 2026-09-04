// ============================================================
// Cliente de Supabase
// ------------------------------------------------------------
// 1) Creá un proyecto en https://supabase.com
// 2) Copiá tu Project URL y anon public key (Settings > API)
// 3) Pegalos abajo. En Vercel, mejor todavía: definilos como
//    variables de entorno y generá este archivo en el build,
//    o simplemente reemplazá los valores antes de deployear.
//    (La anon key es pública por diseño: la seguridad real la
//    da Row Level Security en las tablas de Supabase, ver
//    /supabase/schema.sql)
// ============================================================

export const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
export const SUPABASE_ANON_KEY = "TU-ANON-KEY-PUBLICA";

let client = null;

export async function getSupabase() {
  if (client) return client;
  const isConfigured =
    SUPABASE_URL.startsWith("https://") &&
    !SUPABASE_URL.includes("TU-PROYECTO") &&
    SUPABASE_ANON_KEY !== "TU-ANON-KEY-PUBLICA";

  if (!isConfigured) return null;

  try {
    const { createClient } = await import(
      "https://esm.sh/@supabase/supabase-js@2"
    );
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return client;
  } catch (err) {
    console.warn("No se pudo cargar el cliente de Supabase:", err);
    return null;
  }
}
