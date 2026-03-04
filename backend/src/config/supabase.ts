import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error("⚠️  Supabase URL or key is missing. Check your .env file.");
}

// Supabase client with fetch timeout to prevent hanging requests
export const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
        fetch: (url: RequestInfo | URL, init?: RequestInit) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
            return fetch(url, {
                ...init,
                signal: controller.signal,
            }).finally(() => clearTimeout(timeoutId));
        },
    },
});

// Alias for backward compatibility
export const supabaseAdmin = supabase;
