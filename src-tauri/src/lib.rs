use std::fs;
use std::path::PathBuf;
use tauri::{
    AppHandle, LogicalPosition, LogicalSize, Manager, Position, Rect, Size, WebviewBuilder,
    WebviewUrl,
};

const CHROME_USER_AGENT: &str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const TOP_BAR_HEIGHT: f64 = 48.0;

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

// Native Child Webview Management
#[tauri::command]
fn create_tab_webview(
    app: AppHandle,
    tab_id: String,
    is_incognito: bool,
    url: Option<String>,
) -> Result<(), String> {
    let target_url = url.unwrap_or_else(|| "https://web.whatsapp.com".to_string());
    let parsed_url: url::Url = target_url.parse().map_err(|e: url::ParseError| e.to_string())?;

    if let Some(window) = app.get_webview_window("main") {
        let label = format!("tab-{}", tab_id);
        if app.get_webview(&label).is_some() {
            switch_tab_webview(app, tab_id)?;
            return Ok(());
        }

        let win_size = window
            .inner_size()
            .unwrap_or(tauri::PhysicalSize::new(1200, 800));
        let scale = window.scale_factor().unwrap_or(1.0);
        let logical_w = win_size.width as f64 / scale;
        let logical_h = win_size.height as f64 / scale;
        let content_h = (logical_h - TOP_BAR_HEIGHT).max(100.0);

        let mut builder = WebviewBuilder::new(&label, WebviewUrl::External(parsed_url))
            .user_agent(CHROME_USER_AGENT)
            .incognito(is_incognito)
            .auto_resize();

        let app_dir = app
            .path()
            .app_data_dir()
            .unwrap_or_else(|_| PathBuf::from("."));
        if !is_incognito {
            let data_dir = app_dir.join(format!("session-{}", tab_id));
            let _ = fs::create_dir_all(&data_dir);
            builder = builder.data_directory(data_dir);
        }

        let pos = LogicalPosition::new(0.0, TOP_BAR_HEIGHT);
        let size = LogicalSize::new(logical_w, content_h);

        window
            .add_child(builder, pos, size)
            .map_err(|e| e.to_string())?;

        switch_tab_webview(app, tab_id)?;
    }
    Ok(())
}

#[tauri::command]
fn switch_tab_webview(app: AppHandle, tab_id: String) -> Result<(), String> {
    let target_label = format!("tab-{}", tab_id);
    if let Some(window) = app.get_webview_window("main") {
        let win_size = window
            .inner_size()
            .unwrap_or(tauri::PhysicalSize::new(1200, 800));
        let scale = window.scale_factor().unwrap_or(1.0);
        let logical_w = win_size.width as f64 / scale;
        let logical_h = win_size.height as f64 / scale;
        let content_h = (logical_h - TOP_BAR_HEIGHT).max(100.0);

        for (label, webview) in app.webviews() {
            if label.starts_with("tab-") {
                if label == target_label {
                    let _ = webview.set_bounds(Rect {
                        position: Position::Logical(LogicalPosition::new(0.0, TOP_BAR_HEIGHT)),
                        size: Size::Logical(LogicalSize::new(logical_w, content_h)),
                    });
                    let _ = webview.show();
                    let _ = webview.set_focus();
                } else {
                    let _ = webview.hide();
                    let _ = webview.set_bounds(Rect {
                        position: Position::Logical(LogicalPosition::new(-9999.0, -9999.0)),
                        size: Size::Logical(LogicalSize::new(1.0, 1.0)),
                    });
                }
            }
        }
    }
    Ok(())
}

#[tauri::command]
fn close_tab_webview(app: AppHandle, tab_id: String) -> Result<(), String> {
    let label = format!("tab-{}", tab_id);
    if let Some(webview) = app.get_webview(&label) {
        let _ = webview.close();
    }
    Ok(())
}

#[tauri::command]
fn reload_tab_webview(app: AppHandle, tab_id: String) -> Result<(), String> {
    let label = format!("tab-{}", tab_id);
    if let Some(webview) = app.get_webview(&label) {
        let _ = webview.eval("window.location.reload()");
    }
    Ok(())
}

#[tauri::command]
fn load_url_tab_webview(app: AppHandle, tab_id: String, url: String) -> Result<(), String> {
    let label = format!("tab-{}", tab_id);
    if let Some(webview) = app.get_webview(&label) {
        let _ = webview.eval(&format!("window.location.href = '{}'", url));
    }
    Ok(())
}

#[tauri::command]
fn eval_tab_webview(app: AppHandle, tab_id: String, script: String) -> Result<(), String> {
    let label = format!("tab-{}", tab_id);
    if let Some(webview) = app.get_webview(&label) {
        let _ = webview.eval(&script);
    }
    Ok(())
}

#[tauri::command]
fn resize_tab_webviews(app: AppHandle, width: f64, height: f64) -> Result<(), String> {
    let content_h = (height - TOP_BAR_HEIGHT).max(100.0);
    for (label, webview) in app.webviews() {
        if label.starts_with("tab-") && webview.is_visible().unwrap_or(false) {
            let _ = webview.set_bounds(Rect {
                position: Position::Logical(LogicalPosition::new(0.0, TOP_BAR_HEIGHT)),
                size: Size::Logical(LogicalSize::new(width, content_h)),
            });
        }
    }
    Ok(())
}

#[tauri::command]
fn set_tab_zoom(app: AppHandle, tab_id: String, factor: f64) -> Result<(), String> {
    let label = format!("tab-{}", tab_id);
    if let Some(webview) = app.get_webview(&label) {
        let _ = webview.set_zoom_factor(factor);
    }
    Ok(())
}

#[tauri::command]
fn set_tab_muted(app: AppHandle, tab_id: String, muted: bool) -> Result<(), String> {
    let label = format!("tab-{}", tab_id);
    if let Some(webview) = app.get_webview(&label) {
        let script = format!(
            "document.querySelectorAll('audio, video').forEach(el => el.muted = {});",
            muted
        );
        let _ = webview.eval(&script);
    }
    Ok(())
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
            reset_window,
            create_tab_webview,
            switch_tab_webview,
            close_tab_webview,
            reload_tab_webview,
            load_url_tab_webview,
            eval_tab_webview,
            resize_tab_webviews,
            set_tab_zoom,
            set_tab_muted
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
