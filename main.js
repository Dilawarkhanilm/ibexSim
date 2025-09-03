const {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  screen,
} = require("electron");
const path = require("path");

const isDev = process.env.NODE_ENV === "development";
const MIN_SPLASH_MS = 6000;
const RENDERER_READY_TIMEOUT_MS = isDev ? 20000 : 12000;

let splash, mainWindow;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
let resolveRendererReady;
const rendererReady = new Promise((res) => (resolveRendererReady = res));

// ----- Splash -----
function createSplash() {
  splash = new BrowserWindow({
    width: 1100,
    height: 640,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    hasShadow: false,
    alwaysOnTop: true,
    resizable: false,
    show: false,
  });
  splash.setHasShadow?.(false);
  splash.setAlwaysOnTop(true, "screen-saver");
  splash.loadFile(path.join(__dirname, "splash.html"));
  splash.once("ready-to-show", () => splash.show());
}

// ----- Main window -----
function createMainWindow() {
  const display = splash
    ? screen.getDisplayMatching(splash.getBounds())
    : screen.getPrimaryDisplay();
  const wa = display.workArea;

  mainWindow = new BrowserWindow({
    x: wa.x,
    y: wa.y,
    width: wa.width,
    height: wa.height,
    show: false,
    frame: false, // Remove default frame for custom title bar
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#1f2937" : "#ffffff",
    autoHideMenuBar: true,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // Need to disable sandbox for window controls
    },
  });

  if (isDev) mainWindow.loadURL("http://localhost:5173");
  else
    mainWindow.loadFile(path.join(__dirname, "Frontend", "dist", "index.html"));

  // Fallback "ready" if renderer never signals
  mainWindow.webContents.once("did-finish-load", () => {
    if (resolveRendererReady) resolveRendererReady();
  });

  // Wait splash-min + renderer-ready, then show main and close splash
  (async () => {
    const safeRendererReady = Promise.race([
      rendererReady,
      delay(RENDERER_READY_TIMEOUT_MS),
    ]);

    await Promise.all([delay(MIN_SPLASH_MS), safeRendererReady]);
    if (mainWindow?.isDestroyed()) return;

    // Place mainWindow on same display as splash and maximize
    const d = splash
      ? screen.getDisplayMatching(splash.getBounds())
      : screen.getDisplayMatching(mainWindow.getBounds());
    mainWindow.setBounds(d.workArea);

    // Optional: maximize (keeps taskbar visible)
    mainWindow.maximize();

    mainWindow.show();
    mainWindow.focus();

    if (splash && !splash.isDestroyed()) splash.close();
  })();
}

// Window control handlers
ipcMain.on("window-minimize", () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on("window-maximize", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on("window-close", () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle("window-is-maximized", () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// Renderer handshake
ipcMain.on("renderer:ready", () => {
  if (resolveRendererReady) resolveRendererReady();
});
ipcMain.handle("app:get-version", () => app.getVersion());

app.whenReady().then(() => {
  createSplash();
  createMainWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createSplash();
    createMainWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
