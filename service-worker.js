const CACHE_NAME = 'guia-esq-v3';

// Lista de arquivos que serão salvos no celular para funcionar sem internet
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Instalação: O celular baixa e guarda os arquivos acima
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Salvando arquivos para uso offline...');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Ativação: Limpa versões antigas do app se houver atualização
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação: Responde usando o cache se estiver sem internet
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(res => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, res.clone());
          return res;
        });
      }).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});
