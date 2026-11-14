// POST /api/quote — sends a quote request from makabeez.com to Joe's Telegram.
// Needs two environment variables on Vercel: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.
// Nothing is stored: the request is forwarded once and dropped.

const TYPES = ['Points program', 'Trading contest', 'Airdrop', 'Agent payments / execution', 'Other'];
const ALLOWED_HOSTS = [/^(www\.)?makabeez\.com$/, /^makabeez\.vercel\.app$/, /^makabeez-[a-z0-9-]+-makabeezs-projects\.vercel\.app$/, /^localhost(:\d+)?$/];

// Strip control characters; keep newlines only where asked.
function clean(value, max, keepNewlines = false) {
  let s = String(value ?? '');
  s = keepNewlines ? s.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ')
                   : s.replace(/[\u0000-\u001f\u007f]/g, ' ');
  return s.trim().slice(0, max);
}

function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // same-origin form posts and curl tests
  try { return ALLOWED_HOSTS.some((re) => re.test(new URL(origin).host)); } catch { return false; }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  if (!originAllowed(req)) return res.status(403).json({ ok: false, error: 'forbidden' });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return res.status(503).json({ ok: false, error: 'not_configured' });

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = null; } }
  if (!b || typeof b !== 'object') return res.status(400).json({ ok: false, error: 'bad_request' });

  // Bots: a filled honeypot or a form submitted in under 2.5 s gets a fake success and is dropped.
  const elapsed = Number(b.elapsed);
  if (clean(b.website2, 200) || !(elapsed >= 2500)) return res.status(200).json({ ok: true });

  const project = clean(b.project, 120);
  const contact = clean(b.contact, 160);
  if (!project || !contact) return res.status(400).json({ ok: false, error: 'missing_fields' });
  const link = clean(b.link, 300);
  const type = TYPES.includes(b.type) ? b.type : 'Other';
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(b.date || '')) ? b.date : '';
  const notes = clean(b.notes, 2000, true);

  const text = [
    'New quote request · makabeez.com',
    '',
    `Project: ${project}`,
    `Link: ${link || '-'}`,
    `Launching: ${type}`,
    `Expected launch: ${date || '-'}`,
    `Reach them at: ${contact}`,
    notes ? `\nNotes:\n${notes}` : '',
  ].join('\n').trim();

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    });
    if (!r.ok) {
      console.error('quote_forward_failed', r.status);
      return res.status(502).json({ ok: false, error: 'forward_failed' });
    }
  } catch (e) {
    console.error('quote_forward_error', e && e.name);
    return res.status(502).json({ ok: false, error: 'forward_failed' });
  }

  console.log('quote_request', { type }); // a countable log line, no personal data
  return res.status(200).json({ ok: true });
}
