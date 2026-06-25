/* ============================================================================
 * ShukWAY · Coupon Redemption — Service Worker
 *  (1) caches the redemption shell so a cold scan loads OFFLINE after first visit
 *  (2) Background Sync: flushes the IndexedDB queue to shukway-intake even after
 *      the page is closed / when signal returns under the market roof
 * ========================================================================== */
'use strict';

var VERSION = 'sw-redeem-v1';
var INTAKE_URL = 'https://shukway-intake.onrender.com/api/coupon-redeem';
var DB_NAME = 'shukway-redeem', STORE = 'queue';

var SHELL = [
  'redeem.html',
  'manifest.webmanifest',
  'icon.svg',
  'fonts/ploni-regular.woff2',
  'fonts/ploni-medium-aaa.woff',
  'fonts/ploni-demibold-aaa.woff',
  'fonts/ploni-bold-aaa.woff',
  'fonts/ploni-ultrabold-aaa.woff'
];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){ return Promise.all(keys.map(function(k){ if(k!==VERSION) return caches.delete(k); })); })
      .then(function(){ return self.clients.claim(); })
  );
});

/* cache-first for the shell (offline load); never cache the intake POST */
self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;                       // POSTs (redeem) go straight to network
  if(req.url.indexOf(INTAKE_URL) === 0) return;
  e.respondWith(
    caches.match(req).then(function(hit){
      return hit || fetch(req).then(function(res){
        if(res && res.ok && req.url.indexOf(self.location.origin) === 0){
          var copy = res.clone(); caches.open(VERSION).then(function(c){ c.put(req, copy); });
        }
        return res;
      }).catch(function(){ return hit; });
    })
  );
});

/* Background Sync: drain the IndexedDB queue */
self.addEventListener('sync', function(e){
  if(e.tag === 'redeem-sync') e.waitUntil(flushQueue());
});

/* minimal IDB access inside the SW (no shared code with the page) */
function idb(){
  return new Promise(function(res, rej){
    var r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = function(){ if(!r.result.objectStoreNames.contains(STORE)) r.result.createObjectStore(STORE, {keyPath:'id'}); };
    r.onsuccess = function(){ res(r.result); }; r.onerror = function(){ rej(r.error); };
  });
}
function all(){ return idb().then(function(db){ return new Promise(function(res,rej){ var rq=db.transaction(STORE,'readonly').objectStore(STORE).getAll(); rq.onsuccess=function(){res(rq.result||[]);}; rq.onerror=function(){rej(rq.error);}; }); }); }
function put(rec){ return idb().then(function(db){ return new Promise(function(res,rej){ var tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).put(rec); tx.oncomplete=res; tx.onerror=function(){rej(tx.error);}; }); }); }

function flushQueue(){
  return all().then(function(list){
    return list.reduce(function(chain, rec){
      return chain.then(function(){
        if(rec.status === 'synced') return;
        return fetch(INTAKE_URL, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(rec)})
          .then(function(r){ if(!r.ok) throw new Error('http '+r.status); return r.json().catch(function(){return {};}); })
          .then(function(resp){ rec.status='synced'; rec.confirmId=(resp&&resp.confirmId)||rec.shortCode; return put(rec); })
          .catch(function(){ /* keep pending; sync will fire again */ });
      });
    }, Promise.resolve());
  });
}
