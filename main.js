const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({ width: 800, height: 600 });
  win.loadURL("data:text/html,<h1>Electron dela!</h1>");
}

app.whenReady().then(createWindow);