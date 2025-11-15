/**
 * Centralized environment configuration.
 * Reads and validates all required environment variables once at startup.
 * Prevents ad-hoc import.meta.env usage scattered across the codebase.
 */

interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
}

/**
 * Validates that a required environment variable is present.
 * Throws an error with a descriptive message if missing.
 */
function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Please check your .env file.`
    );
  }
  return value;
}

/**
 * Application environment configuration.
 * All environment variables are validated at module load time.
 */
export const env: EnvironmentConfig = {
  supabase: {
    url: requireEnv('VITE_SUPABASE_URL'),
    anonKey: requireEnv('VITE_SUPABASE_ANON_KEY'),
  },
};
