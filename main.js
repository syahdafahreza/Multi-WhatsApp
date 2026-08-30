const { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage, dialog, shell, session, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');

// Enable GPU Hardware Acceleration & Chromium Rendering Optimizations
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-accelerated-2d-canvas');
app.commandLine.appendSwitch('enable-features', 'CanvasOopRasterization,VaapiVideoDecoder');
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');
app.commandLine.appendSwitch('enable-smooth-scrolling');

const userDataPath = app.getPath('userData');
const configPath = path.join(userDataPath, 'config.json');
const windowStatePath = path.join(userDataPath, 'window-state.json');

let mainWindow = null;
let tray = null;
let isQuitting = false;

// Standard modern Google Chrome User-Agent to ensure full WhatsApp Web compatibility
const CHROME_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

// Original App Icon
const iconPath = path.join(__dirname, 'assets', 'icon.png');
const notificationIconPath = path.join(__dirname, 'assets', 'icon-notification.png');

let cachedConfig = {
  tabs: [],
  theme: 'system',
  language: 'en-us',
  privacyBlur: false,
  trayIcon: true,
  closeToTray: false,
  exitPrompt: false,
  tabClosePrompt: true,
  preventEnter: false,
  notificationBadge: true,
  launchMinimized: false,
  autoLaunch: false,
  showSaveDialog: true,
  defaultDownloadDir: ''
};

function readConfigFromDisk() {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf-8');
      const loaded = JSON.parse(data);
      cachedConfig = { ...cachedConfig, ...loaded };
      return cachedConfig;
    }
    // Migration from legacy tabs.json
    const oldTabsPath = path.join(userDataPath, 'tabs.json');
    if (fs.existsSync(oldTabsPath)) {
      const data = fs.readFileSync(oldTabsPath, 'utf-8');
      const tabs = JSON.parse(data);
      cachedConfig.tabs = tabs;
      fs.writeFileSync(configPath, JSON.stringify(cachedConfig, null, 2));
      return cachedConfig;
    }
  } catch (e) {
    console.error('Error reading config:', e);
  }
  return cachedConfig;
}

function saveWindowState(window) {
  if (!window || window.isDestroyed()) return;
  try {
    const isMaximized = window.isMaximized();
    const bounds = window.getNormalBounds();
    const state = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized: isMaximized
    };
    fs.writeFileSync(windowStatePath, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save window state:', e);
  }
}

function getDefaultWindowState() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  let defaultWidth = Math.min(1200, Math.floor(width * 0.8));
  let defaultHeight = Math.min(800, Math.floor(height * 0.8));

  if (width <= 1024) defaultWidth = width - 40;
  if (height <= 768) defaultHeight = height - 40;

  return {
    width: defaultWidth,
    height: defaultHeight,
    isMaximized: false
  };
}

function loadWindowState() {
  try {
    if (fs.existsSync(windowStatePath)) {
      return JSON.parse(fs.readFileSync(windowStatePath, 'utf-8'));
    }
  } catch (e) {
    console.error('Failed to load window state:', e);
  }
  return getDefaultWindowState();
}

function createTray() {
  if (tray) return;

  try {
    const trayImg = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
    tray = new Tray(trayImg);
    tray.setToolTip('Multi-WhatsApp');

    const updateTrayMenu = () => {
      const isId = cachedConfig.language === 'id-id';
      const contextMenu = Menu.buildFromTemplate([
        {
          label: isId ? 'Tampilkan Multi-WhatsApp' : 'Show Multi-WhatsApp',
          click: () => {
            if (mainWindow) {
              if (mainWindow.isMinimized()) mainWindow.restore();
              mainWindow.show();
              mainWindow.focus();
            }
          }
        },
        {
          label: isId ? 'Mulai Chat Baru' : 'Start New Chat',
          click: () => {
            if (mainWindow) {
              if (mainWindow.isMinimized()) mainWindow.restore();
              mainWindow.show();
              mainWindow.focus();
              mainWindow.webContents.send('trigger-new-chat');
            }
          }
        },
        {
          label: isId ? 'Pengaturan' : 'Settings',
          click: () => {
            if (mainWindow) {
              if (mainWindow.isMinimized()) mainWindow.restore();
              mainWindow.show();
              mainWindow.focus();
              mainWindow.webContents.send('trigger-settings');
            }
          }
        },
        { type: 'separator' },
        {
          label: isId ? 'Keluar' : 'Quit',
          click: () => {
            isQuitting = true;
            app.quit();
          }
        }
      ]);
      tray.setContextMenu(contextMenu);
    };

    updateTrayMenu();

    tray.on('click', () => {
      if (!mainWindow) return;
      if (mainWindow.isVisible()) {
        if (mainWindow.isFocused()) {
          mainWindow.hide();
        } else {
          mainWindow.focus();
        }
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    });

    tray.on('double-click', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  } catch (err) {
    console.error('Failed to create system tray:', err);
  }
}

function destroyTray() {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}

function handleWhatsappDeepLinks(argv) {
  const deepLink = argv.find(arg => arg.startsWith('whatsapp://') || arg.startsWith('https://wa.me/'));
  if (deepLink && mainWindow) {
    mainWindow.webContents.send('open-whatsapp-link', deepLink);
  }
}

function createWindow() {
  readConfigFromDisk();
  const state = loadWindowState();

  const windowOptions = {
    width: state.width,
    height: state.height,
    titleBarStyle: 'hidden',
    icon: iconPath,
    titleBarOverlay: {
      color: '#1d1f1f',
      symbolColor: '#ffffff',
      height: 48
    },
    backgroundColor: '#1d1f1f',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      partition: 'persist:main'
    }
  };

  if (state.x !== undefined && state.y !== undefined) {
    windowOptions.x = state.x;
    windowOptions.y = state.y;
  }

  mainWindow = new BrowserWindow(windowOptions);

  if (state.isMaximized) {
    mainWindow.maximize();
  }

  mainWindow.setMenu(null);
  mainWindow.loadFile('index.html');

  if (cachedConfig.launchMinimized) {
    mainWindow.minimize();
    mainWindow.hide();
  }

  if (cachedConfig.trayIcon) {
    createTray();
  }

  mainWindow.on('close', (event) => {
    if (isQuitting) {
      saveWindowState(mainWindow);
      return;
    }

    if (cachedConfig.closeToTray) {
      event.preventDefault();
      saveWindowState(mainWindow);
      mainWindow.hide();
      return;
    }

    if (cachedConfig.exitPrompt) {
      event.preventDefault();
      const isId = cachedConfig.language === 'id-id';
      dialog.showMessageBox(mainWindow, {
        type: 'question',
        buttons: [isId ? 'Keluar' : 'Exit', isId ? 'Batal' : 'Cancel'],
        defaultId: 0,
        cancelId: 1,
        title: isId ? 'Konfirmasi Keluar' : 'Exit Multi-WhatsApp',
        message: isId ? 'Apakah Anda yakin ingin keluar dari Multi-WhatsApp?' : 'Are you sure you want to exit Multi-WhatsApp?'
      }).then(({ response }) => {
        if (response === 0) {
          isQuitting = true;
          saveWindowState(mainWindow);
          destroyTray();
          app.quit();
        }
      });
      return;
    }

    saveWindowState(mainWindow);
    destroyTray();
  });

  // Handle Download management
  mainWindow.webContents.session.on('will-download', (event, item) => {
    const defaultDir = cachedConfig.defaultDownloadDir;
    if (defaultDir && fs.existsSync(defaultDir)) {
      item.setSavePath(path.join(defaultDir, item.getFilename()));
    }
  });

  // Register protocol client
  if (app.isPackaged) {
    app.setAsDefaultProtocolClient('whatsapp');
  }
}

// Single Instance Lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, argv) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
      handleWhatsappDeepLinks(argv);
    }
  });

  app.userAgentFallback = CHROME_USER_AGENT;

  app.whenReady().then(() => {
    if (process.platform === 'win32') {
      app.setAppUserModelId(app.isPackaged ? 'com.umarkov.multiwhatsapp' : 'com.umarkov.multiwhatsapp.dev.' + Date.now());
    }

    // Set Chrome User-Agent across sessions to avoid "WhatsApp works on Google Chrome 100+" error
    session.defaultSession.setUserAgent(CHROME_USER_AGENT);
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
      details.requestHeaders['User-Agent'] = CHROME_USER_AGENT;
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    });

    createWindow();

    if (process.argv.length > 1) {
      handleWhatsappDeepLinks(process.argv);
    }

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

// IPC Handlers
ipcMain.on('save-config', (event, config) => {
  cachedConfig = { ...cachedConfig, ...config };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  if (cachedConfig.trayIcon) {
    createTray();
  } else {
    destroyTray();
  }

  // Update auto launch if changed
  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: !!cachedConfig.autoLaunch,
      path: process.execPath
    });
  }
});

ipcMain.handle('load-config', () => {
  return readConfigFromDisk();
});

ipcMain.on('exit-app', () => {
  isQuitting = true;
  destroyTray();
  app.quit();
});

ipcMain.on('reload-window', () => {
  if (mainWindow) mainWindow.reload();
});

ipcMain.on('toggle-devtools', () => {
  if (mainWindow) mainWindow.webContents.toggleDevTools();
});

ipcMain.on('reset-window', () => {
  if (!mainWindow) return;
  const defaults = getDefaultWindowState();
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  }
  mainWindow.setSize(defaults.width, defaults.height);
  mainWindow.center();

  try {
    if (fs.existsSync(windowStatePath)) {
      fs.unlinkSync(windowStatePath);
    }
  } catch (e) {
    console.error('Failed to delete window state:', e);
  }
});

ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});

ipcMain.on('update-title-bar', (event, color, symbolColor) => {
  if (mainWindow) {
    mainWindow.setTitleBarOverlay({
      color: color,
      symbolColor: symbolColor,
      height: 48
    });
  }
});

// Unread Badge and Notification Count
ipcMain.on('update-badge', (event, totalUnread) => {
  if (!mainWindow || !cachedConfig.notificationBadge) {
    if (mainWindow) mainWindow.setOverlayIcon(null, '');
    if (tray) tray.setImage(nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 }));
    return;
  }

  try {
    if (totalUnread > 0) {
      if (process.platform === 'win32') {
        const notifImg = fs.existsSync(notificationIconPath) ? nativeImage.createFromPath(notificationIconPath) : nativeImage.createFromPath(iconPath);
        mainWindow.setOverlayIcon(notifImg, `${totalUnread} Unread Messages`);
      }
      if (tray) {
        const trayNotifImg = fs.existsSync(notificationIconPath) 
          ? nativeImage.createFromPath(notificationIconPath).resize({ width: 16, height: 16 })
          : nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
        tray.setImage(trayNotifImg);
      }
    } else {
      if (process.platform === 'win32') {
        mainWindow.setOverlayIcon(null, '');
      }
      if (tray) {
        const defaultTrayImg = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
        tray.setImage(defaultTrayImg);
      }
    }
  } catch (err) {
    console.error('Error updating badge overlay:', err);
  }
});

// Select Download Folder Dialog
ipcMain.handle('select-download-dir', async () => {
  if (!mainWindow) return '';
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory']
  });
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return '';
});

// Generic Confirmation Dialog Helper
ipcMain.handle('show-confirm-dialog', async (event, options) => {
  if (!mainWindow) return false;
  const result = await dialog.showMessageBox(mainWindow, {
    type: options.type || 'question',
    buttons: options.buttons || ['Yes', 'No'],
    defaultId: 0,
    cancelId: 1,
    title: options.title || 'Confirm',
    message: options.message || 'Are you sure?'
  });
  return result.response === 0;
});

// Copy Image Data URL / Image Buffer to Clipboard
ipcMain.on('copy-image-to-clipboard', (event, dataUrl) => {
  try {
    if (!dataUrl) return;
    if (dataUrl.startsWith('data:image')) {
      const img = nativeImage.createFromDataURL(dataUrl);
      clipboard.writeImage(img);
    } else if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('blob:')) {
      clipboard.writeText(dataUrl);
    }
  } catch (err) {
    console.error('Error copying image to clipboard:', err);
  }
});

// Trigger download for image / url
ipcMain.on('download-url', (event, url) => {
  if (mainWindow && url) {
    mainWindow.webContents.downloadURL(url);
  }
});

// Webview Input & Link Handling
app.on('web-contents-created', (event, contents) => {
  // Ensure every webview session uses Chrome User-Agent
  contents.setUserAgent(CHROME_USER_AGENT);

  // External link handler
  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle preventEnter on webview input events
  contents.on('before-input-event', (inputEvent, input) => {
    if (!cachedConfig.preventEnter) return;

    if (input.type === 'keyDown' && input.key === 'Enter') {
      if (!input.shift && !input.control && !input.alt && !input.meta) {
        // Send Shift+Enter instead so it inserts a newline
        contents.sendInputEvent({
          type: 'keyDown',
          keyCode: 'Return',
          modifiers: ['shift']
        });
        inputEvent.preventDefault();
      } else if (input.control && !input.shift && !input.alt) {
        // Ctrl+Enter -> Click Send button in WhatsApp Web
        contents.executeJavaScript(`
          (() => {
            const sendBtn = document.querySelector('button[aria-label="Send"], span[data-icon="send"]')?.closest('button');
            if (sendBtn) sendBtn.click();
          })()
        `).catch(() => {});
        inputEvent.preventDefault();
      }
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    if (!cachedConfig.closeToTray) {
      app.quit();
    }
  }
});
