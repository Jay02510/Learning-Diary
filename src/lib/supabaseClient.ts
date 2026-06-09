/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Defensive logging if required environment variables are missing
if (!supabaseUrl) {
  console.warn(
    "[Supabase Client Warning]: VITE_SUPABASE_URL is undefined. Please ensure it is set in your environment variables."
  );
}

if (!supabaseAnonKey) {
  console.warn(
    "[Supabase Client Warning]: VITE_SUPABASE_ANON_KEY is undefined. Please ensure it is set in your environment variables."
  );
}

// Instantiate the Client with fallback to prevent immediate app crash if keys are missing
export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-key"
);
