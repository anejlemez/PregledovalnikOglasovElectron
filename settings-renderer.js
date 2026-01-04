const themeRadios = document.querySelectorAll("input[name='theme']");

function applyThemeSelection(theme) {
  themeRadios.forEach(r => {
    r.checked = r.value === theme;
  });
}

themeRadios.forEach(radio => {
  radio.addEventListener("change", e => {
    window.api.setTheme(e.target.value);
  });
});

window.api.onThemeChanged(applyThemeSelection);

(async () => {
  const currentTheme = await window.api.getTheme();
  applyThemeSelection(currentTheme);
})();

document.getElementById("btnClose").addEventListener("click", () => {
  window.close();
});
