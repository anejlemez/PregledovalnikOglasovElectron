let ads = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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

let filteredAds = [...ads];
let editingAdId = null;


function formatEur(x) {
  return `${Number(x).toLocaleString("sl-SI")} €`;
}

function formatKm(x) {
  return `${Number(x).toLocaleString("sl-SI")} km`;
}


function renderAds() {
  const container = document.getElementById("adsContainer");
  container.innerHTML = "";

  if (filteredAds.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; padding: 40px; text-align: center; color: #999;">Ni oglasov za prikaz</div>';
    updateAdsCount();
    return;
  }

  for (const a of filteredAds) {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <img class="thumb" src="${a.slika}" alt="slika oglasa" onerror="this.src='https://via.placeholder.com/180x120?text=Ni+slike'">
      <div class="info">
        <div class="name">${a.naziv}</div>
        <div class="meta">
          <span class="meta-item">${a.znamka}</span>
          <span class="meta-item">${a.model}</span>
          <span class="meta-item">${a.letnik}</span>
          <span class="meta-item">${formatKm(a.kilometri)}</span>
          <span class="meta-item">${a.gorivo}</span>
          <span class="meta-item">${a.menjalnik}</span>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
        <div class="price">${formatEur(a.cena)}</div>
      </div>
    `;

    container.appendChild(card);
  }

  updateAdsCount();
}

function updateAdsCount() {
  const count = filteredAds.length;
  let text = "oglas";
  if (count === 0) text = "oglasov";
  else if (count === 1) text = "oglas";
  else if (count === 2 || count === 3 || count === 4) text = "oglasi";
  else text = "oglasov";
  
  document.getElementById("adsCount").textContent = `${count} ${text}`;
}


function applyFilters() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const brand = document.getElementById("filterBrand").value;
  const fuel = document.getElementById("filterFuel").value;
  const transmission = document.getElementById("filterTransmission").value;
  const yearFrom = parseInt(document.getElementById("filterYearFrom").value) || 0;
  const yearTo = parseInt(document.getElementById("filterYearTo").value) || 9999;
  const maxPrice = parseInt(document.getElementById("filterMaxPrice").value) || 999999999;

  filteredAds = ads.filter(a => {
    const matchesSearch = a.naziv.toLowerCase().includes(search) || a.znamka.toLowerCase().includes(search) || a.model.toLowerCase().includes(search);
    const matchesBrand = !brand || a.znamka === brand;
    const matchesFuel = !fuel || a.gorivo === fuel;
    const matchesTransmission = !transmission || a.menjalnik === transmission;
    const matchesYear = a.letnik >= yearFrom && a.letnik <= yearTo;
    const matchesPrice = a.cena <= maxPrice;

    return matchesSearch && matchesBrand && matchesFuel && matchesTransmission && matchesYear && matchesPrice;
  });

  renderAds();
}


function populateBrandFilter() {
  const brands = [...new Set(ads.map(a => a.znamka))].sort();
  const select = document.getElementById("filterBrand");
  brands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    select.appendChild(option);
  });
}

// ===== SAVE ADS =====
function saveAds() {
  window.api.saveAds(ads);
}


document.getElementById("btnLoad").addEventListener("click", async () => {
  const res = await window.api.loadAdsFromDialog();
  if (res.ok) {
    setAds(res.ads);
  } else if (res.reason === "invalid_json") {
    alert("Datoteka ni veljavna JSON datoteka.");
  } else if (res.reason === "invalid_structure") {
    alert("JSON nima pravilne strukture. Manjkajo lastnosti ali je premalo elementov.");
  }
});

document.getElementById("btnSettings").addEventListener("click", () => {
  window.api.openSettings();
});

document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("filterBrand").addEventListener("change", applyFilters);
document.getElementById("filterFuel").addEventListener("change", applyFilters);
document.getElementById("filterTransmission").addEventListener("change", applyFilters);
document.getElementById("filterYearFrom").addEventListener("input", applyFilters);
document.getElementById("filterYearTo").addEventListener("input", applyFilters);
document.getElementById("filterMaxPrice").addEventListener("input", applyFilters);

document.getElementById("btnResetFilters").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  document.getElementById("filterBrand").value = "";
  document.getElementById("filterFuel").value = "";
  document.getElementById("filterTransmission").value = "";
  document.getElementById("filterYearFrom").value = "";
  document.getElementById("filterYearTo").value = "";
  document.getElementById("filterMaxPrice").value = "";
  applyFilters();
});

window.api.onThemeChanged(theme => {
  const link = document.querySelector("link[rel='stylesheet']");
  link.href = theme === "dark" ? "styles-dark.css" : "styles-light.css";
});


function setAds(newAds) {
  ads = newAds;
  populateBrandFilter();
  applyFilters();
  saveAds();
}

(async () => {
  const saved = await window.api.getSavedAds();
  if (saved.ok) {
    ads = saved.ads;
    populateBrandFilter();
    applyFilters();
  } else {
    populateBrandFilter();
    renderAds();
  }
})();