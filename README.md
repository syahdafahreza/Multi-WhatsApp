[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<h1 id="english">Multi-WhatsApp 📱</h1>

Multi-WhatsApp is a lightweight, feature-packed multi-tab desktop application built with Electron that allows you to manage multiple WhatsApp accounts simultaneously in a single window. Perfect for users who need to handle personal, work, and business accounts without switching browsers or profiles.

![Multi-WhatsApp Screenshot](https://github.com/user-attachments/assets/7f3a04b3-5c0e-47ad-9d45-29e4a5cd8405)

## ✨ Features

- **Multiple Accounts:** Run as many WhatsApp accounts as you need in separate, isolated tabs.
- **Persistent Sessions:** Each tab uses its own persistent partition, so you stay logged in even after restarting the app.
- **Incognito Tab Mode:** Open temporary, private WhatsApp sessions (`Ctrl+Shift+N` or `Shift + Click` on `+`) that use in-memory partitions. Their session data is never stored on disk, the tab isn't saved on exit, and they perform an automatic server-side logout when closed. Marked with a distinct `👤` icon.
- **Start New Chat Directly:** Open conversations with any phone number without saving them to your address book (`Ctrl+N` or Menu > File > Start New Chat).
- **System Tray & Background Running:** Minimize or close to the system tray with a right-click tray context menu to keep Multi-WhatsApp running in the background.
- **Unread Notification Badges:** Automatic detection of unread messages across tabs displaying unread count badges on individual tabs and on the app/tray icon.
- **Chat Formatting Shortcuts:** Format message text instantly with native keyboard shortcuts (`Ctrl+B` for **\*Bold\***, `Ctrl+I` for _\_Italic\__, `Ctrl+S` for ~~Strikethrough~~, `Ctrl+M` for ```` ```Monospace``` ````).
- **Prevent Accidental Enter:** Optional setting to insert a new line with `Enter` and send messages with `Ctrl+Enter`.
- **Theme Manager & Color Presets:** Built-in color presets (Dark Plus, Dark Mint, Purplish, Coffee, Light) and custom theme creator with CSS and color palette overrides.
- **Per-Tab Customization:** Assign distinct colors, mute individual tab notification sounds, and choose per-tab themes.
- **Privacy Blur:** Protect your privacy in public or shared spaces. When enabled in Settings (`Ctrl+,`), it blurs contact names, message previews, profile photos, and media. Simply hover your cursor over any blurred element to reveal it instantly, with smooth row-based unblurring in the sidebar.
- **Scrollable Tab Navigation:** Navigation buttons (`<` and `>`) appear dynamically when tabs overflow, allowing easy scrolling.
- **Zoom Controls:** Native zoom controls (`Ctrl+=` / `Ctrl+-` / `Ctrl+0`) for chat text resizing.
- **Auto-Launch on Startup:** Option to automatically launch Multi-WhatsApp when Windows boots up.
- **Download Management:** Customizable download directory and toggle to prompt before saving files.
- **Deep-Link Protocol Support:** Handles `whatsapp://` and `wa.me` links automatically.
- **Tab Context Menu:** Right-click on any tab to quickly rename, mute, configure settings, reload, or close it.
- **Dynamic UI Styling:** Premium 2026 WhatsApp Web aesthetic with smooth corner clipping and border strokes that apply after loading.
- **Persistent Window State:** The app remembers your window size, position, and maximized status across sessions.
- **Multi-Architecture Support:** Build artifacts available for x86, x64, and ARM architectures.
- **External Link Handling:** Automatically opens links in your system's default browser to keep your chat environment clean.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Umarkov/Multi-WhatsApp.git
   cd Multi-WhatsApp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

## 🛠️ Usage & Shortcuts

| Shortcut | Description |
| :--- | :--- |
| **`Ctrl + T`** | Add New WhatsApp Tab |
| **`Ctrl + Shift + N`** | Add Incognito Tab (Private Session) |
| **`Ctrl + N`** | Start New Chat with Phone Number |
| **`Ctrl + ,`** | Open Settings Modal |
| **`Ctrl + B`** | Bold Text in Chat (`*text*`) |
| **`Ctrl + I`** | Italic Text in Chat (`_text_`) |
| **`Ctrl + S`** | Strikethrough Text in Chat (`~text~`) |
| **`Ctrl + M`** | Monospace Text in Chat (```` ```text``` ````) |
| **`Ctrl + =` / `Ctrl + +`** | Zoom In |
| **`Ctrl + -`** | Zoom Out |
| **`Ctrl + 0`** | Reset Zoom |
| **`Ctrl + R`** | Reload Tab |
| **`Ctrl + Q`** | Quit Application |

## 📦 Changelog

### v1.1.0 (Merged Altus 5.8.1 Features)
- **New Feature:** Added "Start New Chat" modal dialog (`Ctrl+N`) to initiate direct chats without saving contacts.
- **New Feature:** System tray support with tray icon, context menu, and background running.
- **New Feature:** Added "Close to Tray" and "Launch Minimized" options in Settings.
- **New Feature:** Unread message count badges displayed on individual tabs and on the taskbar/tray icons.
- **New Feature:** In-chat text formatting shortcuts (`Ctrl+B`, `Ctrl+I`, `Ctrl+S`, `Ctrl+M`).
- **New Feature:** "Prevent Accidental Enter" setting (Enter = newline, Ctrl+Enter = send).
- **New Feature:** Full Theme Manager with built-in presets (Dark Plus, Dark Mint, Purplish, Coffee) and custom color palette / CSS creator.
- **New Feature:** Per-tab custom settings: tab color stripes, audio mute toggle, notifications toggle, and per-tab themes.
- **New Feature:** Tab close confirmation prompt.
- **New Feature:** Auto-launch on Windows startup and download directory configuration.
- **New Feature:** Deep-link handler for `whatsapp://` URLs.
- **Enhanced:** Expanded Settings modal with category tabs (General, Tabs, System & Tray, Chat & Behavior, Downloads).
- **Enhanced:** Full bilingual support for English and Bahasa Indonesia across all new features.

---

## 💻 Tech Stack

- **Framework:** [Electron](https://www.electronjs.org/)
- **Frontend:** Vanilla HTML, CSS, and JavaScript
- **Storage:** JSON-based configuration for tab persistence and window state

## 🧪 Current Status & Experiments

> [!NOTE]
> **User Agent Experiment:** I am currently experimenting with mimicking the official WhatsApp Desktop User Agent to ensure full compatibility and bypass "unsupported browser" warnings. Currently, this implementation is still in progress and has not yet successfully spoofed the desktop client detection.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<h1 id="bahasa-indonesia">Multi-WhatsApp 📱 (Bahasa Indonesia)</h1>

Multi-WhatsApp adalah aplikasi desktop multi-tab kaya fitur berbasis Electron yang memungkinkan Anda mengelola beberapa akun WhatsApp secara bersamaan dalam satu jendela. Sangat cocok bagi pengguna yang perlu menangani akun pribadi, pekerjaan, dan bisnis tanpa harus berganti browser atau profil.

![Multi-WhatsApp Screenshot](https://github.com/user-attachments/assets/7f3a04b3-5c0e-47ad-9d45-29e4a5cd8405)

## ✨ Fitur

- **Banyak Akun:** Jalankan sebanyak mungkin akun WhatsApp yang Anda butuhkan di tab yang terpisah dan terisolasi.
- **Sesi Persisten:** Setiap tab menggunakan partisi persistennya sendiri, sehingga Anda tetap masuk bahkan setelah me-restart aplikasi.
- **Mode Tab Incognito:** Buka sesi WhatsApp privat sementara (`Ctrl+Shift+N` atau `Shift + Klik` pada `+`) menggunakan partisi dalam memori (in-memory). Data sesi tidak akan disimpan di disk, tab tidak disimpan saat aplikasi ditutup, dan otomatis melakukan logout di server saat tab ditutup. Ditandai dengan ikon `👤` khusus.
- **Mulai Chat Baru Langsung:** Buka obrolan dengan nomor telepon mana pun tanpa perlu menyimpannya ke kontak (`Ctrl+N` atau Menu > Berkas > Mulai Chat Baru).
- **System Tray & Berjalan di Latar Belakang:** Minimalkan atau tutup aplikasi ke area notifikasi (system tray) dengan menu klik kanan untuk tetap menerima notifikasi.
- **Lencana Pesan Belum Dibaca (Unread Badges):** Deteksi otomatis jumlah pesan belum dibaca yang ditampilkan pada tab serta ikon taskbar/tray.
- **Pintasan Format Teks Obrolan:** Format teks pesan secara instan dengan pintasan keyboard (`Ctrl+B` untuk **\*Tebal\***, `Ctrl+I` untuk _\_Miring\__, `Ctrl+S` untuk ~~Coret~~, `Ctrl+M` untuk ```` ```Monospace``` ````).
- **Cegah Terkirim Otomatis dengan Enter:** Opsi agar tombol `Enter` membuat baris baru, dan `Ctrl+Enter` untuk mengirim pesan.
- **Manajer Tema & Preset Warna:** Preset warna bawaan (Dark Plus, Dark Mint, Purplish, Coffee, Terang) dan pembuat tema kustom dengan palet warna dan CSS sendiri.
- **Kustomisasi Per-Tab:** Beri warna khusus pada tab, bisukan suara notifikasi tab tertentu, dan atur tema per tab.
- **Blur Privasi (Privacy Blur):** Lindungi privasi Anda di tempat umum atau layar bersama. Ketika diaktifkan di Pengaturan (`Ctrl+,`), fitur ini akan memburamkan nama kontak, pratonton pesan, foto profil, dan media. Cukup arahkan kursor ke elemen yang diburamkan untuk melihatnya secara instan.
- **Navigasi Tab Dapat Digulir:** Tombol navigasi (`<` dan `>`) muncul secara dinamis saat tab meluap, memungkinkan pengguliran yang mudah.
- **Kontrol Pembesaran (Zoom):** Atur ukuran zoom tampilan webview (`Ctrl+=` / `Ctrl+-` / `Ctrl+0`).
- **Jalankan Otomatis Saat Startup:** Opsi menjalankan Multi-WhatsApp otomatis saat komputer dinyalakan.
- **Manajemen Unduhan:** Tentukan folder unduhan default dan opsi konfirmasi penyimpanan file.
- **Dukungan Protokol URL:** Menangani tautan `whatsapp://` dan `wa.me` secara otomatis.
- **Menu Konteks Tab:** Klik kanan pada tab apa saja untuk mengganti nama, membisukan suara, membuka pengaturan tab, memuat ulang, atau menutupnya.
- **Desain UI Dinamis:** Estetika WhatsApp Web modern 2026 dengan clipping sudut yang halus dan border stroke yang muncul setelah loading selesai.
- **Persistensi Status Jendela:** Aplikasi mengingat ukuran jendela, posisi, dan status dimaksimalkan antar sesi.
- **Dukungan Multi-Arsitektur:** Artefak build tersedia untuk arsitektur x86, x64, dan ARM.
- **Penanganan Tautan Eksternal:** Secara otomatis membuka tautan di browser default sistem Anda agar lingkungan obrolan Anda tetap bersih.

## 🚀 Memulai

### Prasyarat

- [Node.js](https://nodejs.org/) (disarankan v14 atau lebih tinggi)
- npm (bawaan Node.js)

### Instalasi

1. **Kloning repositori:**
   ```bash
   git clone https://github.com/Umarkov/Multi-WhatsApp.git
   cd Multi-WhatsApp
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Mulai aplikasi:**
   ```bash
   npm start
   ```

## 🛠️ Penggunaan & Pintasan Keyboard

| Pintasan | Deskripsi |
| :--- | :--- |
| **`Ctrl + T`** | Tambah Tab WhatsApp Baru |
| **`Ctrl + Shift + N`** | Buka Tab Incognito (Sesi Privat) |
| **`Ctrl + N`** | Mulai Chat Baru dengan Nomor Telepon |
| **`Ctrl + ,`** | Buka Modal Pengaturan |
| **`Ctrl + B`** | Format Teks Tebal (*teks*) |
| **`Ctrl + I`** | Format Teks Miring (_teks_) |
| **`Ctrl + S`** | Format Teks Coret (~teks~) |
| **`Ctrl + M`** | Format Teks Monospace (```` ```teks``` ````) |
| **`Ctrl + =` / `Ctrl + +`** | Perbesar Tampilan (Zoom In) |
| **`Ctrl + -`** | Perkecil Tampilan (Zoom Out) |
| **`Ctrl + 0`** | Reset Zoom |
| **`Ctrl + R`** | Muat Ulang Tab |
| **`Ctrl + Q`** | Keluar dari Aplikasi |

## 📦 Log Perubahan (Changelog)

### v1.1.0 (Integrasi Fitur Altus 5.8.1)
- **Fitur Baru:** Dialog "Mulai Chat Baru" (`Ctrl+N`) untuk langsung chat ke nomor telepon tanpa simpan kontak.
- **Fitur Baru:** Dukungan System Tray dengan ikon tray, menu klik kanan, dan kemampuan berjalan di latar belakang.
- **Fitur Baru:** Opsi "Close to Tray" dan "Launch Minimized" di Pengaturan.
- **Fitur Baru:** Lencana notifikasi unread (jumlah pesan belum dibaca) di setiap tab dan ikon taskbar/tray.
- **Fitur Baru:** Pintasan format teks obrolan (`Ctrl+B`, `Ctrl+I`, `Ctrl+S`, `Ctrl+M`).
- **Fitur Baru:** Pengaturan "Cegah Terkirim Otomatis dengan Enter" (Enter = baris baru, Ctrl+Enter = kirim pesan).
- **Fitur Baru:** Manajer Tema lengkap dengan preset bawaan (Dark Plus, Dark Mint, Purplish, Coffee) dan pembuat palet/CSS kustom.
- **Fitur Baru:** Pengaturan kustom per-tab: strip warna tab, toggle mute suara, toggle notifikasi, dan tema per-tab.
- **Fitur Baru:** Konfirmasi sebelum menutup tab aktif.
- **Fitur Baru:** Opsi Startup otomatis (Auto-Launch) dan konfigurasi folder unduhan default.
- **Fitur Baru:** Penangan deep-link URL `whatsapp://`.
- **Peningkatan:** Modal Pengaturan yang diperluas dengan kategori (Umum, Tab, Sistem & Tray, Obrolan, Unduhan).
- **Peningkatan:** Dukungan dwi-bahasa lengkap (Bahasa Indonesia & English) untuk semua fitur baru.

---

## 💻 Tech Stack

- **Framework:** [Electron](https://www.electronjs.org/)
- **Frontend:** HTML Vanilla, CSS, dan JavaScript
- **Penyimpanan:** Konfigurasi berbasis JSON untuk persistensi tab dan status jendela

## 🧪 Status Saat Ini & Eksperimen

> [!NOTE]
> **Eksperimen User Agent:** Saat ini saya masih bereksperimen menyamakan user agent sehingga terdeteksi seperti whatsapp desktop asli untuk memastikan kompatibilitas penuh dan menghindari peringatan "browser tidak didukung", tetapi saat ini masih gagal.

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detailnya.

---

*Dibuat dengan ❤️ untuk produktivitas.*
