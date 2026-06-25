/* ShukWAY tablet — Service Worker: offline page cache + Background Sync delivery queue.
   PLACEHOLDER endpoint — set INTAKE_URL to the shukway-intake /submit URL once approved.
   With INTAKE_URL empty: caches for offline + keeps submissions queued (no network attempt). */
const INTAKE_URL = ''; // e.g. 'https://shukway-intake.onrender.com/submit' — pending approval
const CACHE = 'shukway-tablet-v1';
const SUB_DB = 'shukway_submissions', SUB_STORE = 'queue';

function idb(){ return new Promise((res,rej)=>{ const r=indexedDB.open(SUB_DB,1); r.onupgradeneeded=()=>{ r.result.createObjectStore(SUB_STORE,{keyPath:'id'}); }; r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }); }
function idbAll(){ return idb().then(db=>new Promise(res=>{ const tx=db.transaction(SUB_STORE,'readonly'); const g=tx.objectStore(SUB_STORE).getAll(); g.onsuccess=()=>res(g.result||[]); g.onerror=()=>res([]); })); }
function idbPut(rec){ return idb().then(db=>new Promise((res,rej)=>{ const tx=db.transaction(SUB_STORE,'readwrite'); tx.objectStore(SUB_STORE).put(rec); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error); })); }

self.addEventListener('install', e=>self.skipWaiting());
self.addEventListener('activate', e=>e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  e.respondWith(
    fetch(req).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(req,cp)).catch(()=>{}); return res; })
              .catch(()=>caches.match(req))
  );
});

self.addEventListener('sync', e=>{ if(e.tag==='shukway-submit') e.waitUntil(flush()); });

async function flush(){
  if(!INTAKE_URL) return; // placeholder — nothing to deliver to yet
  const pending=(await idbAll()).filter(r=>r.status==='pending');
  for(const rec of pending){
    const r=await fetch(INTAKE_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(rec)});
    if(!r.ok) throw new Error('http '+r.status); // throw → Background Sync retries with backoff
    const j=await r.json().catch(()=>({}));
    rec.status='confirmed'; rec.confirmId=j.confirmId||j.id||'';
    await idbPut(rec);
    const cs=await self.clients.matchAll(); cs.forEach(c=>c.postMessage({type:'confirmed',id:rec.id,confirmId:rec.confirmId}));
  }
}
