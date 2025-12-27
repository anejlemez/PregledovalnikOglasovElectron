const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("api", {
  openSettings: () => ipcRenderer.send("open-settings"),

  loadAdsFromDialog: () => ipcRenderer.invoke("ads:loadFromDialog"),
  getSavedAds: () => ipcRenderer.invoke("ads:getSaved"),
  saveAds: (ads) => ipcRenderer.invoke("ads:save", ads),

  onThemeChanged: (callback) =>
    ipcRenderer.on("theme-changed", (_, theme) => callback(theme))
});
