use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

fn get_config_path(app: &AppHandle) -> PathBuf {
    let app_dir = app
        .path()
        .app_data_dir()
        .unwrap_or_else(|_| PathBuf::from("."));
    if !app_dir.exists() {
        let _ = fs::create_dir_all(&app_dir);
    }
    app_dir.join("config.json")
}

#[tauri::command]
fn load_config(app: AppHandle) -> serde_json::Value {
    let path = get_config_path(&app);
    if path.exists() {
        if let Ok(data) = fs::read_to_string(path) {
            if let Ok(json) = serde_json::from_str(&data) {
                return json;
            }
        }
    }
    serde_json::json!({
        "tabs": [],
        "theme": "system",
        "language": "en-us",
        "privacyBlur": false,
        "trayIcon": true,
        "closeToTray": false,
        "exitPrompt": false,
        "tabClosePrompt": true,
        "preventEnter": false,
        "notificationBadge": true,
        "launchMinimized": false,
        "autoLaunch": false,
        "showSaveDialog": true,
        "defaultDownloadDir": ""
    })
}

#[tauri::command]
fn save_config(app: AppHandle, config: serde_json::Value) -> Result<(), String> {
    let path = get_config_path(&app);
    let str_data = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;
    fs::write(path, str_data).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn open_external(url: String) -> Result<(), String> {
    open::that(url).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn exit_app(app: AppHandle) {
    app.exit(0);
}

#[tauri::command]
fn reload_window(app: AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.eval("window.location.reload()");
    }
}

#[tauri::command]
fn reset_window(app: AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.set_size(tauri::Size::Logical(tauri::LogicalSize {
            width: 1200.0,
            height: 800.0,
        }));
        let _ = window.center();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--minimized"]),
        ))
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![
            load_config,
            save_config,
            open_external,
            exit_app,
            reload_window,
            reset_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
