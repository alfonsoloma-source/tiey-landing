const allowedOrigins = new Set(["https://tiey.cc", "https://www.tiey.cc"]);
const clean = (value, max) => typeof value === "string" ? value.trim().slice(0, max) : "";
const MAX_BODY_BYTES = 12 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateBuckets = globalThis.__tieyContactRateBuckets || new Map();
globalThis.__tieyContactRateBuckets = rateBuckets;

const json = (res, status, body, extraHeaders = {}) => {
  Object.entries(extraHeaders).forEach(([key, value]) => res.setHeader(key, value));
  return res.status(status).json(body);
};

const clientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim().slice(0, 64);
  if (Array.isArray(forwarded)) return String(forwarded[0] || "unknown").slice(0, 64);
  return String(req.socket?.remoteAddress || "unknown").slice(0, 64);
};

const isRateLimited = (key, now) => {
  if (rateBuckets.size > 1000) {
    for (const [ip, bucket] of rateBuckets) {
      if (now - bucket.startedAt >= RATE_LIMIT_WINDOW_MS) rateBuckets.delete(ip);
    }
  }

  const bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.startedAt >= RATE_LIMIT_WINDOW_MS) {
    rateBuckets.set(key, { startedAt: now, count: 1 });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
};

export default async function handler(req, res) {
  const start = Date.now();
  const requestId = req.headers["x-vercel-id"] || "local";
  const reject = (status, reason, extraHeaders = {}) => {
    console.warn(JSON.stringify({ level: "warn", msg: "contact_rejected", route: "/api/contact", requestId, reason }));
    return json(res, status, { success: false }, extraHeaders);
  };

  console.log(JSON.stringify({ level: "info", msg: "contact_start", route: "/api/contact", requestId }));

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reject(405, "method_not_allowed");
  }

  const origin = req.headers.origin;
  if (!origin || !allowedOrigins.has(origin)) return reject(403, "origin_not_allowed");

  const contentType = String(req.headers["content-type"] || "").toLowerCase();
  if (!contentType.startsWith("application/json")) return reject(415, "invalid_content_type");

  const contentLength = Number(req.headers["content-length"] || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return reject(413, "payload_too_large");

  const ip = clientIp(req);
  if (isRateLimited(ip, start)) {
    console.warn(JSON.stringify({ level: "warn", msg: "contact_rate_limited", route: "/api/contact", requestId }));
    return json(res, 429, { success: false }, { "Retry-After": "600" });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  let serializedSize = 0;
  try {
    serializedSize = Buffer.byteLength(JSON.stringify(body), "utf8");
  } catch {
    return reject(400, "invalid_payload");
  }
  if (serializedSize > MAX_BODY_BYTES) return reject(413, "payload_too_large");

  // Honeypot: bots commonly fill hidden fields. Return success so they do not retry.
  if (clean(body.website, 200)) {
    console.warn(JSON.stringify({ level: "warn", msg: "contact_honeypot", route: "/api/contact", requestId }));
    return json(res, 200, { success: true });
  }

  // Do not reject legitimate users based on client/server clock differences.
  // `started_at` remains optional telemetry only; honeypot + rate limiting provide the anti-abuse gate.
  const startedAt = Number(body.started_at || 0);
  if (Number.isFinite(startedAt) && startedAt > 0) {
    const elapsed = start - startedAt;
    if (elapsed < 0 || elapsed > 86400000) {
      console.warn(JSON.stringify({ level: "warn", msg: "contact_clock_skew", route: "/api/contact", requestId }));
    }
  }

  const data = {
    nombre: clean(body.nombre, 100),
    email: clean(body.email, 160),
    empresa: clean(body.empresa, 120),
    telefono: clean(body.telefono, 30),
    puesto: clean(body.puesto, 140),
    mensaje: clean(body.mensaje, 2000),
  };

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const phoneOk = !data.telefono || /^[0-9+()\-\.\s]{7,30}$/.test(data.telefono);

  if (!data.nombre) return reject(400, "missing_name");
  if (!emailOk) return reject(400, "invalid_email");
  if (!data.empresa) return reject(400, "missing_company");
  if (!phoneOk) return reject(400, "invalid_phone");
  if (!data.puesto) return reject(400, "missing_role");
  if (!data.mensaje) return reject(400, "missing_message");
  if (body.privacy_consent !== "accepted") return reject(400, "privacy_not_accepted");

  if (!process.env.WEB3FORMS_ACCESS_KEY) {
    console.error(JSON.stringify({ level: "error", msg: "contact_missing_key", route: "/api/contact", requestId }));
    return json(res, 500, { success: false });
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        subject: `Nueva búsqueda desde tiey.cc — ${data.empresa.replace(/[\r\n]/g, " ")}`,
        from_name: "Tiey — Formulario web",
        ...data,
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) throw new Error("provider_error");

    console.log(JSON.stringify({ level: "info", msg: "contact_done", route: "/api/contact", requestId, ms: Date.now() - start }));
    return json(res, 200, { success: true });
  } catch (error) {
    console.error(JSON.stringify({ level: "error", msg: "contact_failed", route: "/api/contact", requestId, error: error.message, ms: Date.now() - start }));
    return json(res, 502, { success: false });
  }
}
