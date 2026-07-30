import jwt from "jsonwebtoken";

const JWT_SECRET = () => process.env.JWT_SECRET!;

export interface AdminPayload {
  email: string;
  role: "admin";
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET(), { expiresIn: "24h" });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET()) as AdminPayload;
  } catch {
    return null;
  }
}

export function validateCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPassword = process.env.ADMIN_PASSWORD!;
  return email === adminEmail && password === adminPassword;
}
