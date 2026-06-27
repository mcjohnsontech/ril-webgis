import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly at boot rather than silently returning empty data later —
  // a missing env var here is the most common reason a fresh clone shows a blank map.
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your anon key."
  );
}

// Frontend uses the public anon key only — never the service role key.
// Row Level Security on the `potholes` table / `potholes_view` is what keeps
// this safe for read-only public exposure.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
