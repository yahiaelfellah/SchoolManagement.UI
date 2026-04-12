import { app, BrowserWindow, dialog } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import net from 'net'
import { spawn } from 'child_process'
import https from 'https'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isDev = !app.isPackaged
const VITE_DEV_SERVER_URL =
  process.env.VITE_DEV_SERVER_URL ?? 'https://localhost:5173'

let backendProcess = null

function getBackendExePath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'backend', 'SchoolManagement.exe')
  }
  return path.join(process.cwd(), 'resources', 'backend', 'SchoolManagement.exe')
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address()
      const port = typeof addr === 'object' && addr ? addr.port : 0
      server.close(() => resolve(port))
    })
    server.on('error', reject)
  })
}

function waitForDevServer(url, timeoutMs = 120000) {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const tryConnect = () => {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Dev server at ${url} did not respond in time`))
        return
      }
      const req = https.get(url, { rejectUnauthorized: false }, () => {
        req.destroy()
        resolve()
      })
      req.on('error', () => {
        req.destroy()
        setTimeout(tryConnect, 400)
      })
    }
    tryConnect()
  })
}

function killBackend() {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill()
    backendProcess = null
  }
}

async function startBackend(port) {
  const exePath = getBackendExePath()
  if (!fs.existsSync(exePath)) {
    dialog.showErrorBox(
      'Backend not found',
      `Expected executable at:\n${exePath}\n\nPlace SchoolManagement.exe in resources/backend (or rebuild with extraResources).`
    )
    app.quit()
    return false
  }

  backendProcess = spawn(exePath, [], {
    env: {
      ...process.env,
      ASPNETCORE_URLS: `http://127.0.0.1:${port}`,
    },
    stdio: 'ignore',
    windowsHide: true,
  })

  backendProcess.on('error', (err) => {
    dialog.showErrorBox('Backend failed to start', String(err))
    app.quit()
  })

  backendProcess.on('exit', (code, signal) => {
    if (signal === 'SIGTERM' || signal === 'SIGKILL') return
    if (code !== 0 && code !== null) {
      dialog.showErrorBox(
        'Backend exited',
        `SchoolManagement.exe exited with code ${code}.`
      )
    }
  })

  return true
}

async function createWindow(backendPort) {
  const apiBase = `http://127.0.0.1:${backendPort}`

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      // Vite dev server is HTTPS; spawned API is HTTP — allow that combination in dev only.
      allowRunningInsecureContent: isDev,
      additionalArguments: [`--api-base=${apiBase}`],
    },
  })

  if (isDev) {
    if (process.env.ELECTRON_IGNORE_CERTIFICATE_ERRORS !== '0') {
      app.commandLine.appendSwitch('ignore-certificate-errors')
    }
    await waitForDevServer(VITE_DEV_SERVER_URL)
    await win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    const indexHtml = path.join(__dirname, '../dist/index.html')
    await win.loadFile(indexHtml)
  }
}

app.whenReady().then(async () => {
  const port = await getFreePort()
  const ok = await startBackend(port)
  if (!ok) return

  await createWindow(port)

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow(port)
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  killBackend()
})
