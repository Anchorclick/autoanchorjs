use super::super::Point;
use winapi::um::winuser::*;
use screenshots::{Screen, Compression};

pub fn get_screen_size() -> Result<Point, String> {
    unsafe {
        let width = GetSystemMetrics(SM_CXSCREEN);
        let height = GetSystemMetrics(SM_CYSCREEN);
        
        Ok(Point {
            x: width,
            y: height,
        })
    }
}

pub fn take_screenshot(active_window: bool) -> Result<Vec<u8>, String> {
    // If active_window is true, use the Windows API to get the foreground window rectangle
    // and capture that area. Otherwise capture the primary screen.
    let image = if active_window {
        unsafe {
            use winapi::um::winuser::{GetForegroundWindow, GetWindowRect};
            use winapi::shared::windef::RECT;

            let hwnd = GetForegroundWindow();
            if hwnd.is_null() {
                return Err("No foreground window found".to_string());
            }

            let mut rect: RECT = std::mem::zeroed();
            if GetWindowRect(hwnd, &mut rect) == 0 {
                return Err("Failed to get foreground window rect".to_string());
            }

            let left = rect.left;
            let top = rect.top;
            let width = (rect.right - rect.left) as u32;
            let height = (rect.bottom - rect.top) as u32;

            // Find the display that contains the top-left corner of the window
            let screen = Screen::from_point(left, top).map_err(|e| e.to_string())?;
            // DisplayInfo::from_point returns display origin; capture_area expects coords relative to display
            let display_x = screen.display_info.x;
            let display_y = screen.display_info.y;
            let rel_x = left - display_x;
            let rel_y = top - display_y;

            screen
                .capture_area(rel_x, rel_y, width, height)
                .map_err(|e| e.to_string())?
        }
    } else {
        // Map any screenshots errors into Strings and return the raw byte buffer
        let screen = Screen::from_point(0, 0).map_err(|e| e.to_string())?;
        screen.capture().map_err(|e| e.to_string())?
    };
    // The `Image` type exposes `From<Image> for Vec<u8>` which gives the RGBA buffer.
    // Encode to PNG bytes so consumers receive a PNG file buffer
    let png = image
        .to_png(Some(Compression::Default))
        .map_err(|e| e.to_string())?;

    Ok(png)
}

// Unit tests moved to an integration test file (`tests/take_screenshot_integration.rs`)
// so they can write an example PNG to disk for easy inspection.