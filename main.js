const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

const userDataPath = app.getPath('userData');
const configPath = path.join(userDataPath, 'config.json');
const windowStatePath = path.join(userDataPath, 'window-state.json');

function saveWindowState(window) {
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

function loadWindowState() {
  try {
    if (fs.existsSync(windowStatePath)) {
      return JSON.parse(fs.readFileSync(windowStatePath, 'utf-8'));
    }
  } catch (e) {
    console.error('Failed to load window state:', e);
  }

  // Get screen dimensions from the primary display's work area
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  // Calculate a responsive default size: 80% of screen size, up to a max of 1200x800
  let defaultWidth = Math.min(1200, Math.floor(width * 0.8));
  let defaultHeight = Math.min(800, Math.floor(height * 0.8));

  // For very small screens (like 800x600), use almost the full screen with a small margin
  if (width <= 1024) defaultWidth = width - 40;
  if (height <= 768) defaultHeight = height - 40;

  return {
    width: defaultWidth,
    height: defaultHeight,
    isMaximized: false
  };
}

function createWindow() {
  const state = loadWindowState();

  const windowOptions = {
    width: state.width,
    height: state.height,
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    titleBarOverlay: {
      color: '#00a884',
      symbolColor: '#ffffff',
      height: 40
    },
    backgroundColor: '#1d1f1f',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      partition: 'persist:main' // For main window
    }
  };

  if (state.x !== undefined && state.y !== undefined) {
    windowOptions.x = state.x;
    windowOptions.y = state.y;
  }

  const mainWindow = new BrowserWindow(windowOptions);

  if (state.isMaximized) {
    mainWindow.maximize();
  }

  mainWindow.setMenu(null);
  mainWindow.loadFile('index.html');

  mainWindow.on('close', () => {
    saveWindowState(mainWindow);
  });

  // Handle saving configuration
  ipcMain.on('save-config', (event, config) => {
    fs.writeFileSync(configPath, JSON.stringify(config));
  });

  // Handle loading configuration
  ipcMain.handle('load-config', () => {
    try {
      if (fs.existsSync(configPath)) {
        const data = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(data);
      }
      // Migration from old tabs.json if it exists
      const oldTabsPath = path.join(userDataPath, 'tabs.json');
      if (fs.existsSync(oldTabsPath)) {
        const data = fs.readFileSync(oldTabsPath, 'utf-8');
        const tabs = JSON.parse(data);
        const config = { tabs, theme: 'system', language: 'en-us' };
        fs.writeFileSync(configPath, JSON.stringify(config));
        // Optionally delete old file
        // fs.unlinkSync(oldTabsPath);
        return config;
      }
    } catch (e) {
      console.error('Error reading configuration:', e);
    }
    return { tabs: [], theme: 'system', language: 'en-us' }; // Default config
  });

  ipcMain.on('exit-app', () => {
    app.quit();
  });
  
  ipcMain.on('reload-window', () => {
    mainWindow.reload();
  });
  
  ipcMain.on('toggle-devtools', () => {
    mainWindow.webContents.toggleDevTools();
  });
  
  ipcMain.on('open-external', (event, url) => {
    require('electron').shell.openExternal(url);
  });

  ipcMain.on('update-title-bar', (event, color, symbolColor) => {
    mainWindow.setTitleBarOverlay({
      color: color,
      symbolColor: symbolColor,
      height: 40
    });
  });

  // Open external links in default browser instead of the webview
  app.on('web-contents-created', (event, contents) => {
      contents.setWindowOpenHandler(({ url }) => {
          require('electron').shell.openExternal(url);
          return { action: 'deny' };
      });
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
