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

// Acá reemplazamos con tu URL y tu clave pública anónima:
export const SUPABASE_URL = "https://kndmbkrprizeawcwaayz.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZG1ia3Jwcml6ZWF3Y3dhYXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1Mzg3ODMsImV4cCI6MjEwNDExNDc4M30.1SNLGBihidmzZeFDg8q7GJUDihYUAyTLczTKiOTP2v0";

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
