const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveConfig: (config) => ipcRenderer.send('save-config', config),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  exit: () => ipcRenderer.send('exit-app'),
  reload: () => ipcRenderer.send('reload-window'),
  toggleDevTools: () => ipcRenderer.send('toggle-devtools'),
  openExternal: (url) => ipcRenderer.send('open-external', url),
  setTitleBarColor: (color, symbolColor) => ipcRenderer.send('update-title-bar', color, symbolColor),
  resetWindow: () => ipcRenderer.send('reset-window')
});
