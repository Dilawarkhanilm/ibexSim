const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("cortex", {
  getVersion: () => ipcRenderer.invoke("app:get-version"),
  signalReady: () => ipcRenderer.send("renderer:ready"),

  // Window controls
  windowControls: {
    minimize: () => ipcRenderer.send("window-minimize"),
    maximize: () => ipcRenderer.send("window-maximize"),
    close: () => ipcRenderer.send("window-close"),
    isMaximized: () => ipcRenderer.invoke("window-is-maximized"),
  },
});
