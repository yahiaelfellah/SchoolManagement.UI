const { contextBridge } = require('electron')

const prefix = '--api-base='
const arg = process.argv.find((a) => a.startsWith(prefix))
const apiBase = arg ? arg.slice(prefix.length) : ''

contextBridge.exposeInMainWorld('__ELECTRON_API_BASE__', apiBase)
