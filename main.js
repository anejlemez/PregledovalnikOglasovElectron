const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
let currentTheme = "light";

function getSavedAdsPath() {
  return path.join(app.getPath("userData"), "lastAds.json");
}

function validateAds(data) {
  if (!Array.isArray(data) || data.length < 2) return false;
  const required = ["naziv", "cena", "letnik", "kilometri", "gorivo", "znamka", "model", "menjalnik", "slika"];
  return data.every(x => required.every(k => Object.prototype.hasOwnProperty.call(x, k)));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.loadFile("index.html");
}

ipcMain.on("open-settings", () => {
  const settingsWindow = new BrowserWindow({
    width: 400,
    height: 300,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, "preload-settings.js")
    }
  });

  settingsWindow.loadFile("settings.html");
});

ipcMain.on("set-theme", (_, theme) => {
  currentTheme = theme;
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send("theme-changed", theme);
  });
});

ipcMain.handle("theme:get", () => currentTheme);

// Naloži JSON preko dialoga
ipcMain.handle("ads:loadFromDialog", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "Izberi JSON z oglasi",
    properties: ["openFile"],
    filters: [{ name: "JSON", extensions: ["json"] }]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return { ok: false, reason: "canceled" };
  }

  const filePath = result.filePaths[0];

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    if (!validateAds(data)) return { ok: false, reason: "invalid_structure" };

    fs.writeFileSync(getSavedAdsPath(), JSON.stringify(data, null, 2), "utf-8");
    return { ok: true, ads: data };
  } catch {
    return { ok: false, reason: "invalid_json" };
  }
});

// Auto-load zadnjih oglasov
ipcMain.handle("ads:getSaved", async () => {
  try {
    const p = getSavedAdsPath();
    if (!fs.existsSync(p)) return { ok: false };

    const raw = fs.readFileSync(p, "utf-8");
    const data = JSON.parse(raw);

    if (!validateAds(data)) return { ok: false };
    return { ok: true, ads: data };
  } catch {
    return { ok: false };
  }
});

app.whenReady().then(createWindow);
