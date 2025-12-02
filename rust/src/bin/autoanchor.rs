use clap::{Parser, Subcommand};
use serde_json;
use autoanchor_core::{Point, AutomationResult, get_cursor_position, move_cursor, click, type_text, press_key, get_screen_size};

#[derive(Parser)]
#[command(name = "autoanchor")]
#[command(about = "Cross-platform automation tool")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Get current cursor position
    CursorPosition,
    /// Move cursor to specified coordinates
    MoveCursor {
        x: i32,
        y: i32,
    },
    /// Click at specified coordinates or current position
    Click {
        button: String,
        x: Option<i32>,
        y: Option<i32>,
    },
    /// Type text
    TypeText {
        text: String,
        /// Optional per-key delay in milliseconds (slower typing)
        delay_ms: Option<u64>,
    },
    /// Press a key with optional modifiers
    PressKey {
        key: String,
        modifiers: Option<Vec<String>>,
    },
    /// Get screen size
    ScreenSize,
    /// Take a screenshot and return it as base64-encoded PNG
    Screenshot {
        /// Capture only the active/foreground window
        #[arg(long)]
        active_window: bool,
    },
}

fn main() {
    let cli = Cli::parse();

    let result = match cli.command {
        Commands::CursorPosition => {
            match get_cursor_position() {
                Ok(pos) => AutomationResult {
                    success: true,
                    message: None,
                    data: Some(serde_json::to_value(pos).unwrap()),
                },
                Err(e) => AutomationResult {
                    success: false,
                    message: Some(e),
                    data: None,
                },
            }
        }
        Commands::MoveCursor { x, y } => {
            match move_cursor(x, y) {
                Ok(result) => result,
                Err(e) => AutomationResult {
                    success: false,
                    message: Some(e),
                    data: None,
                },
            }
        }
        Commands::Click { button, x, y } => {
            match click(&button, x, y) {
                Ok(result) => result,
                Err(e) => AutomationResult {
                    success: false,
                    message: Some(e),
                    data: None,
                },
            }
        }
        Commands::TypeText { text, delay_ms } => {
            match type_text(&text, delay_ms) {
                Ok(result) => result,
                Err(e) => AutomationResult {
                    success: false,
                    message: Some(e),
                    data: None,
                },
            }
        }
        Commands::PressKey { key, modifiers } => {
            match press_key(&key, modifiers) {
                Ok(result) => result,
                Err(e) => AutomationResult {
                    success: false,
                    message: Some(e),
                    data: None,
                },
            }
        }
        Commands::ScreenSize => {
            match get_screen_size() {
                Ok(size) => AutomationResult {
                    success: true,
                    message: None,
                    data: Some(serde_json::to_value(size).unwrap()),
                },
                Err(e) => AutomationResult {
                    success: false,
                    message: Some(e),
                    data: None,
                },
            }
        }
        Commands::Screenshot { active_window } => {
            match autoanchor_core::screen::windows::take_screenshot(active_window) {
                Ok(bytes) => {
                    // base64-encode the PNG bytes and return in JSON
                    use base64::{engine::general_purpose, Engine as _};
                    let b64 = general_purpose::STANDARD.encode(&bytes);
                    AutomationResult {
                        success: true,
                        message: None,
                        data: Some(serde_json::to_value(b64).unwrap()),
                    }
                }
                Err(e) => AutomationResult {
                    success: false,
                    message: Some(e),
                    data: None,
                },
            }
        }
    };

    // Output result as JSON
    let json_output = serde_json::to_string(&result).unwrap();
    println!("{}", json_output);
}
