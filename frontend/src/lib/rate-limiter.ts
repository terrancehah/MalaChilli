/**
 * Client-side rate limiter utility.
 * Tracks attempts per action and provides cooldown functionality.
 * This is a UX enhancement - actual security rate limiting is handled server-side by Supabase.
 */

interface RateLimitEntry {
  attempts: number;
  firstAttemptTime: number;
  lockedUntil: number | null;
}

// Store rate limit data in memory (resets on page refresh)
const rateLimitStore: Map<string, RateLimitEntry> = new Map();

// Configuration for different actions
const RATE_LIMIT_CONFIG = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    lockoutMs: 5 * 60 * 1000, // 5 minute lockout after max attempts
  },
  signup: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    lockoutMs: 15 * 60 * 1000, // 15 minute lockout
  },
  forgotPassword: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    lockoutMs: 30 * 60 * 1000, // 30 minute lockout
  },
} as const;

type RateLimitAction = keyof typeof RATE_LIMIT_CONFIG;

/**
 * Check if an action is rate limited.
 * Returns null if allowed, or an error message with remaining time if blocked.
 */
export function checkRateLimit(action: RateLimitAction): string | null {
  const config = RATE_LIMIT_CONFIG[action];
  const key = `${action}`;
  const now = Date.now();

  let entry = rateLimitStore.get(key);

  // No previous attempts
  if (!entry) {
    return null;
  }

  // Check if currently locked out
  if (entry.lockedUntil && now < entry.lockedUntil) {
    const remainingMs = entry.lockedUntil - now;
    const remainingMinutes = Math.ceil(remainingMs / 60000);
    return `Too many attempts. Please try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.`;
  }

  // Check if window has expired (reset attempts)
  if (now - entry.firstAttemptTime > config.windowMs) {
    rateLimitStore.delete(key);
    return null;
  }

  // Check if max attempts reached
  if (entry.attempts >= config.maxAttempts) {
    // Set lockout
    entry.lockedUntil = now + config.lockoutMs;
    const remainingMinutes = Math.ceil(config.lockoutMs / 60000);
    return `Too many attempts. Please try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.`;
  }

  return null;
}

/**
 * Record an attempt for rate limiting.
 * Call this after each failed attempt.
 */
export function recordAttempt(action: RateLimitAction): void {
  const key = `${action}`;
  const now = Date.now();

  let entry = rateLimitStore.get(key);

  if (!entry) {
    entry = {
      attempts: 1,
      firstAttemptTime: now,
      lockedUntil: null,
    };
  } else {
    // Check if window has expired
    const config = RATE_LIMIT_CONFIG[action];
    if (now - entry.firstAttemptTime > config.windowMs) {
      // Reset
      entry = {
        attempts: 1,
        firstAttemptTime: now,
        lockedUntil: null,
      };
    } else {
      entry.attempts++;
    }
  }

  rateLimitStore.set(key, entry);
}

/**
 * Clear rate limit for an action (call on successful attempt).
 */
export function clearRateLimit(action: RateLimitAction): void {
  rateLimitStore.delete(`${action}`);
}

/**
 * Get remaining attempts before lockout.
 */
export function getRemainingAttempts(action: RateLimitAction): number {
  const config = RATE_LIMIT_CONFIG[action];
  const key = `${action}`;
  const entry = rateLimitStore.get(key);

  if (!entry) {
    return config.maxAttempts;
  }

  const now = Date.now();
  if (now - entry.firstAttemptTime > config.windowMs) {
    return config.maxAttempts;
  }

  return Math.max(0, config.maxAttempts - entry.attempts);
}
