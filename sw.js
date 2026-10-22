/* 刘大爷每日一卦 · 离线缓存 Service Worker */
const CACHE='liudaye-yigua-v1';
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 if(e.request.mode==='navigate'){
  e.respondWith(
   fetch(e.request).then(r=>{
    if(r&&r.ok){
     const cp=r.clone();
     caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{});
     return r;
    }
    throw new Error('bad-status');
   }).catch(()=>caches.match(e.request).then(m=>m||caches.match(self.registration.scope)))
  );
 }
});
