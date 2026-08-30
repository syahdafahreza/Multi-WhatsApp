const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveConfig: (config) => ipcRenderer.send('save-config', config),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  exit: () => ipcRenderer.send('exit-app'),
  reload: () => ipcRenderer.send('reload-window'),
  toggleDevTools: () => ipcRenderer.send('toggle-devtools'),
  openExternal: (url) => ipcRenderer.send('open-external', url),
  setTitleBarColor: (color, symbolColor) => ipcRenderer.send('update-title-bar', color, symbolColor),
  resetWindow: () => ipcRenderer.send('reset-window'),
  updateBadge: (totalUnread) => ipcRenderer.send('update-badge', totalUnread),
  selectDownloadDir: () => ipcRenderer.invoke('select-download-dir'),
  showConfirmDialog: (options) => ipcRenderer.invoke('show-confirm-dialog', options),
  copyImageToClipboard: (dataUrl) => ipcRenderer.send('copy-image-to-clipboard', dataUrl),
  downloadURL: (url) => ipcRenderer.send('download-url', url),
  
  // Listeners from main process
  onTriggerNewChat: (callback) => {
    ipcRenderer.on('trigger-new-chat', () => callback());
  },
  onTriggerSettings: (callback) => {
    ipcRenderer.on('trigger-settings', () => callback());
  },
  onOpenWhatsAppLink: (callback) => {
    ipcRenderer.on('open-whatsapp-link', (event, url) => callback(url));
  }
});
