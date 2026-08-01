import { createServerFn } from "@tanstack/react-start";
import { signToken, verifyToken, validateCredentials } from "../admin-auth";
import {
  checkRateLimit,
  sanitizeString,
  validateEmail,
  isLoginLocked,
  lockoutMsRemaining,
  recordFailedLogin,
  resetLoginAttempts,
} from "../security";
import { getClientIp } from "./guard";

const LOGIN_WINDOW = 15 * 60 * 1000;
const EMAIL_MAX_ATTEMPTS = 5;
const IP_MAX_ATTEMPTS = 20;

function clientIp(): string {
  return sanitizeString(getClientIp()).slice(0, 64) || "unknown";
}

export const adminLogin = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { email, password } = data;

    const sanitizedEmail = sanitizeString(email).toLowerCase();
    const sanitizedPassword = sanitizeString(password);
    const ip = clientIp();

    if (!validateEmail(sanitizedEmail) || !sanitizedPassword) {
      return { success: false as const, error: "Invalid email or password" };
    }

    const emailLockKey = `lock:email:${sanitizedEmail}`;
    const ipLockKey = `lock:ip:${ip}`;

    if (isLoginLocked(emailLockKey) || isLoginLocked(ipLockKey)) {
      const remaining = Math.max(lockoutMsRemaining(emailLockKey), lockoutMsRemaining(ipLockKey));
      return {
        success: false as const,
        error: "Too many failed attempts. Try again later.",
        retryAfterMs: remaining,
      };
    }

    const emailRate = checkRateLimit(`login:email:${sanitizedEmail}`, {
      windowMs: LOGIN_WINDOW,
      maxRequests: EMAIL_MAX_ATTEMPTS,
    });
    const ipRate = checkRateLimit(`login:ip:${ip}`, {
      windowMs: LOGIN_WINDOW,
      maxRequests: IP_MAX_ATTEMPTS,
    });

    if (!emailRate.allowed || !ipRate.allowed) {
      return {
        success: false as const,
        error: "Too many login attempts. Try again later.",
      };
    }

    if (!validateCredentials(sanitizedEmail, sanitizedPassword)) {
      recordFailedLogin(emailLockKey);
      recordFailedLogin(ipLockKey);
      return { success: false as const, error: "Invalid email or password" };
    }

    resetLoginAttempts(emailLockKey);
    resetLoginAttempts(ipLockKey);

    const token = signToken({ email: sanitizedEmail, role: "admin" });

    return { success: true as const, token };
  });

export const checkAuth = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const payload = verifyToken(data.token);
    if (!payload) {
      return { authenticated: false as const };
    }
    return { authenticated: true as const, email: payload.email };
  });
