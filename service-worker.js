const CACHE_NAME = "anatomia-ossea-v1";

const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "https://cdn.tailwindcss.com/3.4.17",
  "https://cdn.jsdelivr.net/npm/lucide@0.263.0/dist/umd/lucide.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",
  "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
];

// Instalação (cache inicial)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache criado");
      return cache.addAll(ASSETS);
    })
  );
});

// Ativação (limpa caches antigos)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Removendo cache antigo:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Intercepta requisições
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // fallback offline simples
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        })
      );
    })
  );
});
