// ShukWAY coupon-intake server — receives a coupon from the owner dashboard and
// creates an item on the Monday "הסכמי קופונים — קליטה מהשטח" board (5098280692).
// The Monday token is read from the environment ONLY (never in code, never in the browser).
//   Local:  set MONDAY_TOKEN in intake/.env  (see .env.example) then: node server.cjs
//   Render: Web Service, Root Dir "intake", Start "node server.cjs", env var MONDAY_TOKEN
const http = require('http');

const PORT = process.env.PORT || 4300;
const BOARD_ID = process.env.MONDAY_BOARD_ID || '5098280692';
const TOKEN = process.env.MONDAY_TOKEN || '';

// origins allowed to call us (the owner dashboard + local testing)
const ALLOWED = [
  'https://dashboard.shukway.com',
  'http://localhost:4181', 'http://localhost:4183', 'http://localhost:5173',
];
function cors(req, res) {
  const o = req.headers.origin;
  if (o && ALLOWED.includes(o)) res.setHeader('Access-Control-Allow-Origin', o);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// map the dashboard's clean coupon object → Monday column_values (board 5098280692)
function toColumnValues(c) {
  const today = new Date().toISOString().slice(0, 10);
  const cv = {
    short_text32xipuy5: c.business || '',
    short_textm4fci411: c.signer || '',
    single_select4pddt5q: { label: c.deal_type || 'אחוז הנחה' },
    short_text0fbxk4il: c.coupon_name || '',
    long_textt1by1ygq: { text: c.terms || '' },
    single_select4sxsowy: { label: 'למשתמש' },
    boolean2dapd13a: { checked: c.qr_required ? 'true' : 'false' },
    single_selectqongqne: { label: c.settlement || 'עמלה באחוזים' },
    short_textuwriepz5: c.commission || '15%',
    long_textx7k1i1l1: {
      text: `נוצר מ-${c.created_from || 'דשבורד'} · slug=${c.slug || ''}${c.secret ? ' · סוד הנחה' : ''}`,
    },
  };
  if (c.phone) cv.phone5wo0vlvb = { phone: String(c.phone), countryShortName: 'IL' };
  if (c.valid_to) cv.date_rangebygokvj9 = { from: today, to: c.valid_to };
  return cv;
}

async function createMondayItem(c) {
  const name = `${c.coupon_name || 'קופון'} · ${c.business || ''}`.trim();
  const query = `mutation ($board: ID!, $name: String!, $cols: JSON!) {
    create_item (board_id: $board, item_name: $name, column_values: $cols, create_labels_if_missing: false) { id } }`;
  const variables = { board: BOARD_ID, name, cols: JSON.stringify(toColumnValues(c)) };
  const r = await fetch('https://api.monday.com/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: TOKEN, 'API-Version': '2024-01' },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data && j.data.create_item && j.data.create_item.id;
}

http.createServer((req, res) => {
  cors(req, res);
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.url === '/health') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok: true, hasToken: !!TOKEN })); }

  if (req.method === 'POST' && req.url === '/api/coupon-intake') {
    if (!TOKEN) { res.writeHead(503, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok: false, error: 'MONDAY_TOKEN not set on server' })); }
    let body = '';
    req.on('data', (ch) => { body += ch; if (body.length > 1e6) req.destroy(); });
    req.on('end', async () => {
      let c; try { c = JSON.parse(body); } catch { res.writeHead(400, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok: false, error: 'bad json' })); }
      try {
        const id = await createMondayItem(c);
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ ok: true, itemId: id }));
      } catch (e) {
        res.writeHead(502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ ok: false, error: String(e.message || e) }));
      }
    });
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ ok: false, error: 'not found' }));
}).listen(PORT, () => console.log(`coupon-intake on http://localhost:${PORT}  (token: ${TOKEN ? 'set' : 'MISSING'})`));
