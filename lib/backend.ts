// Server-side only — import from route handlers, never from client components.
// Bridge to the Express backend (lumen-backend). Route handlers call
// this instead of the browser hitting the backend directly, so the backend URL
// stays out of the client bundle and CORS never comes into play.

export const BACKEND_URL = (
  process.env.LUMEN_API_URL ?? "http://localhost:5001"
).replace(/\/+$/, "");

/** Headers the backend uses for rate limiting, fraud signals and audit. */
function forwardedHeaders(req: Request): Record<string, string> {
  const h: Record<string, string> = {};
  const xff = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  if (xff || realIp) h["x-forwarded-for"] = xff ?? realIp!;
  const ua = req.headers.get("user-agent");
  if (ua) h["user-agent"] = ua;
  const referer = req.headers.get("referer");
  if (referer) h["referer"] = referer;
  return h;
}

export type BackendResult = {
  ok: boolean;
  status: number;
  json: Record<string, unknown>;
};

export async function backendFetch(
  path: string,
  req: Request,
  init: { method?: string; body?: unknown } = {},
): Promise<BackendResult> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: init.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(init.body !== undefined && { "Content-Type": "application/json" }),
      ...forwardedHeaders(req),
    },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: res.ok, status: res.status, json };
}
