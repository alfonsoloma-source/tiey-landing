const allowedOrigins = new Set(["https://tiey.cc", "https://www.tiey.cc"]);
const clean = (value, max) => typeof value === "string" ? value.trim().slice(0, max) : "";

export default async function handler(req, res) {
  const start = Date.now();
  const requestId = req.headers["x-vercel-id"] || "local";
  console.log(JSON.stringify({ level: "info", msg: "contact_start", route: "/api/contact", requestId }));
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ success: false });
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.has(origin) && !origin.endsWith(".vercel.app")) return res.status(403).json({ success: false });

  const body = req.body || {};
  if (clean(body.website, 200)) return res.status(200).json({ success: true });
  const elapsed = Date.now() - Number(body.started_at || 0);
  if (!Number.isFinite(elapsed) || elapsed < 2500 || elapsed > 86400000) return res.status(400).json({ success: false });

  const data = {
    nombre: clean(body.nombre, 100), email: clean(body.email, 160), empresa: clean(body.empresa, 120),
    telefono: clean(body.telefono, 30), puesto: clean(body.puesto, 140), mensaje: clean(body.mensaje, 2000)
  };
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  if (!data.nombre || !emailOk || !data.empresa || !data.puesto || !data.mensaje || body.privacy_consent !== "accepted") return res.status(400).json({ success: false });
  if (!process.env.WEB3FORMS_ACCESS_KEY) {
    console.error(JSON.stringify({ level: "error", msg: "contact_missing_key", route: "/api/contact", requestId }));
    return res.status(500).json({ success: false });
  }
  try {
    const response = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ access_key: process.env.WEB3FORMS_ACCESS_KEY, subject: `Nueva búsqueda desde tiey.cc — ${data.empresa.replace(/[\r\n]/g, " ")}`, from_name: "Tiey — Formulario web", ...data }) });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error("provider_error");
    console.log(JSON.stringify({ level: "info", msg: "contact_done", route: "/api/contact", requestId, ms: Date.now() - start }));
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(JSON.stringify({ level: "error", msg: "contact_failed", route: "/api/contact", requestId, error: error.message, ms: Date.now() - start }));
    return res.status(502).json({ success: false });
  }
}
