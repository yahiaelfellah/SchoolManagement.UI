/// <reference types="vite/client" />

declare global {
  interface Window {
    /** Set by Electron preload when the desktop app spawns the local API. */
    __ELECTRON_API_BASE__?: string
  }

  interface ImportMetaEnv {
    readonly VITE_API_BASE?: string
  }
}

export {}
