'use strict';

var VERSION    = 'sw-cuppon-v2';
var INTAKE_URL = 'https://team.shukway.com/api/coupons/redeem';
var DB_NAME    = 'cuppon-journey';
var STORE      = 'queue';
var SHELL = [
  'redeem.html',
  'fonts/ploni-regular.woff2',
  'fonts/ploni-medium-aaa.woff',
  'fonts/ploni-demibold-aaa.woff',
  'fonts/ploni-bold-aaa.woff',
  'fonts/ploni-ultrabold-aaa.woff'
];

/* install — pre-cache shell */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(VERSION)
      .then(function(c) { return c.addAll(SHELL); })
      .then(function() { return self.skipWaiting(); })
  );
});

/* activate — evict old caches, claim clients */
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== VERSION; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

/* fetch — cache-first for same-origin shell assets */
self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(function(hit) {
      return hit || fetch(e.request).then(function(res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var clone = res.clone();
          caches.open(VERSION).then(function(c) { c.put(e.request, clone); });
        }
        return res;
      });
    })
  );
});

/* background sync — flush IDB queue to monitoring */
self.addEventListener('sync', function(e) {
  if (e.tag === 'cuppon-sync') {
    e.waitUntil(flushQueue());
  }
});

/* ── IndexedDB helpers ── */
function openDB() {
  return new Promise(function(res, rej) {
    var r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = function() {
      if (!r.result.objectStoreNames.contains(STORE))
        r.result.createObjectStore(STORE, { keyPath: 'id' });
    };
    r.onsuccess = function() { res(r.result); };
    r.onerror   = function() { rej(r.error); };
  });
}

function getAllPending(db) {
  return new Promise(function(res, rej) {
    var tx  = db.transaction(STORE, 'readonly');
    var req = tx.objectStore(STORE).getAll();
    req.onsuccess = function() {
      res((req.result || []).filter(function(r) { return r.sync_status === 'local'; }));
    };
    req.onerror = function() { rej(req.error); };
  });
}

function markSynced(db, id) {
  return new Promise(function(res, rej) {
    var tx  = db.transaction(STORE, 'readwrite');
    var req = tx.objectStore(STORE).get(id);
    req.onsuccess = function() {
      var rec = req.result;
      if (!rec) { res(); return; }
      rec.sync_status = 'synced';
      tx.objectStore(STORE).put(rec);
      tx.oncomplete = res;
      tx.onerror    = function() { rej(tx.error); };
    };
    req.onerror = function() { rej(req.error); };
  });
}

/* send only the 6 contract fields — strip internal id/sync_status */
function flushQueue() {
  return openDB().then(function(db) {
    return getAllPending(db).then(function(pending) {
      return Promise.all(pending.map(function(rec) {
        return fetch(INTAKE_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            coupon_id:          rec.coupon_id,
            business_id:        rec.business_id,
            scanned_at:         rec.scanned_at,
            device_fingerprint: rec.device_fingerprint,
            purchase_amount:    rec.purchase_amount,
            discount_given:     rec.discount_given
          })
        })
        .then(function(r) {
          if (r.ok) return markSynced(db, rec.id);
        })
        .catch(function() { /* keep local — retry on next sync event */ });
      }));
    });
  });
}
