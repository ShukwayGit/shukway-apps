# shukway-pay — Cardcom Low Profile payment endpoint

Tiny zero-dependency Node service that turns a click on grow.shukway.com's
"תשלום" button into a real Cardcom hosted payment page.

Flow: customer → `GET /pay` → service calls Cardcom `LowProfile/Create`
(terminal 191986) → **302 redirect** to Cardcom's hosted card form →
on success/failure Cardcom redirects back to `grow.shukway.com`.

Why a server: a static page can't call the Cardcom API (CORS + the
credentials must stay server-side).

## Deploy (Render Web Service — same repo as the static sites)

1. Render → **New → Web Service** → connect `ShukwayGit/shukway-apps`.
2. **Root Directory:** `pay`
3. **Runtime:** Node · **Build Command:** (leave empty) · **Start Command:** `node server.js`
4. **Environment variables:**
   | Key | Value |
   |---|---|
   | `CARDCOM_TERMINAL` | `191986` |
   | `CARDCOM_APINAME` | `BuoLeplLvUIBkV1IH8Uz` |
   | `CARDCOM_APIPASSWORD` | *(optional — only for refunds/invoice-only)* |
   | `SUCCESS_URL` | `https://grow.shukway.com/?paid=1` |
   | `FAILED_URL` | `https://grow.shukway.com/?paid=0` |
   | `AMOUNT` | `1500` |
5. Deploy → it serves at `shukway-pay.onrender.com`. Optional: add custom
   domain `pay.shukway.com` (CNAME → `shukway-pay.onrender.com`).
6. Point the grow "תשלום" button at `https://<that host>/pay`.

## Notes

- **Terminal 191986 must be approved by Cardcom first.** Until then
  `LowProfile/Create` returns `ResponseCode != 0` and the customer is sent
  to `FAILED_URL?err=...`. After approval it charges for real.
- `ApiPassword` is **not** needed for a normal charge — leave it unset
  unless you add refunds or invoice-only documents.
- Render free Web Services cold-start (~30–50s after idle). For a payment
  button consider a paid instance or a Cloudflare Worker (instant, free).
- Endpoints / WhatsApp-shareable payment links (fixed amounts, set server-side
  so they can't be tampered with via the query string):
  | Path | Amount | Purpose |
  |---|---|---|
  | `GET /pay` | 1,500 ₪ | Founding Merchant (סוחר מייסד) |
  | `GET /pay/quarter` | 1,200 ₪ | Ad package — quarter |
  | `GET /pay/month` | 500 ₪ | Ad package — first month |
- `GET /health` returns status JSON including the configured plans.
