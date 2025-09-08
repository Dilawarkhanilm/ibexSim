const {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  screen,
} = require("electron");
const path = require("path");
const fs = require("fs");

const isDev = process.env.NODE_ENV === "development";
const MIN_SPLASH_MS = 6000;
const RENDERER_READY_TIMEOUT_MS = isDev ? 20000 : 12000;

let splash, mainWindow;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
let resolveRendererReady;
const rendererReady = new Promise((res) => (resolveRendererReady = res));

// Function to detect Vite dev server port
async function getViteDevPort() {
  const maxAttempts = 10;
  const startPort = 5173;

  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    try {
      const response = await fetch(`http://localhost:${port}`);
      if (response.ok) {
        console.log(`Found Vite dev server running on port ${port}`);
        return port;
      }
    } catch (error) {
      // Port not available or no server running
      continue;
    }
  }

  // Fallback: try to read from Vite's temp file (if available)
  try {
    const tempFile = path.join(
      __dirname,
      "Frontend",
      "node_modules",
      ".vite",
      "dev-server-url.txt"
    );
    if (fs.existsSync(tempFile)) {
      const url = fs.readFileSync(tempFile, "utf8").trim();
      const match = url.match(/:(\d+)/);
      if (match) {
        const port = parseInt(match[1]);
        console.log(`Found Vite port from temp file: ${port}`);
        return port;
      }
    }
  } catch (error) {
    console.log("Could not read Vite temp file");
  }

  // Final fallback
  return 5173;
}

// Alternative method: Check package.json script or environment
function getDevServerUrl() {
  // Check if VITE_DEV_PORT environment variable is set
  const envPort = process.env.VITE_DEV_PORT;
  if (envPort) {
    return `http://localhost:${envPort}`;
  }

  // Default fallback
  return "http://localhost:5173";
}

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
async function createMainWindow() {
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

  if (isDev) {
    // Dynamic port detection for development
    try {
      const port = await getViteDevPort();
      const devUrl = `http://localhost:${port}`;
      console.log(`Loading Electron with dev server at: ${devUrl}`);
      await mainWindow.loadURL(devUrl);
    } catch (error) {
      console.error("Failed to detect Vite dev server port:", error);
      // Fallback to default port
      await mainWindow.loadURL("http://localhost:5173");
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, "Frontend", "dist", "index.html"));
  }

  // Fallback "ready" if renderer never signals
  mainWindow.webContents.once("did-finish-load", () => {
    if (resolveRendererReady) resolveRendererReady();
  });

  // Handle load failures in development
  mainWindow.webContents.once(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      if (isDev) {
        console.error(
          `Failed to load renderer: ${errorDescription} (${errorCode})`
        );
        console.log(
          "Make sure the Vite dev server is running with 'npm run dev:renderer'"
        );

        // Show error page or retry logic could go here
        const errorHtml = `
        <html>
          <head><title>Dev Server Connection Error</title></head>
          <body style="font-family: Arial; padding: 20px; background: #1f2937; color: white;">
            <h2>⚠️ Cannot connect to development server</h2>
            <p>Make sure the Vite dev server is running:</p>
            <pre style="background: #374151; padding: 10px; border-radius: 4px;">cd Frontend && npm run dev</pre>
            <p>Or run the full development command:</p>
            <pre style="background: #374151; padding: 10px; border-radius: 4px;">npm run dev</pre>
            <p><small>Error: ${errorDescription} (Code: ${errorCode})</small></p>
            <button onclick="location.reload()" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">Retry</button>
          </body>
        </html>
      `;
        mainWindow.loadURL(
          `data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`
        );
      }
    }
  );

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
