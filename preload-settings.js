const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  setTheme: (theme) => ipcRenderer.send("set-theme", theme),
  getTheme: () => ipcRenderer.invoke("theme:get"),
  onThemeChanged: (callback) => ipcRenderer.on("theme-changed", (_, theme) => callback(theme))
});
