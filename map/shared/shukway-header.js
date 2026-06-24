/* ============================================================================
 * ShukWAY · Shared Header — Stage 1 (map + dashboard)
 * Canonical single source. Served from https://map.shukway.com/shared/
 * Loaded cross-origin by each app:
 *   <div id="shukway-header"></div>
 *   <script src="https://map.shukway.com/shared/shukway-header.js?v=1.0.0" data-mode="bar"></script>
 *
 * Per architect brief (brief-header-architect.md):
 *  - 3 nav targets only: מפה · דשבורד · פורטל  (coupons = dashboard tab; pay/team/grow = not nav)
 *  - logo → map  (home address pending Yedidya; do NOT assume shukway.com as home)
 *  - active state: auto by hostname (no manual data-active)
 *  - nav-only: empty session hook, not implemented (Stage 2, pending .shukway.com SSO cookie)
 *  - mode="bar" only. mode="float" (map shrink-on-touch) deferred until market test.
 *  - CSS injected by this script (no FOUC, no second tag).
 *  - ₪0, static, no backend, no trackers.
 * ========================================================================== */
(function () {
  'use strict';

  // ---- config: Stage-1 nav targets (the one array to edit) -----------------
  var NAV = [
    { id: 'map',       label: 'מפה',    href: 'https://map.shukway.com' },
    { id: 'dashboard', label: 'דשבורד', href: 'https://dashboard.shukway.com' },
    { id: 'portal',    label: 'פורטל',  href: 'https://news.shukway.com' }
  ];
  var LOGO_HREF = 'https://map.shukway.com'; // brief: logo → map until home decided

  // ---- active detection: auto by hostname ----------------------------------
  var host = location.hostname;
  var active = host.indexOf('map') === 0 ? 'map'
             : host.indexOf('dashboard') === 0 ? 'dashboard'
             : host.indexOf('news') === 0 ? 'portal'
             : null;

  // ---- mode: the one param the app may pass (display-decision, not state) ---
  var thisScript = document.currentScript;
  var mode = (thisScript && thisScript.getAttribute('data-mode')) || 'bar';

  // ---- logo: the compact icon MARK, derived from THIS script's own origin ----
  // (header bar = tight space → mark, not the full wordmark lockup)
  // prod: https://map.shukway.com/logo-mark.png · same canonical asset everywhere
  // (script at <base>/shared/shukway-header.js → mark at <base>/logo-mark.png)
  var _src = (thisScript && thisScript.src) || '';
  var LOGO_SRC = _src ? _src.replace(/\/shared\/.*$/, '') + '/logo-mark.png' : '/logo-mark.png';
  if (mode === 'float') {
    // float (shrink-on-touch for the map) is deferred until real-device market test.
    // Until then, render the proven 'bar' so nothing ships unverified.
    if (window.console) console.info('[shukway-header] mode="float" pending market test — rendering "bar".');
    mode = 'bar';
  }

  // ---- session hook (Stage 2, intentionally empty) -------------------------
  // window.ShukwayHeader.setSession(user) becomes real ONLY if a cookie on
  // `.shukway.com` exists (cross-subdomain SSO). No-op for now — nav-only.
  function setSession(_user) { /* Stage 2 — not implemented */ }

  // ---- styles (embedded → single request, no FOUC) -------------------------
  var CSS = [
    '@font-face{font-family:"Ploni";src:url("/fonts/ploni-regular.woff2") format("woff2");font-weight:400;font-display:swap}',
    '@font-face{font-family:"Ploni";src:url("/fonts/ploni-medium-aaa.woff") format("woff");font-weight:500;font-display:swap}',
    '@font-face{font-family:"Ploni";src:url("/fonts/ploni-demibold-aaa.woff") format("woff");font-weight:600;font-display:swap}',
    '@font-face{font-family:"Ploni";src:url("/fonts/ploni-bold-aaa.woff") format("woff");font-weight:700;font-display:swap}',
    '#shukway-header{--sw-teal:#038A82;--sw-teal-dark:#026B65;--sw-teal-tint:#DCEFED;--sw-orange:#E56E13;--sw-ink:#2B2B26;--sw-muted:#6B6456;--sw-line:#E3EBE9;--sw-paper:#fff;font-family:"Ploni",system-ui,-apple-system,sans-serif}',
    '#shukway-header *{box-sizing:border-box;margin:0;padding:0}',
    '.swh{direction:rtl;display:flex;align-items:center;gap:16px;padding:10px 18px;background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-bottom:1px solid var(--sw-line);box-shadow:0 2px 12px rgba(20,40,35,.06)}',
    '.swh--bar{position:sticky;top:0;z-index:1000}',
    '.swh__logo{display:flex;align-items:center;gap:8px;flex:0 0 auto;text-decoration:none}',
    '.swh__logo img{height:30px;width:auto;display:block}',
    '.swh__wm{font-size:19px;font-weight:800;color:var(--sw-teal-dark);letter-spacing:-.4px}',
    '.swh__wm b{color:var(--sw-orange);font-weight:800}',
    '.swh__nav{display:flex;gap:6px;flex:1;overflow-x:auto;scrollbar-width:none}',
    '.swh__nav::-webkit-scrollbar{display:none}',
    '.swh__nav a{display:flex;align-items:center;white-space:nowrap;text-decoration:none;font-size:14px;font-weight:600;color:var(--sw-teal-dark);padding:8px 16px;border-radius:10px;border:1.5px solid transparent;transition:background .15s,color .15s}',
    '.swh__nav a:hover{background:var(--sw-teal-tint)}',
    '.swh__nav a.is-active{background:var(--sw-teal);color:#fff}',
    '@media(max-width:520px){.swh{gap:10px;padding:9px 12px}.swh__nav a{padding:7px 13px;font-size:13.5px}.swh__logo img{height:26px}}'
  ].join('');

  // ---- build ----------------------------------------------------------------
  function logoMarkup() {
    // Real brand logo from the script's own (canonical) origin. Wordmark = fallback.
    return '<a class="swh__logo" href="' + LOGO_HREF + '" aria-label="ShukWAY">' +
           '<img class="swh__logo-img" src="' + LOGO_SRC + '" alt="ShukWAY"></a>';
  }
  function navMarkup() {
    var out = '';
    for (var i = 0; i < NAV.length; i++) {
      var n = NAV[i];
      out += '<a href="' + n.href + '"' + (n.id === active ? ' class="is-active" aria-current="page"' : '') + '>' + n.label + '</a>';
    }
    return out;
  }

  function mount() {
    var root = document.getElementById('shukway-header');
    if (!root) {
      if (window.console) console.warn('[shukway-header] missing <div id="shukway-header"></div> — header not mounted.');
      return;
    }
    var style = document.createElement('style');
    style.id = 'shukway-header-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    root.innerHTML =
      '<nav class="swh swh--' + mode + '" role="navigation" aria-label="ShukWAY">' +
        logoMarkup() +
        '<div class="swh__nav">' + navMarkup() + '</div>' +
      '</nav>';

    // resilience: if the logo asset 404s, fall back to the wordmark
    var img = root.querySelector('.swh__logo-img');
    if (img) img.onerror = function () { this.outerHTML = '<span class="swh__wm">שוק<b>WAY</b></span>'; };
  }

  // public hook surface (Stage 2 will fill setSession)
  window.ShukwayHeader = { setSession: setSession, version: '1.0.0' };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
