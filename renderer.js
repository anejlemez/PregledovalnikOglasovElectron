const ads = [
  {
    naziv: "Audi A4 2.0 TDI",
    cena: 12900,
    letnik: 2018,
    kilometri: 145000,
    gorivo: "Dizel",
    znamka: "Audi",
    model: "A4",
    menjalnik: "Ročni",
    slika: "https://assets.adac.de/image/upload/v1/Autodatenbank/Fahrzeugbilder/im05628-1-audi-a4.jpg"
  },
  {
    naziv: "BMW 320d xDrive",
    cena: 15900,
    letnik: 2019,
    kilometri: 120000,
    gorivo: "Dizel",
    znamka: "BMW",
    model: "320d",
    menjalnik: "Avtomatski",
    slika: "https://th.bing.com/th/id/OIP.kXUX0qyJyL8EbvX_nCrtwwHaFj?w=245&h=184&c=7&r=0&o=7&pid=1.7&rm=3"
  },
  {
    naziv: "Volkswagen Golf 1.6 TDI",
    cena: 8900,
    letnik: 2016,
    kilometri: 175000,
    gorivo: "Dizel",
    znamka: "Volkswagen",
    model: "Golf",
    menjalnik: "Ročni",
    slika: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/2020_Volkswagen_Golf_Style_1.5_Front.jpg/1200px-2020_Volkswagen_Golf_Style_1.5_Front.jpg"
  }
];

function formatEur(x) {
  return `${Number(x).toLocaleString("sl-SI")} €`;
}
function formatKm(x) {
  return `${Number(x).toLocaleString("sl-SI")} km`;
}

function renderAds() {
  const container = document.getElementById("adsContainer");
  container.innerHTML = "";

  for (const a of ads) {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <img class="thumb" src="${a.slika}" alt="slika oglasa">
      <div class="info">
        <div class="name">${a.naziv}</div>
        <div class="meta">
          ${a.znamka} · ${a.model} · ${a.letnik} · ${formatKm(a.kilometri)} · ${a.gorivo} · ${a.menjalnik}
        </div>
      </div>
      <div class="price">${formatEur(a.cena)}</div>
    `;

    container.appendChild(card);
  }
}

document.getElementById("btnSettings").addEventListener("click", () => {
  window.api.openSettings();
});

window.api.onThemeChanged(theme => {
  const link = document.querySelector("link[rel='stylesheet']");
  link.href = theme === "dark" ? "styles-dark.css" : "styles-light.css";
});


renderAds();