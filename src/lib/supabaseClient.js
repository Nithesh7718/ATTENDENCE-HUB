import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || "";
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || "";
const envSiteUrl = import.meta.env.VITE_SITE_URL?.trim() || "";
const browserOrigin = typeof window !== "undefined" ? window.location.origin : "";
export const siteUrl = browserOrigin || envSiteUrl;

const missingConfigMessage =
  "Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.";

// Throw eagerly when the config is missing so the app fails fast with a clear
// message instead of silently making broken requests to an empty endpoint.
const assertSupabaseConfig = () => {
  if (!isSupabaseConfigured()) {
    throw new Error(missingConfigMessage);
  }
};

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);

export const supabaseConfigErrorMessage = missingConfigMessage;

export const supabase = createClient(
  supabaseUrl || "https://placeholder.invalid",
  supabaseAnonKey || "placeholder-invalid-key",
  {
    auth: {
      persistSession: isSupabaseConfigured(),
      autoRefreshToken: isSupabaseConfigured(),
      detectSessionInUrl: isSupabaseConfigured()
    }
  }
);

export const createEphemeralSupabaseClient = () => {
  assertSupabaseConfig();
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
};
