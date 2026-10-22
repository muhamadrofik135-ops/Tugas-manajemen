// SERVICE WORKER: skrip yang berjalan di latar belakang dan mengatur cache.
// Alur: install (simpan file) -> activate (bersihkan cache lama) -> fetch (layani dari cache).

// Naikkan nomor versi ini setiap kali kamu mengubah file aplikasi
const NAMA_CACHE = "daftar-tugas-v1";

const FILE_APLIKASI = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// 1) INSTALL: simpan semua file aplikasi ke cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(NAMA_CACHE).then((cache) => cache.addAll(FILE_APLIKASI))
  );
  self.skipWaiting();
});

// 2) ACTIVATE: hapus cache versi lama
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((daftar) =>
      Promise.all(daftar.filter((k) => k !== NAMA_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 3) FETCH: ambil dari cache dulu; kalau tidak ada, ambil dari internet
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((hasil) => hasil || fetch(event.request))
  );
});
