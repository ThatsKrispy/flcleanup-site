/**
 * Cloudflare Pages Function — Contact form handler
 * Route: POST /api/contact
 *
 * Receives the inspection-request form, validates it, blocks spam, and emails
 * the lead to a single inbox (contact@flcleanup.com). No third-party form tool
 * or dashboard — the site owns the whole flow.
 *
 * Required Cloudflare Pages settings (Settings → Environment variables):
 *   RESEND_API_KEY   API key from resend.com (free tier). Required to send mail.
 * Optional overrides:
 *   LEAD_TO          Recipient inbox. Default: contact@flcleanup.com
 *   LEAD_FROM        Verified sender. Default: FL Cleanup Website <noreply@flcleanup.com>
 *                    (flcleanup.com must be a verified domain in Resend)
 */

const DEFAULT_TO = 'contact@flcleanup.com';
const DEFAULT_FROM = 'FL Cleanup Website <noreply@flcleanup.com>';

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const esc = (s = '') =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function onRequestPost({ request, env }) {
  // Accept both multipart/form-data (FormData) and urlencoded submissions.
  let data;
  try {
    const form = await request.formData();
    data = Object.fromEntries(form.entries());
  } catch (e) {
    return json({ ok: false, error: 'Could not read the form.' }, 400);
  }

  // Honeypot: bots fill hidden fields. Silently accept so they don't retry.
  if (data.company_website) return json({ ok: true });

  const name = (data.name || '').trim();
  const phone = (data.phone || '').trim();
  const email = (data.email || '').trim();
  const zip = (data.zip || '').trim();
  const message = (data.message || '').trim();
  const services = []
    .concat(data.svc || [])
    .filter(Boolean)
    .join(', ');

  // Server-side validation mirrors the client rules.
  if (!name) return json({ ok: false, error: 'Please enter your name.' }, 422);
  if (phone.replace(/\D/g, '').length < 10)
    return json({ ok: false, error: 'Please enter a valid phone number.' }, 422);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return json({ ok: false, error: 'Please enter a valid email address.' }, 422);

  if (!env.RESEND_API_KEY) {
    // Deployed without the key — fail clearly so it's caught in setup, and the
    // UI still tells the visitor to call.
    return json(
      { ok: false, error: 'Email delivery is not configured yet. Please call 877-224-2532.' },
      500
    );
  }

  const to = env.LEAD_TO || DEFAULT_TO;
  const from = env.LEAD_FROM || DEFAULT_FROM;

  const rows = [
    ['Name', name],
    ['Phone', phone],
    ['Email', email || '—'],
    ['Zip', zip || '—'],
    ['Services needed', services || '—'],
    ['Message', message || '—'],
  ];
  const html =
    '<h2 style="font-family:Arial,sans-serif">New inspection request — flcleanup.com</h2>' +
    '<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">' +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 14px 6px 0;color:#555;vertical-align:top"><strong>${esc(
            k
          )}</strong></td><td style="padding:6px 0">${esc(v).replace(/\n/g, '<br>')}</td></tr>`
      )
      .join('') +
    '</table>';
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: `New lead: ${name}${services ? ' — ' + services : ''}`,
        html,
        text,
        reply_to: email || undefined,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return json(
        { ok: false, error: 'We could not send your request. Please call 877-224-2532.', detail },
        502
      );
    }
    return json({ ok: true });
  } catch (e) {
    return json(
      { ok: false, error: 'We could not send your request. Please call 877-224-2532.' },
      502
    );
  }
}
