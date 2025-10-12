use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Point {
    pub x: i32,
    pub y: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MouseEvent {
    pub action: String,
    pub x: Option<i32>,
    pub y: Option<i32>,
    pub button: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct KeyboardEvent {
    pub action: String,
    pub key: String,
    pub modifiers: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AutomationResult {
    pub success: bool,
    pub message: Option<String>,
    pub data: Option<serde_json::Value>,
}

#[cfg(target_os = "windows")]
pub mod mouse;
#[cfg(target_os = "windows")]
pub mod keyboard;
#[cfg(target_os = "windows")]
pub mod screen;

pub fn get_cursor_position() -> Result<Point, String> {
    #[cfg(target_os = "windows")]
    {
        mouse::windows::get_cursor_position()
    }
    #[cfg(not(target_os = "windows"))]
    {
        Err("Unsupported platform - Windows only for now".to_string())
    }
}

pub fn move_cursor(x: i32, y: i32) -> Result<AutomationResult, String> {
    #[cfg(target_os = "windows")]
    {
        mouse::windows::move_cursor(x, y)
    }
    #[cfg(not(target_os = "windows"))]
    {
        Err("Unsupported platform - Windows only for now".to_string())
    }
}

pub fn click(button: &str, x: Option<i32>, y: Option<i32>) -> Result<AutomationResult, String> {
    #[cfg(target_os = "windows")]
    {
        mouse::windows::click(button, x, y)
    }
    #[cfg(not(target_os = "windows"))]
    {
        Err("Unsupported platform - Windows only for now".to_string())
    }
}

pub fn type_text(text: &str) -> Result<AutomationResult, String> {
    #[cfg(target_os = "windows")]
    {
        keyboard::windows::type_text(text)
    }
    #[cfg(not(target_os = "windows"))]
    {
        Err("Unsupported platform - Windows only for now".to_string())
    }
}

pub fn press_key(key: &str, modifiers: Option<Vec<String>>) -> Result<AutomationResult, String> {
    #[cfg(target_os = "windows")]
    {
        keyboard::windows::press_key(key, modifiers)
    }
    #[cfg(not(target_os = "windows"))]
    {
        Err("Unsupported platform - Windows only for now".to_string())
    }
}

pub fn get_screen_size() -> Result<Point, String> {
    #[cfg(target_os = "windows")]
    {
        screen::windows::get_screen_size()
    }
    #[cfg(not(target_os = "windows"))]
    {
        Err("Unsupported platform - Windows only for now".to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_cursor_position() {
        let result = get_cursor_position();
        match result {
            Ok(pos) => {
                println!("Cursor position: x={}, y={}", pos.x, pos.y);
                assert!(pos.x >= 0);
                assert!(pos.y >= 0);
            }
            Err(e) => {
                println!("Error getting cursor position: {}", e);
                // This is expected on non-Windows platforms
            }
        }
    }

    #[test]
    fn test_get_screen_size() {
        let result = get_screen_size();
        match result {
            Ok(size) => {
                println!("Screen size: x={}, y={}", size.x, size.y);
                assert!(size.x > 0);
                assert!(size.y > 0);
            }
            Err(e) => {
                println!("Error getting screen size: {}", e);
                // This is expected on non-Windows platforms
            }
        }
    }
}