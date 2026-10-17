// Aire · servidor de licencias (Cloudflare Worker)
//
// Flujo de venta automática:
//   1. La app crea un "claim" aleatorio y abre el checkout de Lemon Squeezy con ese claim como custom data.
//   2. Lemon Squeezy cobra, genera la licencia, la envía por email y avisa a /webhook.
//   3. El webhook guarda claim -> licencia en KV y (opcional) te avisa por Telegram.
//   4. La app consulta /claim, recibe la licencia y la activa con /activate. Pro desbloqueado sin intervención.
//   5. En otro móvil, el cliente pega la licencia del email y /activate la vuelve a activar.
//
// Variables (wrangler secret put ...): LS_WEBHOOK_SECRET, LS_STORE_ID, LS_PRODUCT_ID
// Opcionales: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, ALLOWED_ORIGIN (por defecto https://aire.kreadigitalstudio.es)
// KV: binding LICENSES

const LS = 'https://api.lemonsqueezy.com/v1/licenses/';
const CLAIM_TTL = 60 * 60 * 24 * 30;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const cors = corsHeaders(req, env);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    try {
      if (url.pathname === '/webhook' && req.method === 'POST') return await webhook(req, env);
      if (url.pathname === '/claim' && req.method === 'GET') return await claim(url, env, cors);
      if (url.pathname === '/activate' && req.method === 'POST') return await activate(req, env, cors);
      if (url.pathname === '/validate' && req.method === 'POST') return await validate(req, env, cors);
      if (url.pathname === '/health') return json({ ok: true }, 200, cors);
      return json({ error: 'not_found' }, 404, cors);
    } catch (e) {
      return json({ error: 'server_error' }, 500, cors);
    }
  }
};

// ---------- Webhook de Lemon Squeezy ----------
async function webhook(req, env) {
  const raw = await req.text();
  const sig = req.headers.get('X-Signature') || '';
  if (!(await validSignature(raw, sig, env.LS_WEBHOOK_SECRET))) return new Response('bad signature', { status: 401 });

  const body = JSON.parse(raw);
  const event = body.meta?.event_name;
  const custom = body.meta?.custom_data || {};
  const a = body.data?.attributes || {};
  const c = typeof custom.claim === 'string' && /^[a-f0-9-]{20,64}$/.test(custom.claim) ? custom.claim : null;

  if (event === 'order_created') {
    if (String(a.first_order_item?.product_id) !== String(env.LS_PRODUCT_ID)) return new Response('ignored');
    if (c) await env.LICENSES.put(`claim:${c}`, JSON.stringify({ order: String(body.data.id) }), { expirationTtl: CLAIM_TTL });
    const key = await env.LICENSES.get(`order:${body.data.id}`);
    if (c && key) await env.LICENSES.put(`claim:${c}`, JSON.stringify({ order: String(body.data.id), key }), { expirationTtl: CLAIM_TTL });
    await notify(env, `💰 Nueva venta de Aire Pro · ${a.total_formatted || ''} · pedido ${body.data.id}`); // sin datos personales del cliente
  }

  if (event === 'license_key_created') {
    if (String(a.product_id) !== String(env.LS_PRODUCT_ID)) return new Response('ignored');
    const order = String(a.order_id);
    // El webhook de la licencia puede llegar antes o después del del pedido: guardamos por los dos caminos.
    await env.LICENSES.put(`order:${order}`, a.key, { expirationTtl: CLAIM_TTL });
    if (c) await env.LICENSES.put(`claim:${c}`, JSON.stringify({ order, key: a.key }), { expirationTtl: CLAIM_TTL });
  }

  if (event === 'order_refunded') await notify(env, `↩️ Reembolso de Aire Pro · pedido ${body.data?.id}`);
  return new Response('ok');
}

async function validSignature(raw, sig, secret) {
  if (!secret || !sig) return false;
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(raw)));
  const hex = [...mac].map(b => b.toString(16).padStart(2, '0')).join('');
  if (hex.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

// ---------- Recogida automática tras el pago ----------
async function claim(url, env, cors) {
  const c = url.searchParams.get('c') || '';
  if (!/^[a-f0-9-]{20,64}$/.test(c)) return json({ error: 'bad_claim' }, 400, cors);
  const raw = await env.LICENSES.get(`claim:${c}`);
  if (!raw) return json({ status: 'pending' }, 200, cors);
  const rec = JSON.parse(raw);
  if (!rec.key) {
    const key = await env.LICENSES.get(`order:${rec.order}`);
    if (!key) return json({ status: 'pending' }, 200, cors);
    rec.key = key;
  }
  return json({ status: 'paid', key: rec.key }, 200, cors);
}

// ---------- Activación y validación de licencias ----------
async function activate(req, env, cors) {
  const { key, device } = await req.json();
  if (!key || typeof key !== 'string' || key.length > 80) return json({ ok: false, error: 'Escribe la licencia que recibiste por email.' }, 400, cors);
  const r = await lsCall('activate', { license_key: key.trim(), instance_name: String(device || 'Aire').slice(0, 60) });
  if (!r.activated) return json({ ok: false, error: friendly(r.error) }, 200, cors);
  if (!ownProduct(r.meta, env)) return json({ ok: false, error: 'Esta licencia no es de Aire.' }, 200, cors);
  return json({ ok: true, instance: r.instance?.id, email: r.meta?.customer_email || '' }, 200, cors);
}

async function validate(req, env, cors) {
  const { key, instance } = await req.json();
  if (!key || !instance) return json({ valid: false }, 400, cors);
  const r = await lsCall('validate', { license_key: key, instance_id: instance });
  return json({ valid: !!r.valid && ownProduct(r.meta, env) && r.license_key?.status !== 'disabled' }, 200, cors);
}

async function lsCall(action, params) {
  const res = await fetch(LS + action, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params)
  });
  return res.json();
}

const ownProduct = (meta, env) => meta && String(meta.store_id) === String(env.LS_STORE_ID) && String(meta.product_id) === String(env.LS_PRODUCT_ID);

function friendly(err = '') {
  const e = err.toLowerCase();
  if (e.includes('activation limit')) return 'Has usado esta licencia en el máximo de dispositivos. Escríbenos y la liberamos.';
  if (e.includes('not found') || e.includes('invalid')) return 'No encontramos esa licencia. Cópiala tal cual aparece en el email.';
  if (e.includes('disabled') || e.includes('expired')) return 'Esta licencia está desactivada.';
  return 'No se pudo activar la licencia. Inténtalo de nuevo en un momento.';
}

// ---------- Avisos ----------
async function notify(env, text) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text })
  }).catch(() => {});
}

function corsHeaders(req, env) {
  const allowed = (env.ALLOWED_ORIGIN || 'https://aire.kreadigitalstudio.es').split(',').map(s => s.trim());
  const origin = req.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin'
  };
}

const json = (data, status, headers) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...headers } });
