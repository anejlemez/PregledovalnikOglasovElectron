const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  openSettings: () => ipcRenderer.send("open-settings"),

  onThemeChanged: (callback) =>
    ipcRenderer.on("theme-changed", (_, theme) => callback(theme))
});
