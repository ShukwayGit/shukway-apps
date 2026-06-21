// ShukWAY coupon-intake server — owner dashboard ↔ Monday board "הסכמי קופונים — קליטה מהשטח" (5098280692).
//   POST /api/coupon-intake   → create a coupon item (+ optional owner signature → file column)
//   GET  /api/coupons?business=<name> → list that business's coupons (real data for the dashboard)
//   GET  /health
// Monday token is read from the environment ONLY (MONDAY_TOKEN) — never in code, file, or browser.
const http = require('http');

const PORT = process.env.PORT || 4300;
const BOARD_ID = process.env.MONDAY_BOARD_ID || '5098280692';
const TOKEN = process.env.MONDAY_TOKEN || '';
const SIG_COL = 'file1rbddwvz';       // "צירוף ההסכם החתום (PDF)" file column

const ALLOWED = [
  'https://dashboard.shukway.com',
  'http://localhost:4181', 'http://localhost:4183', 'http://localhost:5173',
];
function cors(req, res) {
  const o = req.headers.origin;
  if (o && ALLOWED.includes(o)) res.setHeader('Access-Control-Allow-Origin', o);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
function json(res, code, obj) { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); }

async function mondayGraphQL(query, variables) {
  const r = await fetch('https://api.monday.com/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: TOKEN, 'API-Version': '2024-01' },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data;
}

function toColumnValues(c) {
  const today = new Date().toISOString().slice(0, 10);
  const cv = {
    short_text32xipuy5: c.business || '',
    short_textm4fci411: c.signer || c.business || '',
    single_select4pddt5q: { label: c.deal_type || 'אחוז הנחה' },
    short_text0fbxk4il: c.coupon_name || '',
    long_textt1by1ygq: { text: c.terms || '' },
    single_select4sxsowy: { label: 'למשתמש' },
    boolean2dapd13a: { checked: c.qr_required ? 'true' : 'false' },
    single_selectqongqne: { label: c.settlement || 'עמלה באחוזים' },
    short_textuwriepz5: c.commission || '15%',
    long_textx7k1i1l1: { text: `נוצר מ-${c.created_from || 'דשבורד'} · slug=${c.slug || ''}${c.secret ? ' · סוד הנחה' : ''}${c.signature ? ' · חתום' : ''}` },
  };
  if (c.phone) cv.phone5wo0vlvb = { phone: String(c.phone), countryShortName: 'IL' };
  if (c.valid_to) cv.date_rangebygokvj9 = { from: today, to: c.valid_to };
  return cv;
}

async function createMondayItem(c) {
  const name = `${c.coupon_name || 'קופון'} · ${c.business || ''}`.trim();
  const data = await mondayGraphQL(
    `mutation ($b: ID!, $n: String!, $cv: JSON!) { create_item (board_id:$b, item_name:$n, column_values:$cv, create_labels_if_missing:false){id} }`,
    { b: BOARD_ID, n: name, cv: JSON.stringify(toColumnValues(c)) });
  return data.create_item.id;
}

// upload the owner's signature (data URL) to the item's file column — non-fatal
async function uploadSignature(itemId, dataUrl) {
  const m = /^data:(image\/\w+);base64,(.+)$/.exec(dataUrl || '');
  if (!m) return false;
  const buf = Buffer.from(m[2], 'base64');
  const fd = new FormData();
  fd.append('query', `mutation ($file: File!) { add_file_to_column (item_id: ${itemId}, column_id: "${SIG_COL}", file: $file) { id } }`);
  fd.append('variables[file]', new Blob([buf], { type: m[1] }), 'signature.png');
  const r = await fetch('https://api.monday.com/v2/file', { method: 'POST', headers: { Authorization: TOKEN }, body: fd });
  const j = await r.json();
  return !(j.errors);
}

async function readCoupons(business) {
  const data = await mondayGraphQL(
    `query ($b:[ID!]) { boards(ids:$b){ items_page(limit:200){ items { id name created_at column_values(ids:["short_text32xipuy5","single_select4pddt5q","short_text0fbxk4il","date_rangebygokvj9","short_textuwriepz5","long_textt1by1ygq"]){ id text } } } } }`,
    { b: [BOARD_ID] });
  const items = (((data.boards || [])[0] || {}).items_page || {}).items || [];
  const want = (business || '').trim();
  const get = (cvs, id) => (cvs.find((x) => x.id === id) || {}).text || '';
  return items
    .filter((it) => get(it.column_values, 'short_text32xipuy5').trim() === want)
    .map((it) => ({
      id: it.id,
      coupon_name: get(it.column_values, 'short_text0fbxk4il') || it.name,
      deal_type: get(it.column_values, 'single_select4pddt5q'),
      valid: get(it.column_values, 'date_rangebygokvj9'),
      commission: get(it.column_values, 'short_textuwriepz5'),
      terms: get(it.column_values, 'long_textt1by1ygq'),
      created_at: it.created_at,
    }));
}

http.createServer((req, res) => {
  cors(req, res);
  const u = new URL(req.url, 'http://x');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (u.pathname === '/health') return json(res, 200, { ok: true, hasToken: !!TOKEN });

  if (req.method === 'GET' && u.pathname === '/api/coupons') {
    if (!TOKEN) return json(res, 503, { ok: false, error: 'MONDAY_TOKEN not set' });
    const business = u.searchParams.get('business') || '';
    if (!business) return json(res, 400, { ok: false, error: 'business required' });
    readCoupons(business).then((coupons) => json(res, 200, { ok: true, coupons }))
      .catch((e) => json(res, 502, { ok: false, error: String(e.message || e) }));
    return;
  }

  if (req.method === 'POST' && u.pathname === '/api/coupon-intake') {
    if (!TOKEN) return json(res, 503, { ok: false, error: 'MONDAY_TOKEN not set' });
    let body = '';
    req.on('data', (ch) => { body += ch; if (body.length > 4e6) req.destroy(); });
    req.on('end', async () => {
      let c; try { c = JSON.parse(body); } catch { return json(res, 400, { ok: false, error: 'bad json' }); }
      if (!c.signature) return json(res, 422, { ok: false, error: 'signature required' });   // hard gate: no publish without owner signature
      try {
        const id = await createMondayItem(c);
        let signed = false; try { signed = await uploadSignature(id, c.signature); } catch (e) { /* non-fatal */ }
        json(res, 200, { ok: true, itemId: id, signed });
      } catch (e) { json(res, 502, { ok: false, error: String(e.message || e) }); }
    });
    return;
  }
  json(res, 404, { ok: false, error: 'not found' });
}).listen(PORT, () => console.log(`coupon-intake on http://localhost:${PORT}  (token: ${TOKEN ? 'set' : 'MISSING'})`));
