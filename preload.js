const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (...args) => ipcRenderer.send(...args),
  on: (...args) => ipcRenderer.on(...args),
  off: (...args) => ipcRenderer.off(...args),
  listenerCount: (...args) => ipcRenderer.listenerCount(...args),
});
