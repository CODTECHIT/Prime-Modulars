import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const TOKEN_ISSUER = "prime-modulars-admin";
const TOKEN_AUDIENCE = "prime-modulars-admin";

export interface AdminPayload {
  email: string;
  role: "admin";
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set to a strong random value of at least 32 characters.");
  }
  return secret;
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "12h",
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE,
  });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret(), {
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    }) as AdminPayload;
    if (decoded.role !== "admin" || !decoded.email) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

let cachedPasswordHash: string | null = null;

function getPasswordHash(): string {
  if (cachedPasswordHash) return cachedPasswordHash;

  const envHash = process.env.ADMIN_PASSWORD_HASH;
  if (envHash && envHash.startsWith("$2")) {
    cachedPasswordHash = envHash;
    return envHash;
  }

  const plain = process.env.ADMIN_PASSWORD;
  if (!plain) {
    throw new Error(
      "ADMIN_PASSWORD_HASH or ADMIN_PASSWORD must be configured for the admin panel.",
    );
  }
  // Derive a bcrypt hash from the env value so credential comparison is always
  // constant-time and plaintext passwords are never compared directly.
  cachedPasswordHash = bcrypt.hashSync(plain, 12);
  return cachedPasswordHash;
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function validateCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !safeEqual(email, adminEmail)) {
    return false;
  }
  try {
    return bcrypt.compareSync(password, getPasswordHash());
  } catch {
    return false;
  }
}
