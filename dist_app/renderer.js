let config = {
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
  defaultDownloadDir: '',
  customThemes: []
};

let activeTabId = null;
let editingTabId = null;
let draggedTabId = null;
let tabLoadedStates = {};
let tabMediaStates = {};
let tabUnreadCounts = {};
let activeZoomFactor = 1.0;

const WHATSAPP_URL = 'https://web.whatsapp.com';

// Built-in Theme Presets
const themePresets = {
  default: { name: 'Default WhatsApp', id: 'default', isPreset: true, colors: { bg: '#F7F5F3', fg: '#111b21', ac: '#21c063' } },
  dark: { name: 'Dark Plus', id: 'dark', isPreset: true, colors: { bg: '#1f232a', fg: '#eeeeee', ac: '#7289da' } },
  darkMint: { name: 'Dark Mint', id: 'darkMint', isPreset: true, colors: { bg: '#10151E', fg: '#eeeeee', ac: '#40C486' } },
  purplish: { name: 'Purplish', id: 'purplish', isPreset: true, colors: { bg: '#15192E', fg: '#eeeeee', ac: '#125DBF' } },
  coffee: { name: 'Coffee', id: 'coffee', isPreset: true, colors: { bg: '#100d11', fg: '#eeeeee', ac: '#c7a589' } }
};

const translations = {
  'en-us': {
    'menu-file': 'File',
    'menu-new-tab': 'New Tab',
    'menu-new-incognito-tab': 'New Incognito Tab',
    'menu-start-new-chat': 'Start New Chat',
    'menu-theme-manager': 'Theme Manager',
    'menu-settings': 'Settings',
    'menu-exit': 'Exit',
    'menu-edit': 'Edit',
    'menu-undo': 'Undo',
    'menu-redo': 'Redo',
    'menu-cut': 'Cut',
    'menu-copy': 'Copy',
    'menu-paste': 'Paste',
    'menu-view': 'View',
    'menu-zoom-in': 'Zoom In',
    'menu-zoom-out': 'Zoom Out',
    'menu-zoom-reset': 'Reset Zoom',
    'menu-reload': 'Reload Tab',
    'menu-devtools': 'Developer Tools',
    'menu-help': 'Help',
    'menu-help-item': 'Help & Shortcuts',
    'menu-about': 'About',
    
    'new-chat-title': 'Start New Chat',
    'phone-number-label': 'Phone Number (with country code):',
    'phone-number-desc': 'Start a direct WhatsApp conversation without saving to your contact list.',
    'new-chat-target-label': 'Open In:',
    'target-active-tab': 'Current Tab',
    'target-new-tab': 'New Tab',
    'start-chat': 'Start Chat',
    'cancel': 'Cancel',
    'cancel-2': 'Cancel',
    'save': 'Save',
    'done': 'Done',
    'close': 'Close',

    'edit-tab-title': 'Tab Settings',
    'tab-name-label': 'Tab Name',
    'tab-color-label': 'Custom Tab Color',
    'tab-theme-label': 'Tab Theme',
    'tab-mute-label': 'Mute Audio',
    'tab-mute-desc': 'Mute all notification sounds in this tab',
    'tab-notifications-label': 'Desktop Notifications',
    'tab-notifications-desc': 'Allow desktop notification popups for this account',

    'theme-manager-title': 'Theme Manager',
    'theme-presets-label': 'Built-in Themes & Presets',
    'custom-theme-creator': 'Create / Edit Custom Theme',
    'save-theme-btn': '+ Save Custom Theme',
    'open-theme-manager': 'Open Theme Manager & Presets',

    'settings-title': 'Settings',
    'nav-general': 'General',
    'nav-tabs': 'Tabs',
    'nav-system': 'System & Tray',
    'nav-chat': 'Chat & Behavior',
    'nav-downloads': 'Downloads',
    'theme-label': 'Global Theme',
    'theme-system': 'System (Auto)',
    'theme-light': 'Light',
    'theme-dark': 'Dark',
    'language-label': 'Language',
    'privacy-blur': 'Privacy Blur (Hover to reveal)',
    'privacy-blur-desc': 'Blurs chat names, previews, and media until hovered with mouse cursor',
    'tab-close-prompt-label': 'Prompt When Closing Tab',
    'tab-close-prompt-desc': 'Show confirmation dialog before closing any active tab',
    'tray-icon-label': 'System Tray Icon',
    'tray-icon-desc': 'Display Multi-WhatsApp icon in Windows notification area',
    'close-to-tray-label': 'Close to Tray',
    'close-to-tray-desc': 'Minimize application to tray when clicking the close (X) button',
    'launch-minimized-label': 'Launch Minimized',
    'launch-minimized-desc': 'Start the application directly in tray/minimized mode',
    'auto-launch-label': 'Auto-Launch on Startup',
    'auto-launch-desc': 'Automatically launch Multi-WhatsApp when Windows starts',
    'exit-prompt-label': 'Exit Confirmation Prompt',
    'exit-prompt-desc': 'Ask for confirmation before quitting the application',
    'prevent-enter-label': 'Prevent Accidental Enter',
    'prevent-enter-desc': 'Pressing Enter inserts a new line; Send messages using Ctrl + Enter',
    'notif-badge-label': 'Notification Badges',
    'notif-badge-desc': 'Show unread count badges on tabs and app/tray icon',
    'formatting-shortcuts-title': 'Formatting Shortcuts in Chat',
    'show-save-dialog-label': 'Always Ask Where to Save Files',
    'show-save-dialog-desc': 'Show file save dialog for every downloaded file',
    'default-download-dir-label': 'Default Download Directory',
    'window-label': 'Window Management',
    'reset-window': 'Reset Window Size & Position',
    'save-settings': 'Save Settings',
    'close-settings': 'Close',

    'help-title': 'Help & Shortcuts',
    'about-desc': 'Multi-WhatsApp is a feature-rich, multi-tab WhatsApp desktop client built with Electron. Manage multiple WhatsApp accounts seamlessly with persistent sessions, incognito tabs, privacy blur, system tray background running, custom themes, unread badges, and direct chat capabilities.',
    'close-about': 'Close',

    'ctx-reload': 'Reload Tab',
    'ctx-mute': 'Mute Audio',
    'ctx-unmute': 'Unmute Audio',
    'ctx-settings': 'Tab Settings',
    'ctx-rename': 'Rename Tab',
    'ctx-close': 'Close Tab',
    'ctx-copy-image': 'Copy Image',
    'ctx-copy-image-url': 'Copy Image Address',
    'ctx-save-image': 'Save Image As...',
    'ctx-open-browser': 'Open Image in Browser',

    'prompt-close-tab': 'Are you sure you want to close this tab? You will need to reopen it from the menu.'
  },
  'id-id': {
    'menu-file': 'Berkas',
    'menu-new-tab': 'Tab Baru',
    'menu-new-incognito-tab': 'Tab Incognito Baru',
    'menu-start-new-chat': 'Mulai Chat Baru',
    'menu-theme-manager': 'Manajer Tema',
    'menu-settings': 'Pengaturan',
    'menu-exit': 'Keluar',
    'menu-edit': 'Edit',
    'menu-undo': 'Batal',
    'menu-redo': 'Ulangi',
    'menu-cut': 'Potong',
    'menu-copy': 'Salin',
    'menu-paste': 'Tempel',
    'menu-view': 'Tampilan',
    'menu-zoom-in': 'Perbesar (Zoom In)',
    'menu-zoom-out': 'Perkecil (Zoom Out)',
    'menu-zoom-reset': 'Reset Zoom',
    'menu-reload': 'Muat Ulang Tab',
    'menu-devtools': 'Alat Pengembang',
    'menu-help': 'Bantuan',
    'menu-help-item': 'Bantuan & Pintasan',
    'menu-about': 'Tentang',
    
    'new-chat-title': 'Mulai Chat Baru',
    'phone-number-label': 'Nomor Telepon (beserta kode negara):',
    'phone-number-desc': 'Mulai obrolan WhatsApp langsung tanpa harus menyimpan nomor ke daftar kontak.',
    'new-chat-target-label': 'Buka Di:',
    'target-active-tab': 'Tab Saat Ini',
    'target-new-tab': 'Tab Baru',
    'start-chat': 'Mulai Chat',
    'cancel': 'Batal',
    'cancel-2': 'Batal',
    'save': 'Simpan',
    'done': 'Selesai',
    'close': 'Tutup',

    'edit-tab-title': 'Pengaturan Tab',
    'tab-name-label': 'Nama Tab',
    'tab-color-label': 'Warna Kustom Tab',
    'tab-theme-label': 'Tema Tab',
    'tab-mute-label': 'Bisukan Suara (Mute)',
    'tab-mute-desc': 'Bisukan semua suara notifikasi pada tab ini',
    'tab-notifications-label': 'Notifikasi Desktop',
    'tab-notifications-desc': 'Izinkan notifikasi desktop untuk akun ini',

    'theme-manager-title': 'Manajer Tema',
    'theme-presets-label': 'Tema Bawaan & Preset',
    'custom-theme-creator': 'Buat / Edit Tema Kustom',
    'save-theme-btn': '+ Simpan Tema Kustom',
    'open-theme-manager': 'Buka Manajer Tema & Preset',

    'settings-title': 'Pengaturan',
    'nav-general': 'Umum',
    'nav-tabs': 'Tab',
    'nav-system': 'Sistem & Tray',
    'nav-chat': 'Obrolan & Perilaku',
    'nav-downloads': 'Unduhan',
    'theme-label': 'Tema Global',
    'theme-system': 'Sistem (Otomatis)',
    'theme-light': 'Terang',
    'theme-dark': 'Gelap',
    'language-label': 'Bahasa',
    'privacy-blur': 'Efek Blur Privasi (Arahkan kursor)',
    'privacy-blur-desc': 'Memburamkan nama kontak, pesan, dan media sampai kursor diarahkan ke atasnya',
    'tab-close-prompt-label': 'Konfirmasi Saat Menutup Tab',
    'tab-close-prompt-desc': 'Tampilkan dialog konfirmasi sebelum menutup tab aktif',
    'tray-icon-label': 'Ikon System Tray',
    'tray-icon-desc': 'Tampilkan ikon Multi-WhatsApp di area notifikasi Windows (system tray)',
    'close-to-tray-label': 'Tutup ke Tray (Close to Tray)',
    'close-to-tray-desc': 'Minimalkan aplikasi ke tray saat menekan tombol silang (X)',
    'launch-minimized-label': 'Mulai dalam Keadaan Diminimalkan',
    'launch-minimized-desc': 'Jalankan aplikasi langsung di background/tray saat startup',
    'auto-launch-label': 'Jalankan Otomatis saat Startup',
    'auto-launch-desc': 'Mulai Multi-WhatsApp secara otomatis ketika Windows dinyalakan',
    'exit-prompt-label': 'Konfirmasi Saat Keluar Aplikasi',
    'exit-prompt-desc': 'Minta konfirmasi sebelum menutup aplikasi sepenuhnya',
    'prevent-enter-label': 'Cegah Terkirim Otomatis dengan Enter',
    'prevent-enter-desc': 'Tekan Enter untuk baris baru; Gunakan Ctrl + Enter untuk mengirim pesan',
    'notif-badge-label': 'Lencana Notifikasi (Unread Badges)',
    'notif-badge-desc': 'Tampilkan lencana jumlah pesan belum dibaca di tab dan ikon aplikasi/tray',
    'formatting-shortcuts-title': 'Pintasan Format Teks di Chat',
    'show-save-dialog-label': 'Selalu Tanyakan Tempat Menyimpan Berkas',
    'show-save-dialog-desc': 'Tampilkan dialog penyimpanan file untuk setiap unduhan',
    'default-download-dir-label': 'Direktori Unduhan Default',
    'window-label': 'Manajemen Jendela',
    'reset-window': 'Atur Ulang Ukuran & Posisi Jendela',
    'save-settings': 'Simpan Pengaturan',
    'close-settings': 'Tutup',

    'help-title': 'Bantuan & Pintasan',
    'about-desc': 'Multi-WhatsApp adalah aplikasi desktop WhatsApp multi-tab canggih berbasis Electron. Kelola banyak akun WhatsApp sekaligus dengan sesi persisten, tab incognito, blur privasi, system tray, kustomisasi tema, lencana unread, dan fitur chat nomor langsung.',
    'close-about': 'Tutup',

    'ctx-reload': 'Muat Ulang Tab',
    'ctx-mute': 'Bisukan Suara',
    'ctx-unmute': 'Bunyikan Suara',
    'ctx-settings': 'Pengaturan Tab',
    'ctx-rename': 'Ubah Nama Tab',
    'ctx-close': 'Tutup Tab',
    'ctx-copy-image': 'Salin Gambar',
    'ctx-copy-image-url': 'Salin Tautan Gambar',
    'ctx-save-image': 'Simpan Gambar Sebagai...',
    'ctx-open-browser': 'Buka Gambar di Browser',

    'prompt-close-tab': 'Apakah Anda yakin ingin menutup tab ini?'
  }
};

// UI Elements
const tabsBar = document.getElementById('tabs-bar');
const viewsContainer = document.getElementById('views-container');
const addTabBtn = document.getElementById('add-tab-btn');
const scrollLeftBtn = document.getElementById('scroll-left-btn');
const scrollRightBtn = document.getElementById('scroll-right-btn');

// Menu elements
const hamburgerBtn = document.getElementById('hamburger-btn');
const menuDropdown = document.getElementById('menu-dropdown');
const tabContextMenu = document.getElementById('tab-context-menu');
let contextMenuTabId = null;

const imageContextMenu = document.getElementById('image-context-menu');
let imageContextData = null;

// Modals
const newChatModal = document.getElementById('new-chat-modal');
const editModal = document.getElementById('edit-modal');
const themeManagerModal = document.getElementById('theme-manager-modal');
const settingsModal = document.getElementById('settings-modal');
const helpModal = document.getElementById('help-modal');
const aboutModal = document.getElementById('about-modal');

// CSS Generator for Custom Themes
function generateThemeCSS(colors) {
  if (!colors || !colors.bg) return '';
  const { bg, fg = '#111b21' } = colors;
  
  // Calculate luminance approximation
  const hex = bg.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) || 0;
  const g = parseInt(hex.substr(2, 2), 16) || 0;
  const b = parseInt(hex.substr(4, 2), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const isDark = luminance < 0.5;
  const mixColor = isDark ? 'white' : 'black';

  return `
    :root, body.web, body.dark, body.custom {
      --bg: ${bg} !important;
      --fg: ${fg} !important;
      --app-background: ${bg} !important;
      --navbar-background: ${bg} !important;
      --conversation-panel-background: ${bg} !important;
      --panel-header-background: color-mix(in srgb, ${bg}, ${mixColor} 6%) !important;
      --background-default: ${bg} !important;
      --background-default-hover: color-mix(in srgb, ${bg}, ${mixColor} 8%) !important;
      --background-default-active: color-mix(in srgb, ${bg}, ${mixColor} 12%) !important;
      --incoming-background: color-mix(in srgb, ${bg}, ${mixColor} 9%) !important;
      --outgoing-background: color-mix(in srgb, ${bg}, ${mixColor} 14%) !important;
      --primary-strong: ${fg} !important;
      --message-primary: ${fg} !important;
      --compose-input-background: color-mix(in srgb, ${bg}, ${mixColor} 5%) !important;
      --search-input-background: color-mix(in srgb, ${bg}, ${mixColor} 5%) !important;
      --border-list: color-mix(in srgb, ${bg}, ${mixColor} 12%) !important;
    }
  `;
}

// Injected Webview Script for Privacy Blur, Title Observer, Text Formatting & Shortcuts
const WEBVIEW_INJECT_SCRIPT = `
(() => {
  // Title Mutation Observer for Unread Badge
  const titleEl = document.querySelector('title');
  if (titleEl) {
    const notifyTitleChange = () => {
      const match = /\\(([0-9]+)\\)/.exec(titleEl.textContent || '');
      const unreadCount = match ? parseInt(match[1], 10) : 0;
      window.dispatchEvent(new CustomEvent('mw-unread-count', { detail: { count: unreadCount } }));
    };

    new MutationObserver(notifyTitleChange).observe(titleEl, {
      subtree: true,
      childList: true,
      characterData: true
    });
    notifyTitleChange();
  }

  // Text Formatting Helper
  function formatSelectedText(wrapper) {
    const messageInput = document.querySelector('#main footer div[contenteditable]');
    if (!messageInput) return;
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const selectedText = sel.toString();
    if (selectedText.length > 0) {
      document.execCommand('insertText', false, wrapper + selectedText + wrapper);
    } else {
      document.execCommand('insertText', false, wrapper + wrapper);
    }
  }

  // Formatting Keybindings in WhatsApp Web
  document.body.addEventListener('keydown', (e) => {
    if (!e.ctrlKey) return;
    if (e.key === 'b' || e.key === 'B') {
      formatSelectedText('*');
      e.preventDefault();
    } else if (e.key === 'i' || e.key === 'I') {
      formatSelectedText('_');
      e.preventDefault();
    } else if (e.key === 's' || e.key === 'S') {
      formatSelectedText('~');
      e.preventDefault();
    } else if (e.key === 'm' || e.key === 'M') {
      formatSelectedText('\`\`\`');
      e.preventDefault();
    }
  });

  // Context Menu Detection for Images and Media
  document.addEventListener('contextmenu', (e) => {
    let target = e.target;
    let imgEl = null;

    if (target.tagName === 'IMG') {
      imgEl = target;
    } else {
      imgEl = target.closest('img') || target.querySelector('img');
      if (!imgEl && target.tagName === 'CANVAS') {
        imgEl = target;
      }
      if (!imgEl && (target.tagName === 'VIDEO' || target.closest('video'))) {
        imgEl = target.tagName === 'VIDEO' ? target : target.closest('video');
      }
    }

    if (imgEl) {
      let src = imgEl.src || '';
      let dataUrl = '';
      if (imgEl.tagName === 'CANVAS') {
        try {
          dataUrl = imgEl.toDataURL('image/png');
        } catch (err) {}
      } else if (imgEl.tagName === 'IMG' && src) {
        try {
          // If image is already data url
          if (src.startsWith('data:image')) {
            dataUrl = src;
          } else if (imgEl.complete && imgEl.naturalWidth > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = imgEl.naturalWidth;
            canvas.height = imgEl.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(imgEl, 0, 0);
            dataUrl = canvas.toDataURL('image/png');
          }
        } catch (err) {
          // Cross-origin fallback
        }
      }

      window.dispatchEvent(new CustomEvent('mw-image-contextmenu', {
        detail: {
          x: e.clientX,
          y: e.clientY,
          src: src,
          dataUrl: dataUrl,
          tagName: imgEl.tagName
        }
      }));
    }
  }, true);
})();
`;

// Initializer
async function init() {
  try {
    const savedConfig = await window.electronAPI.loadConfig();
    if (savedConfig) {
      config = { ...config, ...savedConfig };
      if (!Array.isArray(config.tabs)) config.tabs = [];
      if (!Array.isArray(config.customThemes)) config.customThemes = [];

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

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (config.theme === 'system') {
        applyTheme('system');
      }
    });

    setTimeout(updateScrollButtonsVisibility, 100);
  } catch (err) {
    console.error('Initialization error:', err);
    if (config.tabs.length === 0) addNewTab();
  }
}

function setupIPCListeners() {
  window.electronAPI.onTriggerNewChat(() => {
    openNewChatModal();
  });

  window.electronAPI.onTriggerSettings(() => {
    openSettingsModal();
  });

  window.electronAPI.onOpenWhatsAppLink((url) => {
    handleDeepLink(url);
  });
}

function handleDeepLink(url) {
  let cleanUrl = url;
  if (url.startsWith('whatsapp://send/?phone=') || url.startsWith('whatsapp://send?phone=')) {
    const phone = url.split('phone=')[1]?.split('&')[0];
    if (phone) cleanUrl = `https://web.whatsapp.com/send/?phone=${phone}`;
  } else if (url.startsWith('whatsapp://chat/?code=') || url.startsWith('whatsapp://chat?code=')) {
    const code = url.split('code=')[1]?.split('&')[0];
    if (code) cleanUrl = `https://web.whatsapp.com/accept?code=${code}`;
  }

  const activeWebview = getActiveWebview();
  if (activeWebview) {
    activeWebview.src = cleanUrl;
  }
}

function saveConfig() {
  const configToSave = {
    ...config,
    tabs: config.tabs.filter(tab => !tab.isIncognito)
  };
  window.electronAPI.saveConfig(configToSave);
}

function updateOverlaysVisibility() {
  const isLoaded = activeTabId && tabLoadedStates[activeTabId];
  const isMediaOpen = activeTabId && tabMediaStates[activeTabId];
  const shouldShow = isLoaded && !isMediaOpen;
  const display = shouldShow ? 'block' : 'none';

  const innerCurve = document.getElementById('inner-curve-overlay');
  const chatBorder = document.getElementById('chat-border-overlay');

  if (innerCurve) innerCurve.style.display = display;
  if (chatBorder) chatBorder.style.display = display;

  if (viewsContainer) {
    if (shouldShow) viewsContainer.classList.add('is-loaded');
    else viewsContainer.classList.remove('is-loaded');
  }
}

function updateScrollButtonsVisibility() {
  const hasOverflow = tabsBar.scrollWidth > tabsBar.clientWidth;
  if (hasOverflow) {
    scrollLeftBtn.style.display = 'flex';
    scrollRightBtn.style.display = 'flex';
    scrollLeftBtn.disabled = tabsBar.scrollLeft <= 1;
    scrollRightBtn.disabled = tabsBar.scrollLeft + tabsBar.clientWidth >= tabsBar.scrollWidth - 1;
  } else {
    scrollLeftBtn.style.display = 'none';
    scrollRightBtn.style.display = 'none';
  }
}

function applyTheme(themeName) {
  let isDark = false;
  const targetTheme = themePresets[themeName] || config.customThemes.find(t => t.id === themeName);

  if (themeName === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else if (themeName === 'default') {
    isDark = false;
  } else if (targetTheme && targetTheme.colors && targetTheme.colors.bg) {
    const hex = targetTheme.colors.bg.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) || 0;
    const g = parseInt(hex.substr(2, 2), 16) || 0;
    const b = parseInt(hex.substr(4, 2), 16) || 0;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    isDark = luminance < 0.5;
  } else {
    isDark = true;
  }

  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

  // Update App UI Accent Color & Properties
  if (targetTheme && targetTheme.colors && targetTheme.colors.ac) {
    const ac = targetTheme.colors.ac;
    document.documentElement.style.setProperty('--primary-color', ac);
    document.documentElement.style.setProperty('--primary-hover', `color-mix(in srgb, ${ac}, black 12%)`);
    document.documentElement.style.setProperty('--tab-active-bg', ac);
    document.documentElement.style.setProperty('--badge-bg', ac);
    document.documentElement.style.setProperty('--dropdown-hover', ac);
  } else {
    document.documentElement.style.removeProperty('--primary-color');
    document.documentElement.style.removeProperty('--primary-hover');
    document.documentElement.style.removeProperty('--tab-active-bg');
    document.documentElement.style.removeProperty('--badge-bg');
    document.documentElement.style.removeProperty('--dropdown-hover');
  }

  const titleBarColor = isDark ? '#1d1f1f' : '#F7F5F3';
  const symbolColor = isDark ? '#ffffff' : '#111b21';
  window.electronAPI.setTitleBarColor(titleBarColor, symbolColor);

  // Apply theme to all tabs
  config.tabs.forEach(tab => {
    const tabTheme = (tab.theme && tab.theme !== 'inherit') ? tab.theme : themeName;
    applyThemeToWebview(tab.id, tabTheme);
  });
}

function applyThemeToWebview(tabId, themeId) {
  const webview = document.getElementById(`webview-${tabId}`);
  if (!webview) return;

  const effectiveThemeId = (!themeId || themeId === 'inherit') ? config.theme : themeId;
  const targetTheme = themePresets[effectiveThemeId] || config.customThemes.find(t => t.id === effectiveThemeId);

  if (!targetTheme || targetTheme.id === 'default' || (!targetTheme.colors && !targetTheme.css)) {
    webview.executeJavaScript(`
      (() => {
        const style = document.getElementById('mw-custom-theme-style');
        if (style) style.remove();
        document.body.classList.remove('custom');
      })()
    `).catch(() => {});
    return;
  }

  const css = targetTheme.colors ? generateThemeCSS(targetTheme.colors) : (targetTheme.css || '');
  webview.executeJavaScript(`
    (() => {
      document.body.classList.add('custom');
      let style = document.getElementById('mw-custom-theme-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'mw-custom-theme-style';
        (document.head || document.documentElement).appendChild(style);
      }
      style.innerHTML = \`${css}\`;
    })()
  `).catch(() => {});
}

function applyLanguage(lang) {
  const currentLang = translations[lang] || translations['en-us'];
  for (const [key, value] of Object.entries(currentLang)) {
    const el = document.getElementById(`lang-${key}`);
    if (el) el.textContent = value;
  }
}

function updateTotalUnreadBadges() {
  let total = 0;
  config.tabs.forEach(tab => {
    if (!tab.isMuted) {
      total += (tabUnreadCounts[tab.id] || 0);
    }
  });

  if (config.notificationBadge) {
    window.electronAPI.updateBadge(total);
  } else {
    window.electronAPI.updateBadge(0);
  }
}

// Tab Creation & Management
function addNewTab(isIncognito = false) {
  const tabId = Date.now().toString();
  const baseName = isIncognito ? 'Incognito' : 'WhatsApp';
  const count = config.tabs.filter(t => t.isIncognito === isIncognito).length + 1;
  const name = `${baseName} ${count}`;

  const newTab = {
    id: tabId,
    name: name,
    isIncognito: isIncognito,
    color: '',
    theme: 'inherit',
    isMuted: false,
    notifications: true
  };

  config.tabs.push(newTab);
  createTabElements(newTab);
  switchTab(tabId);
  saveConfig();
}

function createTabElements(tab) {
  const tabBtn = document.createElement('div');
  tabBtn.className = 'tab';
  tabBtn.id = `tab-${tab.id}`;
  tabBtn.draggable = true;

  if (tab.color) {
    tabBtn.classList.add('has-custom-color');
  }
  if (tab.isMuted) {
    tabBtn.classList.add('is-muted');
  }

  // Color Stripe
  const colorStripe = document.createElement('div');
  colorStripe.className = 'tab-color-stripe';
  if (tab.color) colorStripe.style.backgroundColor = tab.color;
  tabBtn.appendChild(colorStripe);

  // Tab Title Container
  const titleSpan = document.createElement('span');
  titleSpan.className = 'tab-title';

  if (tab.isIncognito) {
    const incognitoIcon = document.createElement('span');
    incognitoIcon.textContent = '👤 ';
    incognitoIcon.title = 'Incognito Tab';
    titleSpan.appendChild(incognitoIcon);
  }

  const muteIcon = document.createElement('span');
  muteIcon.className = 'tab-mute-icon';
  muteIcon.textContent = '🔇';
  titleSpan.appendChild(muteIcon);

  const textNode = document.createElement('span');
  textNode.className = 'tab-text-node';
  textNode.textContent = tab.name;
  titleSpan.appendChild(textNode);
  tabBtn.appendChild(titleSpan);

  // Unread Badge
  const badgeSpan = document.createElement('span');
  badgeSpan.className = 'tab-badge';
  badgeSpan.id = `tab-badge-${tab.id}`;
  tabBtn.appendChild(badgeSpan);

  // Close Button
  const closeBtn = document.createElement('span');
  closeBtn.className = 'tab-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.title = 'Close Tab';
  tabBtn.appendChild(closeBtn);

  // Tab Click Events
  tabBtn.addEventListener('click', (e) => {
    if (e.target !== closeBtn) switchTab(tab.id);
  });

  tabBtn.addEventListener('dblclick', (e) => {
    if (e.target !== closeBtn) openTabEditModal(tab.id);
  });

  tabBtn.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showTabContextMenu(e.clientX, e.clientY, tab.id);
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeTab(tab.id);
  });

  // Drag & Drop
  tabBtn.addEventListener('dragstart', (e) => {
    draggedTabId = tab.id;
    tabBtn.style.opacity = '0.5';
    e.dataTransfer.setData('text/plain', tab.id);
  });

  tabBtn.addEventListener('dragend', () => {
    tabBtn.style.opacity = '1';
    draggedTabId = null;
  });

  tabBtn.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  tabBtn.addEventListener('drop', (e) => {
    e.preventDefault();
    if (draggedTabId && draggedTabId !== tab.id) {
      const fromIndex = config.tabs.findIndex(t => t.id === draggedTabId);
      const toIndex = config.tabs.findIndex(t => t.id === tab.id);
      if (fromIndex !== -1 && toIndex !== -1) {
        const [movedTab] = config.tabs.splice(fromIndex, 1);
        config.tabs.splice(toIndex, 0, movedTab);
        renderTabs();
        saveConfig();
      }
    }
  });

  tabsBar.insertBefore(tabBtn, addTabBtn);

  // Create Webview
  const webview = document.createElement('webview');
  webview.id = `webview-${tab.id}`;
  webview.src = WHATSAPP_URL;
  webview.partition = tab.isIncognito ? `memory:incognito-${tab.id}` : `persist:tab-${tab.id}`;
  webview.setAttribute('allowpopups', 'true');
  webview.setAttribute('useragent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');
  webview.setAttribute('webpreferences', 'contextIsolation=false, spellcheck=false, backgroundThrottling=true');

  if (tab.isMuted) {
    webview.setAudioMuted(true);
  }

  // Webview Lifecycle Handlers
  webview.addEventListener('dom-ready', () => {
    tabLoadedStates[tab.id] = true;
    updateOverlaysVisibility();

    // Inject Scripts & Privacy Blur
    webview.executeJavaScript(WEBVIEW_INJECT_SCRIPT).catch(() => {});
    if (config.privacyBlur) applyPrivacyBlurToWebview(webview, true);
    applyThemeToWebview(tab.id, tab.theme || config.theme);

    // Setup Custom Event Listener inside webview for image contextmenu
    webview.executeJavaScript(`
      (() => {
        window.addEventListener('mw-image-contextmenu', (e) => {
          console.log('mw-image-contextmenu:', JSON.stringify(e.detail));
        });
      })()
    `).catch(() => {});
  });

  // Intercept console-message from webview to capture context menu requests
  webview.addEventListener('console-message', (e) => {
    if (e.message && e.message.startsWith('mw-image-contextmenu:')) {
      try {
        const jsonStr = e.message.substring('mw-image-contextmenu:'.length).trim();
        const data = JSON.parse(jsonStr);
        const webviewRect = webview.getBoundingClientRect();
        const globalX = webviewRect.left + data.x;
        const globalY = webviewRect.top + data.y;
        showImageContextMenu(globalX, globalY, data);
      } catch (err) {
        console.error('Failed to parse image contextmenu event:', err);
      }
    }
  });

  webview.addEventListener('page-title-updated', (e) => {
    const match = /\(([0-9]+)\)/.exec(e.title || '');
    const count = match ? parseInt(match[1], 10) : 0;
    setTabUnreadCount(tab.id, count);
  });

  viewsContainer.appendChild(webview);
  updateScrollButtonsVisibility();
}

function setTabUnreadCount(tabId, count) {
  tabUnreadCounts[tabId] = count;
  const badge = document.getElementById(`tab-badge-${tabId}`);
  if (badge) {
    if (count > 0 && config.notificationBadge) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.classList.add('visible');
    } else {
      badge.classList.remove('visible');
    }
  }
  updateTotalUnreadBadges();
}

function switchTab(tabId) {
  activeTabId = tabId;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('webview').forEach(v => v.classList.remove('active'));

  const tabBtn = document.getElementById(`tab-${tabId}`);
  const webview = document.getElementById(`webview-${tabId}`);

  if (tabBtn) tabBtn.classList.add('active');
  if (webview) {
    webview.classList.add('active');
    webview.focus();
  }

  updateOverlaysVisibility();
}

async function closeTab(tabId) {
  if (config.tabClosePrompt) {
    const isId = config.language === 'id-id';
    const confirmed = await window.electronAPI.showConfirmDialog({
      title: isId ? 'Konfirmasi Tutup Tab' : 'Close Tab',
      message: isId ? 'Apakah Anda yakin ingin menutup tab ini?' : 'Are you sure you want to close this tab?'
    });
    if (!confirmed) return;
  }

  const tabIndex = config.tabs.findIndex(t => t.id === tabId);
  if (tabIndex === -1) return;

  const tab = config.tabs[tabIndex];
  const tabBtn = document.getElementById(`tab-${tabId}`);
  const webview = document.getElementById(`webview-${tabId}`);

  // Logout if incognito
  if (tab.isIncognito && webview) {
    try {
      webview.executeJavaScript(`
        (() => {
          const menuBtn = document.querySelector('header button[aria-label*="menu"], header button[aria-label*="Menu"]');
          if (menuBtn) menuBtn.click();
        })()
      `).catch(() => {});
    } catch (e) {}
  }

  if (tabBtn) tabBtn.remove();
  if (webview) webview.remove();

  delete tabLoadedStates[tabId];
  delete tabMediaStates[tabId];
  delete tabUnreadCounts[tabId];

  config.tabs.splice(tabIndex, 1);
  updateTotalUnreadBadges();
  saveConfig();

  if (config.tabs.length === 0) {
    addNewTab();
  } else if (activeTabId === tabId) {
    const nextTab = config.tabs[Math.max(0, tabIndex - 1)];
    switchTab(nextTab.id);
  }

  updateScrollButtonsVisibility();
}

function renderTabs() {
  document.querySelectorAll('.tab').forEach(t => t.remove());
  config.tabs.forEach(tab => {
    createTabElements(tab);
  });
  if (activeTabId) switchTab(activeTabId);
}

function getActiveWebview() {
  return activeTabId ? document.getElementById(`webview-${activeTabId}`) : null;
}

// Privacy Blur Injector
function applyPrivacyBlurToWebview(webview, enabled) {
  if (!webview) return;
  const css = `
    /* Privacy Blur Styles */
    #pane-side [role="row"] {
      transition: filter 0.2s ease;
    }
    #pane-side [role="row"]:not(:hover) span[title],
    #pane-side [role="row"]:not(:hover) span[dir="ltr"] {
      filter: blur(5px) !important;
    }
    #pane-side [role="row"]:not(:hover) img {
      filter: blur(6px) !important;
    }
    #main header span[title] {
      filter: blur(5px) !important;
      transition: filter 0.2s ease;
    }
    #main header span[title]:hover {
      filter: none !important;
    }
    #main .message-in span[dir="ltr"],
    #main .message-out span[dir="ltr"] {
      filter: blur(5px) !important;
      transition: filter 0.2s ease;
    }
    #main .message-in:hover span[dir="ltr"],
    #main .message-out:hover span[dir="ltr"] {
      filter: none !important;
    }
  `;

  if (enabled) {
    webview.executeJavaScript(`
      (() => {
        let style = document.getElementById('mw-privacy-blur-style');
        if (!style) {
          style = document.createElement('style');
          style.id = 'mw-privacy-blur-style';
          document.head.appendChild(style);
        }
        style.innerHTML = \`${css}\`;
      })()
    `).catch(() => {});
  } else {
    webview.executeJavaScript(`
      (() => {
        const style = document.getElementById('mw-privacy-blur-style');
        if (style) style.remove();
      })()
    `).catch(() => {});
  }
}

// Modals Handling
function openNewChatModal() {
  document.getElementById('new-chat-phone-input').value = '';
  newChatModal.classList.add('active');
  setTimeout(() => document.getElementById('new-chat-phone-input').focus(), 100);
}

function populateThemeSelectOptions(selectEl, includeInherit = false) {
  selectEl.innerHTML = '';
  if (includeInherit) {
    const opt = document.createElement('option');
    opt.value = 'inherit';
    opt.textContent = 'Inherit Global Theme';
    selectEl.appendChild(opt);
  }

  const presets = [
    { id: 'system', name: 'System (Auto)' },
    { id: 'default', name: 'Default WhatsApp' },
    { id: 'dark', name: 'Dark Plus' },
    { id: 'darkMint', name: 'Dark Mint' },
    { id: 'purplish', name: 'Purplish' },
    { id: 'coffee', name: 'Coffee' }
  ];

  presets.forEach(p => {
    if (!includeInherit || p.id !== 'system') {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      selectEl.appendChild(opt);
    }
  });

  if (config.customThemes && config.customThemes.length > 0) {
    const group = document.createElement('optgroup');
    group.label = 'Custom Themes';
    config.customThemes.forEach(ct => {
      const opt = document.createElement('option');
      opt.value = ct.id;
      opt.textContent = ct.name;
      group.appendChild(opt);
    });
    selectEl.appendChild(group);
  }
}

function openTabEditModal(tabId) {
  editingTabId = tabId;
  const tab = config.tabs.find(t => t.id === tabId);
  if (!tab) return;

  document.getElementById('tab-name-input').value = tab.name;
  document.getElementById('tab-mute-checkbox').checked = !!tab.isMuted;
  document.getElementById('tab-notifications-checkbox').checked = tab.notifications !== false;

  // Selected Color Preset
  const presets = document.querySelectorAll('#tab-color-presets .color-circle');
  presets.forEach(p => {
    p.classList.toggle('selected', p.dataset.color === (tab.color || ''));
  });

  // Tab Theme
  const themeSelect = document.getElementById('tab-theme-select');
  populateThemeSelectOptions(themeSelect, true);
  themeSelect.value = tab.theme || 'inherit';

  editModal.classList.add('active');
}

function openThemeManagerModal() {
  const currentTheme = themePresets[config.theme] || config.customThemes.find(t => t.id === config.theme) || themePresets.default;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  if (currentTheme.colors) {
    document.getElementById('custom-theme-bg').value = currentTheme.colors.bg || (isDark ? '#1f232a' : '#F7F5F3');
    document.getElementById('custom-theme-fg').value = currentTheme.colors.fg || (isDark ? '#eeeeee' : '#111b21');
    document.getElementById('custom-theme-ac').value = currentTheme.colors.ac || '#21c063';
  } else {
    document.getElementById('custom-theme-bg').value = isDark ? '#1f232a' : '#F7F5F3';
    document.getElementById('custom-theme-fg').value = isDark ? '#eeeeee' : '#111b21';
    document.getElementById('custom-theme-ac').value = '#21c063';
  }

  renderThemeManagerList();
  themeManagerModal.classList.add('active');
}

function renderThemeManagerList() {
  const listContainer = document.getElementById('themes-list');
  listContainer.innerHTML = '';

  const allThemes = [...Object.values(themePresets), ...config.customThemes];

  allThemes.forEach(theme => {
    const card = document.createElement('div');
    card.className = `theme-card ${config.theme === theme.id ? 'active' : ''}`;

    const info = document.createElement('div');
    info.className = 'theme-card-info';

    const swatch = document.createElement('div');
    swatch.className = 'theme-swatch';
    swatch.style.backgroundColor = theme.colors ? theme.colors.bg : (theme.id === 'default' ? '#00a884' : '#1d1f1f');
    if (theme.colors && theme.colors.ac) {
      swatch.style.borderColor = theme.colors.ac;
      swatch.style.borderWidth = '2px';
    }
    info.appendChild(swatch);

    const titleSpan = document.createElement('span');
    titleSpan.style.fontWeight = '500';
    titleSpan.style.fontSize = '13px';
    titleSpan.textContent = theme.name;
    info.appendChild(titleSpan);

    card.appendChild(info);

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '8px';

    const applyBtn = document.createElement('button');
    applyBtn.className = 'btn-secondary';
    applyBtn.style.padding = '4px 10px';
    applyBtn.style.fontSize = '11px';
    applyBtn.textContent = config.theme === theme.id ? 'Active' : 'Apply';
    applyBtn.onclick = () => {
      config.theme = theme.id;
      applyTheme(theme.id);
      saveConfig();
      renderThemeManagerList();
    };
    actions.appendChild(applyBtn);

    if (!theme.isPreset) {
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-danger';
      deleteBtn.style.padding = '4px 8px';
      deleteBtn.style.fontSize = '11px';
      deleteBtn.textContent = '🗑️';
      deleteBtn.onclick = () => {
        config.customThemes = config.customThemes.filter(t => t.id !== theme.id);
        if (config.theme === theme.id) {
          config.theme = 'system';
          applyTheme('system');
        }
        saveConfig();
        renderThemeManagerList();
      };
      actions.appendChild(deleteBtn);
    }

    card.appendChild(actions);
    listContainer.appendChild(card);
  });
}

function openSettingsModal() {
  const themeSelect = document.getElementById('theme-select');
  populateThemeSelectOptions(themeSelect, false);
  themeSelect.value = config.theme;

  document.getElementById('language-select').value = config.language;
  document.getElementById('privacy-blur-checkbox').checked = !!config.privacyBlur;
  document.getElementById('tab-close-prompt-checkbox').checked = config.tabClosePrompt !== false;
  document.getElementById('tray-icon-checkbox').checked = config.trayIcon !== false;
  document.getElementById('close-to-tray-checkbox').checked = !!config.closeToTray;
  document.getElementById('launch-minimized-checkbox').checked = !!config.launchMinimized;
  document.getElementById('auto-launch-checkbox').checked = !!config.autoLaunch;
  document.getElementById('exit-prompt-checkbox').checked = !!config.exitPrompt;
  document.getElementById('prevent-enter-checkbox').checked = !!config.preventEnter;
  document.getElementById('notif-badge-checkbox').checked = config.notificationBadge !== false;
  document.getElementById('show-save-dialog-checkbox').checked = config.showSaveDialog !== false;
  document.getElementById('default-download-dir-input').value = config.defaultDownloadDir || '';

  settingsModal.classList.add('active');
}

function showTabContextMenu(x, y, tabId) {
  hideContextMenus();
  contextMenuTabId = tabId;
  const tab = config.tabs.find(t => t.id === tabId);
  if (!tab) return;

  const muteItem = document.getElementById('ctx-mute-tab');
  if (muteItem) {
    const isId = config.language === 'id-id';
    muteItem.querySelector('span').textContent = tab.isMuted 
      ? (isId ? 'Bunyikan Suara' : 'Unmute Audio') 
      : (isId ? 'Bisukan Suara' : 'Mute Audio');
  }

  tabContextMenu.style.left = `${Math.min(x, window.innerWidth - 200)}px`;
  tabContextMenu.style.top = `${Math.min(y, window.innerHeight - 180)}px`;
  tabContextMenu.style.display = 'block';
}

function showImageContextMenu(x, y, data) {
  hideContextMenus();
  imageContextData = data;

  const copyUrlItem = document.getElementById('ctx-copy-image-url');
  const openExtItem = document.getElementById('ctx-img-open-external');
  const sep = document.getElementById('ctx-img-action-sep');

  const hasHttpUrl = data && data.src && (data.src.startsWith('http://') || data.src.startsWith('https://') || data.src.startsWith('blob:'));
  if (copyUrlItem) copyUrlItem.style.display = hasHttpUrl ? 'flex' : 'none';
  if (openExtItem) openExtItem.style.display = (hasHttpUrl && !data.src.startsWith('blob:')) ? 'flex' : 'none';
  if (sep) sep.style.display = hasHttpUrl ? 'block' : 'none';

  imageContextMenu.style.left = `${Math.min(x, window.innerWidth - 220)}px`;
  imageContextMenu.style.top = `${Math.min(y, window.innerHeight - 180)}px`;
  imageContextMenu.style.display = 'block';
}

function hideContextMenus() {
  if (tabContextMenu) tabContextMenu.style.display = 'none';
  if (imageContextMenu) imageContextMenu.style.display = 'none';
  if (menuDropdown) menuDropdown.style.display = 'none';
}

// Event Listeners Setup
function setupEventListeners() {
  // Global Click to dismiss menus
  document.addEventListener('click', (e) => {
    if (!hamburgerBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
      menuDropdown.style.display = 'none';
    }
    if (!tabContextMenu.contains(e.target)) {
      tabContextMenu.style.display = 'none';
    }
    if (!imageContextMenu.contains(e.target)) {
      imageContextMenu.style.display = 'none';
    }
  });

  // Image Context Menu Action Handlers
  document.getElementById('ctx-copy-image')?.addEventListener('click', () => {
    if (imageContextData) {
      if (imageContextData.dataUrl) {
        window.electronAPI.copyImageToClipboard(imageContextData.dataUrl);
      } else if (imageContextData.src) {
        window.electronAPI.copyImageToClipboard(imageContextData.src);
      }
    }
    imageContextMenu.style.display = 'none';
  });

  document.getElementById('ctx-copy-image-url')?.addEventListener('click', () => {
    if (imageContextData && imageContextData.src) {
      navigator.clipboard.writeText(imageContextData.src);
    }
    imageContextMenu.style.display = 'none';
  });

  document.getElementById('ctx-save-image')?.addEventListener('click', () => {
    if (imageContextData) {
      const urlToDownload = imageContextData.dataUrl || imageContextData.src;
      if (urlToDownload) {
        window.electronAPI.downloadURL(urlToDownload);
      }
    }
    imageContextMenu.style.display = 'none';
  });

  document.getElementById('ctx-img-open-external')?.addEventListener('click', () => {
    if (imageContextData && imageContextData.src) {
      window.electronAPI.openExternal(imageContextData.src);
    }
    imageContextMenu.style.display = 'none';
  });

  // Hamburger Toggle
  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuDropdown.style.display = menuDropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Add Tab
  addTabBtn.addEventListener('click', (e) => {
    if (e.shiftKey) addNewTab(true);
    else addNewTab(false);
  });

  document.getElementById('bottom-add-tab-btn')?.addEventListener('click', () => {
    addNewTab(false);
  });

  // Tab Bar Scroll Buttons
  scrollLeftBtn.addEventListener('click', () => {
    tabsBar.scrollBy({ left: -200, behavior: 'smooth' });
    setTimeout(updateScrollButtonsVisibility, 250);
  });
  scrollRightBtn.addEventListener('click', () => {
    tabsBar.scrollBy({ left: 200, behavior: 'smooth' });
    setTimeout(updateScrollButtonsVisibility, 250);
  });
  tabsBar.addEventListener('scroll', updateScrollButtonsVisibility);

  // New Chat Modal
  document.getElementById('menu-start-new-chat').addEventListener('click', () => {
    menuDropdown.style.display = 'none';
    openNewChatModal();
  });
  document.getElementById('close-new-chat-btn').addEventListener('click', () => newChatModal.classList.remove('active'));
  document.getElementById('cancel-chat-btn').addEventListener('click', () => newChatModal.classList.remove('active'));
  
  document.getElementById('start-chat-btn').addEventListener('click', () => {
    const rawNumber = document.getElementById('new-chat-phone-input').value.trim();
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    if (!cleanNumber) return;

    const targetType = document.getElementById('new-chat-target-select').value;
    const url = `https://web.whatsapp.com/send/?phone=${cleanNumber}`;

    if (targetType === 'new') {
      addNewTab(false);
      setTimeout(() => {
        const webview = getActiveWebview();
        if (webview) webview.src = url;
      }, 200);
    } else {
      const webview = getActiveWebview();
      if (webview) webview.src = url;
    }

    newChatModal.classList.remove('active');
  });

  // Menu Items
  document.getElementById('menu-new-tab').addEventListener('click', () => {
    addNewTab(false);
    menuDropdown.style.display = 'none';
  });
  document.getElementById('menu-new-incognito-tab').addEventListener('click', () => {
    addNewTab(true);
    menuDropdown.style.display = 'none';
  });
  document.getElementById('menu-theme-manager').addEventListener('click', () => {
    menuDropdown.style.display = 'none';
    openThemeManagerModal();
  });
  document.getElementById('menu-settings').addEventListener('click', () => {
    menuDropdown.style.display = 'none';
    openSettingsModal();
  });
  document.getElementById('menu-exit').addEventListener('click', () => {
    window.electronAPI.exit();
  });
  document.getElementById('menu-reload').addEventListener('click', () => {
    const webview = getActiveWebview();
    if (webview) webview.reload();
    menuDropdown.style.display = 'none';
  });
  document.getElementById('menu-devtools').addEventListener('click', () => {
    window.electronAPI.toggleDevTools();
    menuDropdown.style.display = 'none';
  });
  document.getElementById('menu-zoom-in').addEventListener('click', () => {
    const webview = getActiveWebview();
    if (webview) {
      activeZoomFactor = Math.min(2.0, activeZoomFactor + 0.1);
      webview.setZoomFactor(activeZoomFactor);
    }
  });
  document.getElementById('menu-zoom-out').addEventListener('click', () => {
    const webview = getActiveWebview();
    if (webview) {
      activeZoomFactor = Math.max(0.5, activeZoomFactor - 0.1);
      webview.setZoomFactor(activeZoomFactor);
    }
  });
  document.getElementById('menu-zoom-reset').addEventListener('click', () => {
    const webview = getActiveWebview();
    if (webview) {
      activeZoomFactor = 1.0;
      webview.setZoomFactor(1.0);
    }
  });
  document.getElementById('menu-help').addEventListener('click', () => {
    helpModal.classList.add('active');
    menuDropdown.style.display = 'none';
  });
  document.getElementById('menu-about').addEventListener('click', () => {
    aboutModal.classList.add('active');
    menuDropdown.style.display = 'none';
  });

  // Tab Context Menu Items
  document.getElementById('ctx-reload-tab').addEventListener('click', () => {
    if (contextMenuTabId) {
      const webview = document.getElementById(`webview-${contextMenuTabId}`);
      if (webview) webview.reload();
    }
    hideContextMenus();
  });

  document.getElementById('ctx-mute-tab').addEventListener('click', () => {
    if (contextMenuTabId) {
      const tab = config.tabs.find(t => t.id === contextMenuTabId);
      const webview = document.getElementById(`webview-${contextMenuTabId}`);
      if (tab) {
        tab.isMuted = !tab.isMuted;
        if (webview) webview.setAudioMuted(tab.isMuted);
        const tabEl = document.getElementById(`tab-${tab.id}`);
        if (tabEl) tabEl.classList.toggle('is-muted', tab.isMuted);
        saveConfig();
        updateTotalUnreadBadges();
      }
    }
    hideContextMenus();
  });

  document.getElementById('ctx-settings-tab').addEventListener('click', () => {
    if (contextMenuTabId) openTabEditModal(contextMenuTabId);
    hideContextMenus();
  });

  document.getElementById('ctx-rename-tab').addEventListener('click', () => {
    if (contextMenuTabId) openTabEditModal(contextMenuTabId);
    hideContextMenus();
  });

  document.getElementById('ctx-close-tab').addEventListener('click', () => {
    if (contextMenuTabId) closeTab(contextMenuTabId);
    hideContextMenus();
  });

  // Tab Edit Modal Handlers
  document.getElementById('close-edit-modal-btn').addEventListener('click', () => editModal.classList.remove('active'));
  document.getElementById('cancel-tab-name').addEventListener('click', () => editModal.classList.remove('active'));

  // Color circle clicks
  document.querySelectorAll('#tab-color-presets .color-circle').forEach(circle => {
    circle.addEventListener('click', () => {
      document.querySelectorAll('#tab-color-presets .color-circle').forEach(c => c.classList.remove('selected'));
      circle.classList.add('selected');
    });
  });

  document.getElementById('save-tab-name').addEventListener('click', () => {
    if (!editingTabId) return;
    const tab = config.tabs.find(t => t.id === editingTabId);
    if (!tab) return;

    const newName = document.getElementById('tab-name-input').value.trim();
    if (newName) tab.name = newName;

    const selectedColor = document.querySelector('#tab-color-presets .color-circle.selected')?.dataset.color || '';
    tab.color = selectedColor;

    const selectedTheme = document.getElementById('tab-theme-select').value;
    tab.theme = selectedTheme;

    tab.isMuted = document.getElementById('tab-mute-checkbox').checked;
    tab.notifications = document.getElementById('tab-notifications-checkbox').checked;

    const webview = document.getElementById(`webview-${tab.id}`);
    if (webview) {
      webview.setAudioMuted(tab.isMuted);
      applyThemeToWebview(tab.id, tab.theme || config.theme);
    }

    const tabEl = document.getElementById(`tab-${tab.id}`);
    if (tabEl) {
      tabEl.querySelector('.tab-text-node').textContent = tab.name;
      tabEl.classList.toggle('has-custom-color', !!tab.color);
      tabEl.classList.toggle('is-muted', !!tab.isMuted);
      const stripe = tabEl.querySelector('.tab-color-stripe');
      if (stripe) stripe.style.backgroundColor = tab.color || '';
    }

    saveConfig();
    updateTotalUnreadBadges();
    editModal.classList.remove('active');
  });

  // Theme Manager Handlers
  document.getElementById('close-theme-manager-btn').addEventListener('click', () => themeManagerModal.classList.remove('active'));
  document.getElementById('close-theme-manager').addEventListener('click', () => themeManagerModal.classList.remove('active'));
  document.getElementById('open-theme-manager-btn').addEventListener('click', () => {
    settingsModal.classList.remove('active');
    openThemeManagerModal();
  });

  document.getElementById('save-custom-theme-btn').addEventListener('click', () => {
    const name = document.getElementById('custom-theme-name').value.trim() || 'Custom Theme';
    const bg = document.getElementById('custom-theme-bg').value;
    const fg = document.getElementById('custom-theme-fg').value;
    const ac = document.getElementById('custom-theme-ac').value;
    const css = document.getElementById('custom-theme-css').value.trim();

    const customTheme = {
      id: 'custom-' + Date.now(),
      name: name,
      colors: { bg, fg, ac },
      css: css || undefined
    };

    config.customThemes.push(customTheme);
    config.theme = customTheme.id;
    applyTheme(customTheme.id);
    saveConfig();
    renderThemeManagerList();
    document.getElementById('custom-theme-name').value = '';
    document.getElementById('custom-theme-css').value = '';
  });

  // Settings Tabs Navigation
  document.querySelectorAll('.settings-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.settings-nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target)?.classList.add('active');
    });
  });

  document.getElementById('close-settings-x-btn').addEventListener('click', () => settingsModal.classList.remove('active'));
  document.getElementById('close-settings').addEventListener('click', () => settingsModal.classList.remove('active'));
  document.getElementById('close-help-btn').addEventListener('click', () => helpModal.classList.remove('active'));
  document.getElementById('close-help-modal-btn').addEventListener('click', () => helpModal.classList.remove('active'));
  document.getElementById('close-about').addEventListener('click', () => aboutModal.classList.remove('active'));

  // Browse Download Dir
  document.getElementById('browse-download-dir-btn').addEventListener('click', async () => {
    const dir = await window.electronAPI.selectDownloadDir();
    if (dir) {
      document.getElementById('default-download-dir-input').value = dir;
    }
  });

  // Reset Window Button
  document.getElementById('reset-window-btn').addEventListener('click', () => {
    window.electronAPI.resetWindow();
  });

  // Save Settings
  document.getElementById('save-settings').addEventListener('click', () => {
    config.theme = document.getElementById('theme-select').value;
    config.language = document.getElementById('language-select').value;
    config.privacyBlur = document.getElementById('privacy-blur-checkbox').checked;
    config.tabClosePrompt = document.getElementById('tab-close-prompt-checkbox').checked;
    config.trayIcon = document.getElementById('tray-icon-checkbox').checked;
    config.closeToTray = document.getElementById('close-to-tray-checkbox').checked;
    config.launchMinimized = document.getElementById('launch-minimized-checkbox').checked;
    config.autoLaunch = document.getElementById('auto-launch-checkbox').checked;
    config.exitPrompt = document.getElementById('exit-prompt-checkbox').checked;
    config.preventEnter = document.getElementById('prevent-enter-checkbox').checked;
    config.notificationBadge = document.getElementById('notif-badge-checkbox').checked;
    config.showSaveDialog = document.getElementById('show-save-dialog-checkbox').checked;
    config.defaultDownloadDir = document.getElementById('default-download-dir-input').value;

    applyTheme(config.theme);
    applyLanguage(config.language);

    document.querySelectorAll('webview').forEach(webview => {
      applyPrivacyBlurToWebview(webview, config.privacyBlur);
    });

    updateTotalUnreadBadges();
    saveConfig();
    settingsModal.classList.remove('active');
  });

  // Edit Menu Items
  document.getElementById('menu-undo')?.addEventListener('click', () => {
    const webview = getActiveWebview();
    if (webview) webview.undo();
    menuDropdown.style.display = 'none';
  });
  document.getElementById('menu-redo')?.addEventListener('click', () => {
    const webview = getActiveWebview();
    if (webview) webview.redo();
    menuDropdown.style.display = 'none';
  });
  document.getElementById('menu-cut')?.addEventListener('click', () => {
    const webview = getActiveWebview();
    if (webview) webview.cut();
    menuDropdown.style.display = 'none';
  });
  document.getElementById('menu-copy')?.addEventListener('click', () => {
    const webview = getActiveWebview();
    if (webview) webview.copy();
    menuDropdown.style.display = 'none';
  });
  document.getElementById('menu-paste')?.addEventListener('click', () => {
    const webview = getActiveWebview();
    if (webview) webview.paste();
    menuDropdown.style.display = 'none';
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
      if (e.shiftKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        addNewTab(true);
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        addNewTab(false);
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        openNewChatModal();
      } else if (e.key === ',') {
        e.preventDefault();
        openSettingsModal();
      } else if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        if (activeTabId) closeTab(activeTabId);
      }
    }
  });
}

// Start application
window.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  setupIPCListeners();
  init();
});
