document.querySelectorAll("input[name='theme']").forEach(radio => {
  radio.addEventListener("change", e => {
    window.api.setTheme(e.target.value);
  });
});

document.getElementById("btnClose").addEventListener("click", () => {
  window.close();
});
