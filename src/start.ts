import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";
import { setResponseHeader, getRequestUrl } from "@tanstack/react-start/server";

import { renderErrorPage } from "./lib/error-page";
import { securityHeaders } from "./lib/security";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Applies security headers to every response and disables caching for the
// admin panel so authenticated pages and API responses are never stored by
// browsers, proxies, or CDNs.
const securityMiddleware = createMiddleware().server(async ({ next }) => {
  const response = await next();
  if (!(response instanceof Response)) return response;

  const headers: Record<string, string> = {};
  for (const [name, value] of Object.entries(securityHeaders())) {
    if (!response.headers.has(name)) {
      headers[name] = value;
    }
  }

  let pathname = "";
  try {
    pathname = getRequestUrl().pathname;
  } catch {
    // Request URL is not always available (e.g. outside a request context).
  }

  if (pathname.startsWith("/modular/admin")) {
    headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0";
    headers["Pragma"] = "no-cache";
    headers["Expires"] = "0";
  }

  if (Object.keys(headers).length > 0) {
    for (const [name, value] of Object.entries(headers)) {
      setResponseHeader(name, value);
    }
  }
  return response;
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, securityMiddleware, csrfMiddleware],
}));
