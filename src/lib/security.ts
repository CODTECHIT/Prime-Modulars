/**
 * Security utilities for server-side request protection.
 * Rate limiting, brute-force lockout, input sanitization, validation, and
 * security headers. This module must stay isomorphic-safe (no node-only
 * imports) because it is bundled into both client and server builds.
 */

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60 * 1000,
  maxRequests: 60,
};

export function checkRateLimit(
  key: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1 };
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: config.maxRequests - entry.count };
}

// ─── Login brute-force lockout ──────────────────────────────────────────────

export interface LockoutConfig {
  maxAttempts: number;
  lockoutMs: number;
}

const DEFAULT_LOCKOUT: LockoutConfig = {
  maxAttempts: 5,
  lockoutMs: 15 * 60 * 1000,
};

const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

export function isLoginLocked(key: string): boolean {
  const entry = loginAttempts.get(key);
  if (!entry) return false;
  if (Date.now() > entry.lockedUntil) {
    loginAttempts.delete(key);
    return false;
  }
  return entry.lockedUntil > Date.now();
}

export function lockoutMsRemaining(key: string): number {
  const entry = loginAttempts.get(key);
  if (!entry) return 0;
  const remaining = entry.lockedUntil - Date.now();
  return remaining > 0 ? remaining : 0;
}

/**
 * Records a failed login attempt. Returns true when the account (or IP)
 * becomes locked out as a result of this attempt.
 */
export function recordFailedLogin(key: string, config: LockoutConfig = DEFAULT_LOCKOUT): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(key);

  if (!entry || now > entry.lockedUntil) {
    const fresh = { count: 1, lockedUntil: 0 };
    if (fresh.count >= config.maxAttempts) {
      fresh.lockedUntil = now + config.lockoutMs;
    }
    loginAttempts.set(key, fresh);
    return fresh.lockedUntil > 0;
  }

  const count = entry.count + 1;
  if (count >= config.maxAttempts) {
    entry.count = count;
    entry.lockedUntil = now + config.lockoutMs;
    return true;
  }
  entry.count = count;
  return false;
}

export function resetLoginAttempts(key: string): void {
  loginAttempts.delete(key);
}

// ─── Input sanitization & validation ────────────────────────────────────────

export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  allowedFields: string[],
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in obj) {
      const value = obj[key];
      if (typeof value === "string") {
        sanitized[key] = sanitizeString(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  return sanitized;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidObjectId(id: unknown): id is string {
  return typeof id === "string" && /^[a-f\d]{24}$/i.test(id);
}

/**
 * Returns the decoded byte length of a base64 string. Base64 strings are also
 * accepted with a data URL prefix ("data:...;base64,"); the prefix is ignored.
 */
export function base64ByteLength(input: string): number {
  const body = input.includes(",") ? input.slice(input.indexOf(",") + 1) : input;
  const padding = body.endsWith("==") ? 2 : body.endsWith("=") ? 1 : 0;
  return Math.floor((body.length * 3) / 4) - padding;
}

// ─── Security headers ───────────────────────────────────────────────────────

export function generateCspPolicy(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: res.cloudinary.com",
    "connect-src 'self' https://api.cloudinary.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

export function securityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    "Content-Security-Policy": generateCspPolicy(),
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  };
}
