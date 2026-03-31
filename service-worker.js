// Nome e versão do cache. Se você atualizar o app no futuro, mude para "v3", "v4", etc.
const CACHE_NAME = "guia-esqueletico-v2";

// Lista de arquivos essenciais que o app precisa para abrir sem internet
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Etapa 1: Instalação
// O Service Worker baixa todos os arquivos do APP_SHELL e guarda no armazenamento do celular
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Fazendo cache dos arquivos iniciais");
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// Etapa 2: Ativação
// Remove caches de versões antigas (ex: se você mudou de v1 para v2)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Service Worker: Removendo cache antigo", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Etapa 3: Interceptação de requisições (Fetch)
// Quando o app tenta carregar algo, verificamos se há internet. Se não houver, pegamos do cache.
self.addEventListener("fetch", (event) => {
  // Ignora requisições que não sejam do tipo GET (ex: POST, PUT)
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se a requisição deu certo (temos internet), atualizamos o cache com a versão mais nova
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      })
      .catch(() => {
        // Se a requisição falhou (estamos sem internet), buscamos o arquivo no cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Se o arquivo não estiver no cache, retorna a página inicial como fallback
          return caches.match("./index.html");
        });
      })
  );
});
