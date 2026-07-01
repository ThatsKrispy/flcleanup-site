/**
 * FL Cleanup — contact form email Worker (100% Cloudflare-native)
 *
 * Sends each inspection request as an email using Cloudflare's built-in
 * `send_email` binding — no third-party service, no API key. Delivery to a
 * verified Email Routing destination address is free on any plan.
 *
 * Bindings / vars (see wrangler.toml):
 *   SEB        send_email binding (locked to the destination address)
 *   LEAD_TO    verified destination inbox the lead email is delivered to
 *   LEAD_FROM  a custom @flcleanup.com address used as the From (default contact@)
 */
import { EmailMessage } from "cloudflare:email";

const cors = (origin) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Vary": "Origin",
});
const reply = (obj, status, origin) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors(origin) },
  });
// Strip CR/LF so form values can't inject extra email headers.
const oneLine = (s = "") => String(s).replace(/[\r\n]+/g, " ").trim();

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    if (request.method === "OPTIONS") return new Response(null, { headers: cors(origin) });
    if (request.method !== "POST") return reply({ ok: false, error: "Method not allowed" }, 405, origin);

    let data;
    try {
      data = Object.fromEntries((await request.formData()).entries());
    } catch {
      return reply({ ok: false, error: "Could not read the form." }, 400, origin);
    }

    // Honeypot — silently accept bots so they don't retry.
    if (data.company_website) return reply({ ok: true }, 200, origin);

    const name = oneLine(data.name);
    const phone = oneLine(data.phone);
    const email = oneLine(data.email);
    const zip = oneLine(data.zip);
    const message = String(data.message || "").trim();
    const services = [].concat(data.svc || []).filter(Boolean).join(", ");

    if (!name) return reply({ ok: false, error: "Please enter your name." }, 422, origin);
    if (phone.replace(/\D/g, "").length < 10)
      return reply({ ok: false, error: "Please enter a valid phone number." }, 422, origin);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return reply({ ok: false, error: "Please enter a valid email address." }, 422, origin);

    const from = env.LEAD_FROM || "contact@flcleanup.com";
    const to = env.LEAD_TO;
    if (!to) return reply({ ok: false, error: "Email not configured yet. Please call 877-224-2532." }, 500, origin);

    const body = [
      "New inspection request — flcleanup.com",
      "",
      `Name:     ${name}`,
      `Phone:    ${phone}`,
      `Email:    ${email || "—"}`,
      `Zip:      ${zip || "—"}`,
      `Services: ${services || "—"}`,
      "",
      "Message:",
      message || "—",
    ].join("\n");

    const raw = [
      `From: FL Cleanup Website <${from}>`,
      `To: ${to}`,
      email ? `Reply-To: ${name} <${email}>` : null,
      `Subject: New lead: ${name}${services ? " — " + services : ""}`,
      `Message-ID: <${crypto.randomUUID()}@flcleanup.com>`,
      `Date: ${new Date().toUTCString()}`,
      "MIME-Version: 1.0",
      'Content-Type: text/plain; charset="utf-8"',
      "",
      body,
    ].filter(Boolean).join("\r\n");

    try {
      await env.SEB.send(new EmailMessage(from, to, raw));
      return reply({ ok: true }, 200, origin);
    } catch (e) {
      return reply({ ok: false, error: "Could not send your request. Please call 877-224-2532.", detail: String(e) }, 502, origin);
    }
  },
};
