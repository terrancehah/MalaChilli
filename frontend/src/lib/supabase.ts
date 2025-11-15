import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

/**
 * Supabase client instance.
 * Configuration is centralized in config/env.ts to ensure validation at startup.
 */
export const supabase = createClient(env.supabase.url, env.supabase.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
