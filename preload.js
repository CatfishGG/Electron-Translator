const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  translateText: (data) => ipcRenderer.invoke('translate-text', data),
  detectLanguage: (data) => ipcRenderer.invoke('detect-language', data)
});
