const path = require("path");

const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow;
let currentTheme = "light";

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
  mainWindow.webContents.send("theme-changed", theme);
});

app.whenReady().then(createWindow);
