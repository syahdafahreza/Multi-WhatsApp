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
        try {
          return await invoke('confirm_dialog', {
            title: options.title || 'Multi-WhatsApp',
            message: options.message || 'Are you sure?'
          });
        } catch (e) {
          return window.confirm(options.message || 'Are you sure?');
        }
      },
      setModalOpen: (isOpen) => {
        invoke('set_modal_open', { isOpen: !!isOpen }).catch(() => {});
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

    // Custom Webview Element Polyfill for Tauri Native Child Webviews
    class TauriWebviewPolyfill extends HTMLElement {
      constructor() {
        super();
        this._id = '';
        this._src = 'https://web.whatsapp.com';
        this._partition = '';
        this._isMuted = false;
      }

      connectedCallback() {
        const rawId = this.id || `tab-${Date.now()}`;
        const tabId = rawId.replace('webview-', '');
        const isIncognito = (this.partition || '').includes('incognito');
        const targetUrl = this.src || 'https://web.whatsapp.com';

        invoke('create_tab_webview', {
          tabId: tabId,
          isIncognito: isIncognito,
          url: targetUrl
        }).catch(err => console.error('Failed to create native tab webview:', err));

        // Fire dom-ready event to trigger injections in renderer.js
        setTimeout(() => {
          this.dispatchEvent(new Event('dom-ready'));
        }, 400);
      }

      disconnectedCallback() {
        const rawId = this.id || '';
        const tabId = rawId.replace('webview-', '');
        if (tabId) {
          invoke('close_tab_webview', { tabId }).catch(() => {});
        }
      }

      get src() {
        return this._src;
      }

      set src(url) {
        this._src = url;
        const tabId = (this.id || '').replace('webview-', '');
        if (tabId && url) {
          invoke('load_url_tab_webview', { tabId, url }).catch(() => {});
        }
      }

      get partition() {
        return this._partition;
      }

      set partition(p) {
        this._partition = p;
      }

      executeJavaScript(script) {
        const tabId = (this.id || '').replace('webview-', '');
        if (!tabId) return Promise.resolve();
        return invoke('eval_tab_webview', { tabId, script });
      }

      reload() {
        const tabId = (this.id || '').replace('webview-', '');
        if (tabId) {
          invoke('reload_tab_webview', { tabId }).catch(() => {});
        }
      }

      setAudioMuted(muted) {
        this._isMuted = muted;
        const tabId = (this.id || '').replace('webview-', '');
        if (tabId) {
          invoke('set_tab_muted', { tabId, muted: !!muted }).catch(() => {});
        }
      }

      setZoomFactor(factor) {
        const tabId = (this.id || '').replace('webview-', '');
        if (tabId) {
          invoke('set_tab_zoom', { tabId, factor: factor || 1.0 }).catch(() => {});
        }
      }

      focus() {
        const tabId = (this.id || '').replace('webview-', '');
        if (tabId) {
          invoke('switch_tab_webview', { tabId }).catch(() => {});
        }
      }
    }

    if (!window.customElements.get('webview')) {
      window.customElements.define('webview', TauriWebviewPolyfill);
    }

    // Auto-resize native child webviews on window resize
    window.addEventListener('resize', () => {
      invoke('resize_tab_webviews', {
        width: window.innerWidth,
        height: window.innerHeight
      }).catch(() => {});
    });

    // Wire Window Control Buttons
    document.addEventListener('DOMContentLoaded', () => {
      const minBtn = document.getElementById('win-min-btn');
      const maxBtn = document.getElementById('win-max-btn');
      const closeBtn = document.getElementById('win-close-btn');

      if (minBtn) {
        minBtn.addEventListener('click', () => invoke('minimize_window').catch(() => {}));
      }
      if (maxBtn) {
        maxBtn.addEventListener('click', () => invoke('toggle_maximize_window').catch(() => {}));
      }
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          if (window.electronAPI && window.electronAPI.exit) {
            window.electronAPI.exit();
          } else {
            invoke('close_window').catch(() => {});
          }
        });
      }
    });
  }
})();
