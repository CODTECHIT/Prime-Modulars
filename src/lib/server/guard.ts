import { getRequestIP } from "@tanstack/react-start/server";
import { verifyToken } from "../admin-auth";

/**
 * Server-only auth guard for protected server functions. Throws a
 * normalized error so every protected endpoint behaves identically.
 */
export function requireAdmin(token: string | undefined): void {
  if (!token || !verifyToken(token)) {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
  }
}

/**
 * Best-effort client IP extraction. Falls back to "unknown" so rate limiting
 * still has a stable key when the request IP cannot be determined.
 */
export function getClientIp(): string {
  try {
    return getRequestIP({ xForwardedFor: true }) ?? "unknown";
  } catch {
    return "unknown";
  }
}
