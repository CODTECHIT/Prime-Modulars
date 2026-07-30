import { createServerFn } from "@tanstack/react-start";
import { signToken, verifyToken, validateCredentials } from "../admin-auth";
import { checkRateLimit, sanitizeString, validateEmail } from "../security";

export const adminLogin = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { email, password } = data;

    const sanitizedEmail = sanitizeString(email);
    const sanitizedPassword = sanitizeString(password);

    const rateCheck = checkRateLimit(`login:${sanitizedEmail}`, {
      windowMs: 60 * 1000,
      maxRequests: 5,
    });
    if (!rateCheck.allowed) {
      return { success: false as const, error: "Too many attempts. Try again later." };
    }

    if (!validateCredentials(sanitizedEmail, sanitizedPassword)) {
      return { success: false as const, error: "Invalid email or password" };
    }

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
