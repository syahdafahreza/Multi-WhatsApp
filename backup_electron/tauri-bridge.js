// Tauri <-> Electron Compatibility Bridge
(() => {
  if (window.__TAURI__ || window.__TAURI_INTERNALS__) {
    const invoke = window.__TAURI__.core ? window.__TAURI__.core.invoke : window.__TAURI__.invoke;

    window.electronAPI = {
      saveConfig: async (config) => {
        try {
          return await invoke('save_config', { config });
        } catch (e) {
          localStorage.setItem('mw_config', JSON.stringify(config));
        }
      },
      loadConfig: async () => {
        try {
          return await invoke('load_config');
        } catch (e) {
          const cached = localStorage.getItem('mw_config');
          return cached ? JSON.parse(cached) : null;
        }
      },
      exit: () => invoke('exit_app').catch(() => {}),
      reload: () => invoke('reload_window').catch(() => window.location.reload()),
      toggleDevTools: () => {},
      openExternal: (url) => invoke('open_external', { url }).catch(() => window.open(url, '_blank')),
      setTitleBarColor: () => {},
      resetWindow: () => invoke('reset_window').catch(() => {}),
      updateBadge: () => {},
      selectDownloadDir: async () => '',
      showConfirmDialog: async (options) => {
        return window.confirm(options.message || 'Are you sure?');
      },
      copyImageToClipboard: async (dataUrl) => {
        try {
          if (navigator.clipboard && window.ClipboardItem) {
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
          }
        } catch (e) {
          console.error('Clipboard error:', e);
        }
      },
      downloadURL: (url) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'download';
        a.click();
      },
      onTriggerNewChat: (callback) => {},
      onTriggerSettings: (callback) => {},
      onOpenWhatsAppLink: (callback) => {}
    };
  }
})();
