import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const memoryStore = new Map<string, string>();
const memoryStorage = {
  getItem: (key: string) => memoryStore.get(key) ?? null,
  setItem: (key: string, value: string) => {
    memoryStore.set(key, value);
  },
  removeItem: (key: string) => {
    memoryStore.delete(key);
  },
};

let storage: typeof memoryStorage = memoryStorage;
try {
  const AS = require("@react-native-async-storage/async-storage").default;
  if (AS) storage = AS;
} catch {
  // AsyncStorage native module unavailable — use in-memory fallback
}

export const supabase = createClient<Database>(url, anon, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
