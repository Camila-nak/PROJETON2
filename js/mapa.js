document.addEventListener("DOMContentLoaded", () => {
  const locais = [
    { id: "parque-ibirapuera",   nome: "Parque Ibirapuera",         lat: -23.5874, lng: -46.6576 },
    { id: "parque-villa-lobos",  nome: "Parque Villa-Lobos",        lat: -23.5460, lng: -46.7229 },
    { id: "museu-catavento",     nome: "Museu Catavento",           lat: -23.5459, lng: -46.6272 },
    { id: "pinacoteca",          nome: "Pinacoteca de São Paulo",   lat: -23.5343, lng: -46.6338 },
    { id: "itau-cultural",       nome: "Itaú Cultural",             lat: -23.5714, lng: -46.6466 },
    { id: "centro-tradicoes-nordestinas", nome: "CTN",              lat: -23.5147, lng: -46.6717 },
    { id: "parque-da-monica",    nome: "Parque da Mônica",          lat: -23.6531, lng: -46.7080 },
    { id: "aquario-sao-paulo",   nome: "Aquário de São Paulo",      lat: -23.5907, lng: -46.6104 },
    { id: "capim-santo",         nome: "Restaurante Capim Santo",   lat: -23.5663, lng: -46.6717 },
    { id: "moma-itaim",          nome: "MOMA Itaim",                lat: -23.5846, lng: -46.6786 },
    { id: "basilicata",          nome: "Basilicata",                lat: -23.5588, lng: -46.6479 },
    { id: "bar-original",        nome: "Bar Original",              lat: -23.6030, lng: -46.6660 },
    { id: "teatro-santander",    nome: "Teatro Santander",          lat: -23.5902, lng: -46.6870 },
    { id: "teatro-sesi",         nome: "Teatro Sesi São Paulo",     lat: -23.5645, lng: -46.6527 },
    { id: "cine-joia",           nome: "Cine Joia",                 lat: -23.5576, lng: -46.6339 },
    { id: "teatro-municipal",    nome: "Theatro Municipal",         lat: -23.5453, lng: -46.6389 }
  ];

  const mapa = L.map("mapa");
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapa);

  const pontos = [];
  locais.forEach(l => {
    L.marker([l.lat, l.lng])
      .addTo(mapa)
      .bindPopup(`<strong>${l.nome}</strong><br><a href="#${l.id}">Ver detalhes</a>`);
    pontos.push([l.lat, l.lng]);
  });

  const enquadrar = () => mapa.fitBounds(pontos, { padding: [30, 30] });
  enquadrar();

  document.querySelector('aside[aria-label="Mapa dos locais"] button')
    .addEventListener("click", enquadrar);
});