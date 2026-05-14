let config = {
  tabs: [],
  theme: 'system',
  language: 'en-us'
};
let activeTabId = null;
let editingTabId = null;
let draggedTabId = null;
let tabLoadedStates = {};
let tabMediaStates = {};

function updateOverlaysVisibility() {
  const isLoaded = activeTabId && tabLoadedStates[activeTabId];
  const isMediaOpen = activeTabId && tabMediaStates[activeTabId];
  
  // Only show overlays if loaded AND media is NOT open
  const shouldShow = isLoaded && !isMediaOpen;
  const display = shouldShow ? 'block' : 'none';
  
  const innerCurve = document.getElementById('inner-curve-overlay');
  const chatBorder = document.getElementById('chat-border-overlay');
  
  if (innerCurve) innerCurve.style.display = display;
  if (chatBorder) chatBorder.style.display = display;
  
  if (viewsContainer) {
    if (shouldShow) {
      viewsContainer.classList.add('is-loaded');
    } else {
      viewsContainer.classList.remove('is-loaded');
    }
  }
}

const WHATSAPP_URL = 'https://web.whatsapp.com';

const translations = {
  'en-us': {
    'menu-file': 'File',
    'menu-new-tab': 'New Tab',
    'menu-settings': 'Settings',
    'menu-exit': 'Exit',
    'menu-edit': 'Edit',
    'menu-undo': 'Undo',
    'menu-redo': 'Redo',
    'menu-cut': 'Cut',
    'menu-copy': 'Copy',
    'menu-paste': 'Paste',
    'menu-view': 'View',
    'menu-reload': 'Reload',
    'menu-devtools': 'Developer Tools',
    'menu-help': 'Help',
    'menu-help-item': 'Help',
    'menu-about': 'About',
    'edit-tab-title': 'Edit Tab Name',
    'save': 'Save',
    'cancel': 'Cancel',
    'settings-title': 'Settings',
    'theme-label': 'Theme',
    'theme-system': 'System',
    'theme-light': 'Light',
    'theme-dark': 'Dark',
    'language-label': 'Language',
    'save-settings': 'Save',
    'close-settings': 'Close',
    'close-about': 'Close',
    'about-desc': 'Multi-WhatsApp is a lightweight, multi-tab desktop application built with Electron that allows you to manage multiple WhatsApp accounts simultaneously in a single window. Perfect for users who need to handle personal, work, and business accounts without switching browsers or profiles.',
    'ctx-rename': 'Rename Tab',
    'ctx-close': 'Close Tab',
    'ctx-reload': 'Reload Tab',
    'window-label': 'Window Management',
    'reset-window': 'Reset Window Size & Position'
  },
  'id-id': {
    'menu-file': 'Berkas',
    'menu-new-tab': 'Tab Baru',
    'menu-settings': 'Pengaturan',
    'menu-exit': 'Keluar',
    'menu-edit': 'Edit',
    'menu-undo': 'Batal',
    'menu-redo': 'Ulangi',
    'menu-cut': 'Potong',
    'menu-copy': 'Salin',
    'menu-paste': 'Tempel',
    'menu-view': 'Tampilan',
    'menu-reload': 'Muat Ulang',
    'menu-devtools': 'Alat Pengembang',
    'menu-help': 'Bantuan',
    'menu-help-item': 'Bantuan',
    'menu-about': 'Tentang',
    'edit-tab-title': 'Edit Nama Tab',
    'save': 'Simpan',
    'cancel': 'Batal',
    'settings-title': 'Pengaturan',
    'theme-label': 'Tema',
    'theme-system': 'Sistem',
    'theme-light': 'Terang',
    'theme-dark': 'Gelap',
    'language-label': 'Bahasa',
    'save-settings': 'Simpan',
    'close-settings': 'Tutup',
    'close-about': 'Tutup',
    'about-desc': 'Multi-WhatsApp adalah aplikasi desktop multi-tab ringan berbasis Electron yang memungkinkan Anda mengelola beberapa akun WhatsApp secara bersamaan dalam satu jendela. Sangat cocok bagi pengguna yang perlu menangani akun pribadi, pekerjaan, dan bisnis tanpa harus berganti browser atau profil.',
    'ctx-rename': 'Ubah Nama Tab',
    'ctx-close': 'Tutup Tab',
    'ctx-reload': 'Muat Ulang Tab',
    'window-label': 'Manajemen Jendela',
    'reset-window': 'Atur Ulang Ukuran & Posisi Jendela'
  }
};

const tabsBar = document.getElementById('tabs-bar');
const viewsContainer = document.getElementById('views-container');
const addTabBtn = document.getElementById('add-tab-btn');
const scrollLeftBtn = document.getElementById('scroll-left-btn');
const scrollRightBtn = document.getElementById('scroll-right-btn');

// Modal elements
const editModal = document.getElementById('edit-modal');
const tabNameInput = document.getElementById('tab-name-input');
const saveTabNameBtn = document.getElementById('save-tab-name');
const cancelTabNameBtn = document.getElementById('cancel-tab-name');

const aboutModal = document.getElementById('about-modal');
const closeAboutBtn = document.getElementById('close-about');

const settingsModal = document.getElementById('settings-modal');
const themeSelect = document.getElementById('theme-select');
const languageSelect = document.getElementById('language-select');
const saveSettingsBtn = document.getElementById('save-settings');
const closeSettingsBtn = document.getElementById('close-settings');

// Menu elements
const hamburgerBtn = document.getElementById('hamburger-btn');
const menuDropdown = document.getElementById('menu-dropdown');
const tabContextMenu = document.getElementById('tab-context-menu');
let contextMenuTabId = null;

// Load saved config or create a default one
async function init() {
  const savedConfig = await window.electronAPI.loadConfig();
  
  if (savedConfig) {
    config = savedConfig;
    // Ensure tabs is an array
    if (!Array.isArray(config.tabs)) config.tabs = [];
    
    config.tabs.forEach(tab => createTabElements(tab));
    if (config.tabs.length > 0) {
      switchTab(config.tabs[0].id);
    } else {
      addNewTab();
    }
  } else {
    addNewTab();
  }

  applyTheme(config.theme);
  applyLanguage(config.language);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (config.theme === 'system') {
      applyTheme('system');
    }
  });

  // Initial scroll button check
  setTimeout(updateScrollButtonsVisibility, 100);
}

function updateScrollButtonsVisibility() {
  const hasOverflow = tabsBar.scrollWidth > tabsBar.clientWidth;
  
  if (hasOverflow) {
    scrollLeftBtn.style.display = 'flex';
    scrollRightBtn.style.display = 'flex';
    
    // Enable/disable based on scroll position
    // Use a small buffer (1px) for floating point precision issues
    scrollLeftBtn.disabled = tabsBar.scrollLeft <= 1;
    scrollRightBtn.disabled = tabsBar.scrollLeft + tabsBar.clientWidth >= tabsBar.scrollWidth - 1;
  } else {
    scrollLeftBtn.style.display = 'none';
    scrollRightBtn.style.display = 'none';
  }
}

function saveConfig() {
  window.electronAPI.saveConfig(config);
}

function applyTheme(theme) {
  let activeTheme = theme;
  if (theme === 'system') {
    activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', activeTheme);
  
  // Update native title bar overlay
  const barColor = activeTheme === 'dark' ? '#1d1f1f' : '#F7F5F3';
  const symbolColor = activeTheme === 'dark' ? '#ffffff' : '#111b21';
  window.electronAPI.setTitleBarColor(barColor, symbolColor);
}

function applyLanguage(lang) {
  const t = translations[lang] || translations['en-us'];
  Object.keys(t).forEach(key => {
    const el = document.getElementById(`lang-${key}`);
    if (el) {
      el.textContent = t[key];
    }
  });
}

function generateId() {
  return 'tab_' + Math.random().toString(36).substr(2, 9);
}

function addNewTab() {
  const id = generateId();
  const newTab = {
    id: id,
    name: `WhatsApp ${config.tabs.length + 1}`,
    partition: `persist:whatsapp_${id}`
  };
  
  config.tabs.push(newTab);
  createTabElements(newTab);
  switchTab(id);
  saveConfig();
  updateScrollButtonsVisibility();
}

function createTabElements(tab) {
  // Create tab button
  const tabEl = document.createElement('div');
  tabEl.className = 'tab';
  tabEl.id = `tab-${tab.id}`;
  
  const titleEl = document.createElement('span');
  titleEl.className = 'tab-title';
  titleEl.textContent = tab.name;
  
  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '&times;';
  closeBtn.title = 'Close tab';
  
  tabEl.appendChild(titleEl);
  tabEl.appendChild(closeBtn);
  
  // Insert before the add button
  tabsBar.insertBefore(tabEl, addTabBtn);
  
  // Create webview
  const webview = document.createElement('webview');
  webview.id = `view-${tab.id}`;
  webview.partition = tab.partition;
  webview.setAttribute('allowpopups', '');
  webview.setAttribute('useragent', "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
  webview.src = WHATSAPP_URL;
  
  viewsContainer.appendChild(webview);
  
  tabLoadedStates[tab.id] = false;
  tabMediaStates[tab.id] = false;

  // We no longer reset state on did-start-loading to prevent flickering during background refreshes.
  // The state will be updated naturally via dom-ready and console-messages.

  webview.addEventListener('dom-ready', () => {
    const script = `
      // Observer for WA loaded state
      if (!window.__wa_loaded_observer) {
        const checkLoaded = () => document.querySelector('#side') || document.querySelector('#pane-side') || document.querySelector('[data-testid="chat-list"]');
        if (checkLoaded()) {
          console.log('__WA_LOADED__');
        } else {
          window.__wa_loaded_observer = new MutationObserver((mutations, obs) => {
            if (checkLoaded()) {
              console.log('__WA_LOADED__');
              obs.disconnect();
            }
          });
          window.__wa_loaded_observer.observe(document.body, { childList: true, subtree: true });
        }
      }

      // Polling-based Media Viewer detection (runs every 500ms)
      // Uses document.elementFromPoint to check if a media element covers the center of the screen.
      // This avoids MutationObserver cascading issues that cause false positives.
      if (!window.__wa_media_poll) {
        let lastMediaState = false;
        
        window.__wa_media_poll = setInterval(() => {
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          const el = document.elementFromPoint(cx, cy);
          
          if (!el) return;
          
          // When media viewer is open, the center of the screen will be an img, video, or canvas element
          // During normal chat, the center is text/div elements from the message list
          const tag = el.tagName;
          const isMediaElement = (tag === 'IMG' || tag === 'VIDEO' || tag === 'CANVAS');
          
          // Also check if the element is large enough to be a viewer (not just a small inline image)
          const isLarge = isMediaElement && el.offsetWidth > 200 && el.offsetHeight > 200;
          
          if (isLarge !== lastMediaState) {
            lastMediaState = isLarge;
            console.log(isLarge ? '__WA_MEDIA_OPEN__' : '__WA_MEDIA_CLOSED__');
          }
        }, 500);
      }
    `;
    webview.executeJavaScript(script).catch(e => console.error(e));
  });

  webview.addEventListener('console-message', (e) => {
    if (e.message === '__WA_LOADED__') {
      tabLoadedStates[tab.id] = true;
      if (activeTabId === tab.id) {
        updateOverlaysVisibility();
      }
    } else if (e.message === '__WA_MEDIA_OPEN__') {
      console.log('[Media Debug] MEDIA OPEN detected for tab:', tab.id);
      tabMediaStates[tab.id] = true;
      if (activeTabId === tab.id) {
        updateOverlaysVisibility();
      }
    } else if (e.message === '__WA_MEDIA_CLOSED__') {
      console.log('[Media Debug] MEDIA CLOSED detected for tab:', tab.id);
      tabMediaStates[tab.id] = false;
      if (activeTabId === tab.id) {
        updateOverlaysVisibility();
      }
    } else if (e.message.startsWith('__WA_DEBUG_MEDIA__')) {
      console.log('[Media Debug]', e.message);
    }
  });

  // Event listeners
  tabEl.addEventListener('click', (e) => {
    if (e.target !== closeBtn) {
      switchTab(tab.id);
    }
  });

  tabEl.addEventListener('dblclick', () => {
    openEditModal(tab.id);
  });
  
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeTab(tab.id);
  });

  // Drag and Drop event listeners
  tabEl.draggable = true;

  tabEl.addEventListener('dragstart', (e) => {
    draggedTabId = tab.id;
    tabEl.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', tab.id);
  });

  tabEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (tab.id !== draggedTabId) {
      tabEl.classList.add('drag-over');
    }
  });

  tabEl.addEventListener('dragleave', () => {
    tabEl.classList.remove('drag-over');
  });

  tabEl.addEventListener('dragend', () => {
    tabEl.classList.remove('dragging');
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('drag-over'));
    draggedTabId = null;
  });

  tabEl.addEventListener('drop', (e) => {
    e.preventDefault();
    tabEl.classList.remove('drag-over');
    
    if (draggedTabId && draggedTabId !== tab.id) {
      reorderTabs(draggedTabId, tab.id);
    }
  });

  // Context Menu listener
  tabEl.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showTabContextMenu(e.clientX, e.clientY, tab.id);
  });
}

function reorderTabs(fromId, toId) {
  const fromIndex = config.tabs.findIndex(t => t.id === fromId);
  const toIndex = config.tabs.findIndex(t => t.id === toId);
  
  if (fromIndex !== -1 && toIndex !== -1) {
    // Reorder in array
    const [movedTab] = config.tabs.splice(fromIndex, 1);
    config.tabs.splice(toIndex, 0, movedTab);
    
    // Reorder in DOM
    const fromEl = document.getElementById(`tab-${fromId}`);
    const toEl = document.getElementById(`tab-${toId}`);
    
    if (fromIndex < toIndex) {
      tabsBar.insertBefore(fromEl, toEl.nextSibling);
    } else {
      tabsBar.insertBefore(fromEl, toEl);
    }
    
    saveConfig();
    updateScrollButtonsVisibility();
  }
}

function switchTab(id) {
  // Update UI state
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('webview').forEach(el => el.classList.remove('active'));
  
  const tabEl = document.getElementById(`tab-${id}`);
  const viewEl = document.getElementById(`view-${id}`);
  
  if (tabEl && viewEl) {
    tabEl.classList.add('active');
    viewEl.classList.add('active');
    activeTabId = id;
    updateOverlaysVisibility();
    
    // Ensure active tab is visible
    tabEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }
}

function closeTab(id) {
  if (config.tabs.length === 1) {
    return;
  }
  
  const tabIndex = config.tabs.findIndex(t => t.id === id);
  if (tabIndex === -1) return;
  
  // Remove elements
  const tabEl = document.getElementById(`tab-${id}`);
  const viewEl = document.getElementById(`view-${id}`);
  
  if (tabEl) tabEl.remove();
  if (viewEl) viewEl.remove();
  
  // Update state
  config.tabs.splice(tabIndex, 1);
  saveConfig();
  
  // Switch to another tab if the active one was closed
  if (activeTabId === id && config.tabs.length > 0) {
    const newIndex = Math.min(tabIndex, config.tabs.length - 1);
    switchTab(config.tabs[newIndex].id);
  }
  updateScrollButtonsVisibility();
}

// Modal functions
function openEditModal(id) {
  const tab = config.tabs.find(t => t.id === id);
  if (tab) {
    editingTabId = id;
    tabNameInput.value = tab.name;
    editModal.style.display = 'flex';
    tabNameInput.focus();
  }
}

function closeEditModal() {
  editModal.style.display = 'none';
  editingTabId = null;
}

function saveEditedTabName() {
  if (editingTabId) {
    const newName = tabNameInput.value.trim() || 'WhatsApp';
    const tab = config.tabs.find(t => t.id === editingTabId);
    
    if (tab) {
      tab.name = newName;
      const titleEl = document.querySelector(`#tab-${editingTabId} .tab-title`);
      if (titleEl) {
        titleEl.textContent = newName;
      }
      saveConfig();
    }
  }
  closeEditModal();
}

// Settings Modal functions
function openSettingsModal() {
  themeSelect.value = config.theme;
  languageSelect.value = config.language;
  settingsModal.style.display = 'flex';
}

function closeSettingsModal() {
  settingsModal.style.display = 'none';
}

function saveSettings() {
  const newTheme = themeSelect.value;
  const newLang = languageSelect.value;
  
  config.theme = newTheme;
  config.language = newLang;
  
  applyTheme(newTheme);
  applyLanguage(newLang);
  saveConfig();
  closeSettingsModal();
}

// Hamburger Menu logic
function closeMenu() {
  menuDropdown.style.display = 'none';
  const overlay = document.getElementById('menu-overlay');
  if (overlay) overlay.style.display = 'none';
}

function toggleMenu() {
  const isVisible = menuDropdown.style.display === 'block';
  if (isVisible) {
    closeMenu();
  } else {
    menuDropdown.style.display = 'block';
    let overlay = document.getElementById('menu-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'menu-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.zIndex = '1999';
      overlay.style.webkitAppRegion = 'no-drag';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
      });
    }
    overlay.style.display = 'block';
  }
}

hamburgerBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu();
});

document.addEventListener('click', () => {
  closeMenu();
});

menuDropdown.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Tab Context Menu logic
function showTabContextMenu(x, y, tabId) {
  contextMenuTabId = tabId;
  tabContextMenu.style.display = 'block';
  
  // Positioning logic to prevent going off-screen
  const menuWidth = tabContextMenu.offsetWidth || 160;
  const menuHeight = tabContextMenu.offsetHeight || 80;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  if (x + menuWidth > windowWidth) x = windowWidth - menuWidth - 10;
  if (y + menuHeight > windowHeight) y = windowHeight - menuHeight - 10;
  
  tabContextMenu.style.left = `${x}px`;
  tabContextMenu.style.top = `${y}px`;

  // Create overlay if it doesn't exist
  let overlay = document.getElementById('ctx-menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'ctx-menu-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '3999';
    overlay.style.webkitAppRegion = 'no-drag';
    document.body.appendChild(overlay);
    overlay.addEventListener('mousedown', () => {
      closeTabContextMenu();
    });
  }
  overlay.style.display = 'block';
}

function closeTabContextMenu() {
  tabContextMenu.style.display = 'none';
  contextMenuTabId = null;
  const overlay = document.getElementById('ctx-menu-overlay');
  if (overlay) overlay.style.display = 'none';
}

document.getElementById('ctx-rename-tab').addEventListener('click', () => {
  if (contextMenuTabId) {
    openEditModal(contextMenuTabId);
  }
  closeTabContextMenu();
});

document.getElementById('ctx-reload-tab').addEventListener('click', () => {
  if (contextMenuTabId) {
    const view = document.getElementById(`view-${contextMenuTabId}`);
    if (view) view.reload();
  }
  closeTabContextMenu();
});

document.getElementById('ctx-close-tab').addEventListener('click', () => {
  if (contextMenuTabId) {
    closeTab(contextMenuTabId);
  }
  closeTabContextMenu();
});

// Close all menus on escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
    closeTabContextMenu();
  }
});

// Menu Action handlers
document.getElementById('menu-new-tab').addEventListener('click', () => {
  addNewTab();
  closeMenu();
});

document.getElementById('menu-settings').addEventListener('click', () => {
  openSettingsModal();
  closeMenu();
});

document.getElementById('menu-exit').addEventListener('click', () => {
  window.electronAPI.exit();
});

function getActiveWebview() {
  return document.querySelector('webview.active');
}

document.getElementById('menu-undo').addEventListener('click', () => {
  const view = getActiveWebview();
  if (view) view.undo();
  closeMenu();
});

document.getElementById('menu-redo').addEventListener('click', () => {
  const view = getActiveWebview();
  if (view) view.redo();
  closeMenu();
});

document.getElementById('menu-cut').addEventListener('click', () => {
  const view = getActiveWebview();
  if (view) view.cut();
  closeMenu();
});

document.getElementById('menu-copy').addEventListener('click', () => {
  const view = getActiveWebview();
  if (view) view.copy();
  closeMenu();
});

document.getElementById('menu-paste').addEventListener('click', () => {
  const view = getActiveWebview();
  if (view) view.paste();
  closeMenu();
});

document.getElementById('menu-reload').addEventListener('click', () => {
  const view = getActiveWebview();
  if (view) view.reload();
  closeMenu();
});

document.getElementById('menu-devtools').addEventListener('click', () => {
  const view = getActiveWebview();
  if (view) view.openDevTools();
  closeMenu();
});

document.getElementById('menu-help').addEventListener('click', () => {
  window.electronAPI.openExternal('https://github.com/syahdafahreza/Multi-WhatsApp#readme');
  closeMenu();
});

document.getElementById('menu-about').addEventListener('click', () => {
  aboutModal.style.display = 'flex';
  closeMenu();
});

closeAboutBtn.addEventListener('click', () => {
  aboutModal.style.display = 'none';
});

document.getElementById('reset-window-btn').addEventListener('click', () => {
  if (confirm(config.language === 'id-id' ? 
    'Apakah Anda yakin ingin mengatur ulang ukuran dan posisi jendela?' : 
    'Are you sure you want to reset the window size and position?')) {
    window.electronAPI.resetWindow();
  }
});

// Settings Modal Listeners
saveSettingsBtn.addEventListener('click', saveSettings);
closeSettingsBtn.addEventListener('click', closeSettingsModal);

// Original Event Listeners
addTabBtn.addEventListener('click', addNewTab);

scrollLeftBtn.addEventListener('click', () => {
  tabsBar.scrollBy({ left: -200, behavior: 'smooth' });
});

scrollRightBtn.addEventListener('click', () => {
  tabsBar.scrollBy({ left: 200, behavior: 'smooth' });
});

tabsBar.addEventListener('scroll', updateScrollButtonsVisibility);

tabsBar.addEventListener('wheel', (e) => {
  if (e.deltaY !== 0) {
    e.preventDefault();
    tabsBar.scrollBy({ left: e.deltaY, behavior: 'auto' });
  }
});

window.addEventListener('resize', updateScrollButtonsVisibility);

saveTabNameBtn.addEventListener('click', saveEditedTabName);
cancelTabNameBtn.addEventListener('click', closeEditModal);

tabNameInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    saveEditedTabName();
  } else if (e.key === 'Escape') {
    closeEditModal();
  }
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey) {
    switch (e.key.toLowerCase()) {
      case 't':
        addNewTab();
        break;
      case 'w':
        if (activeTabId) closeTab(activeTabId);
        break;
      case 'r':
        const view = getActiveWebview();
        if (view) view.reload();
        break;
      case ',': // Ctrl + , for settings
        openSettingsModal();
        break;
    }
  }
  if (e.key === 'F12') {
    const view = getActiveWebview();
    if (view) view.openDevTools();
  }
});

// Initialize
init();
