
const CACHE_NAME = 'ilac-takip-cache-v4';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS))); self.skipWaiting();});
self.addEventListener('activate', e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME&&caches.delete(k))))); self.clients.claim();});
self.addEventListener('fetch', e=>{
  const req=e.request;
  if (req.method!=='GET' || new URL(req.url).origin!==location.origin) return;
  e.respondWith(caches.match(req).then(c=>c || fetch(req).then(res=>{
    const copy=res.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(req, copy)); return res;
  }).catch(()=>caches.match('./index.html'))));
});
