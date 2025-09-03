// types/electron.d.ts
export interface WindowControls {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  isMaximized: () => Promise<boolean>;
}

export interface CortexAPI {
  getVersion: () => Promise<string>;
  signalReady: () => void;
  windowControls: WindowControls;
}

declare global {
  interface Window {
    cortex: CortexAPI;
  }
}

export {};