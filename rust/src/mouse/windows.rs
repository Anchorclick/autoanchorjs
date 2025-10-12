use super::super::{AutomationResult, Point};
use winapi::um::winuser::*;
use winapi::um::errhandlingapi::GetLastError;

pub fn get_cursor_position() -> Result<Point, String> {
    unsafe {
        let mut point = winapi::shared::windef::POINT { x: 0, y: 0 };
        if GetCursorPos(&mut point) != 0 {
            Ok(Point {
                x: point.x,
                y: point.y,
            })
        } else {
            Err(format!("Failed to get cursor position: {}", GetLastError()))
        }
    }
}

pub fn move_cursor(x: i32, y: i32) -> Result<AutomationResult, String> {
    unsafe {
        if SetCursorPos(x, y) != 0 {
            Ok(AutomationResult {
                success: true,
                message: Some(format!("Cursor moved to ({}, {})", x, y)),
                data: None,
            })
        } else {
            Err(format!("Failed to move cursor: {}", GetLastError()))
        }
    }
}

pub fn click(button: &str, x: Option<i32>, y: Option<i32>) -> Result<AutomationResult, String> {
    unsafe {
        // Move cursor to position if specified
        if let (Some(x), Some(y)) = (x, y) {
            if SetCursorPos(x, y) == 0 {
                return Err(format!("Failed to move cursor: {}", GetLastError()));
            }
        }

        let (down_msg, up_msg) = match button.to_lowercase().as_str() {
            "left" => (WM_LBUTTONDOWN, WM_LBUTTONUP),
            "right" => (WM_RBUTTONDOWN, WM_RBUTTONUP),
            "middle" => (WM_MBUTTONDOWN, WM_MBUTTONUP),
            _ => return Err(format!("Unsupported button: {}", button)),
        };

        // Get current cursor position for the click
        let mut point = winapi::shared::windef::POINT { x: 0, y: 0 };
        if GetCursorPos(&mut point) == 0 {
            return Err(format!("Failed to get cursor position: {}", GetLastError()));
        }

        let lparam = (point.y as u32) << 16 | (point.x as u32 & 0xFFFF);

        // Send mouse down
        let mut input = INPUT {
            type_: INPUT_MOUSE,
            u: unsafe { std::mem::zeroed() },
        };
        unsafe {
            *input.u.mi_mut() = MOUSEINPUT {
                dx: 0,
                dy: 0,
                mouseData: 0,
                dwFlags: match button.to_lowercase().as_str() {
                    "left" => MOUSEEVENTF_LEFTDOWN,
                    "right" => MOUSEEVENTF_RIGHTDOWN,
                    "middle" => MOUSEEVENTF_MIDDLEDOWN,
                    _ => return Err(format!("Unsupported button: {}", button)),
                },
                time: 0,
                dwExtraInfo: 0,
            };
        }
        
        if SendInput(1, &mut input, std::mem::size_of::<INPUT>() as i32) == 0 {
            return Err(format!("Failed to send mouse down: {}", GetLastError()));
        }

        // Small delay
        std::thread::sleep(std::time::Duration::from_millis(10));

        // Send mouse up
        let mut input_up = INPUT {
            type_: INPUT_MOUSE,
            u: unsafe { std::mem::zeroed() },
        };
        unsafe {
            *input_up.u.mi_mut() = MOUSEINPUT {
                dx: 0,
                dy: 0,
                mouseData: 0,
                dwFlags: match button.to_lowercase().as_str() {
                    "left" => MOUSEEVENTF_LEFTUP,
                    "right" => MOUSEEVENTF_RIGHTUP,
                    "middle" => MOUSEEVENTF_MIDDLEUP,
                    _ => return Err(format!("Unsupported button: {}", button)),
                },
                time: 0,
                dwExtraInfo: 0,
            };
        }
        
        if SendInput(1, &mut input_up, std::mem::size_of::<INPUT>() as i32) == 0 {
            return Err(format!("Failed to send mouse up: {}", GetLastError()));
        }

        Ok(AutomationResult {
            success: true,
            message: Some(format!("Clicked {} button at ({}, {})", button, point.x, point.y)),
            data: None,
        })
    }
}
