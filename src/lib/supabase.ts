import { createClient } from "@supabase/supabase-js";
import type { Database } from "../@types/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não encontradas no arquivo .env.",
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || "",
  supabaseAnonKey || "",
);
