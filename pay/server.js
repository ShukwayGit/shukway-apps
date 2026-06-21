'use strict';
/*
 * ShukWAY · Cardcom Low Profile payment redirect endpoint
 * ------------------------------------------------------------------
 * A static page cannot call the Cardcom API directly (CORS + the API
 * credentials must stay server-side). This tiny zero-dependency Node
 * service does it: GET /pay -> creates a Low Profile payment page via
 * Cardcom V11 and 302-redirects the customer to Cardcom's hosted card
 * form. On success/failure Cardcom redirects back to grow.shukway.com.
 *
 * Credentials come from env vars (set in the Render dashboard, never in
 * code): CARDCOM_TERMINAL, CARDCOM_APINAME, CARDCOM_APIPASSWORD (optional
 * — only needed for refunds / invoice-only, not for a normal charge).
 *
 * NOTE: terminal 191986 must be APPROVED by Cardcom before this can
 * actually charge; until then Cardcom returns ResponseCode != 0 and we
 * redirect to the failed URL with the reason.
 */
const http = require('http');

const CARDCOM_CREATE = 'https://secure.cardcom.solutions/api/v11/LowProfile/Create';

const TERMINAL     = process.env.CARDCOM_TERMINAL;            // e.g. 191986
const API_NAME     = process.env.CARDCOM_APINAME;            // e.g. BuoLeplLvUIBkV1IH8Uz
const API_PASSWORD = process.env.CARDCOM_APIPASSWORD || '';  // optional
const AMOUNT       = Number(process.env.AMOUNT || 1500);
const PRODUCT      = process.env.PRODUCT_NAME || 'תוכנית סוחר מייסד — ShukWAY';
const SUCCESS_URL  = process.env.SUCCESS_URL || 'https://grow.shukway.com/?paid=1';
const FAILED_URL   = process.env.FAILED_URL || 'https://grow.shukway.com/?paid=0';
const PORT         = process.env.PORT || 3000;

function redirect(res, url) { res.writeHead(302, { Location: url }); res.end(); }
function withParam(url, k, v) { return url + (url.includes('?') ? '&' : '?') + k + '=' + encodeURIComponent(v); }

async function createLowProfile() {
  const payload = {
    TerminalNumber: Number(TERMINAL),
    ApiName: API_NAME,
    Operation: 'ChargeOnly',
    Amount: AMOUNT,
    ISOCoinId: 1,            // 1 = ILS
    Language: 'he',
    ReturnValue: 'grow-founder-' + Date.now(),
    ProductName: PRODUCT,
    SuccessRedirectUrl: SUCCESS_URL,
    FailedRedirectUrl: FAILED_URL
  };
  if (API_PASSWORD) payload.ApiPassword = API_PASSWORD;

  const r = await fetch(CARDCOM_CREATE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return r.json();
}

const server = http.createServer(async (req, res) => {
  let pathname = '/';
  try { pathname = new URL(req.url, 'http://localhost').pathname; } catch (e) {}

  // health / root
  if (pathname === '/' || pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, service: 'shukway-pay', configured: !!(TERMINAL && API_NAME), amount: AMOUNT }));
    return;
  }

  // the payment entrypoint the grow button links to
  if (pathname === '/pay') {
    if (!TERMINAL || !API_NAME) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Payment endpoint not configured: set CARDCOM_TERMINAL and CARDCOM_APINAME env vars.');
      return;
    }
    try {
      const data = await createLowProfile();
      if (data && data.ResponseCode === 0 && data.Url) {
        redirect(res, data.Url);                       // -> Cardcom hosted card page
      } else {
        const msg = (data && data.Description) || 'unknown_error';
        redirect(res, withParam(FAILED_URL, 'err', msg));
      }
    } catch (e) {
      redirect(res, withParam(FAILED_URL, 'err', 'gateway_exception'));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => console.log('shukway-pay listening on :' + PORT));
