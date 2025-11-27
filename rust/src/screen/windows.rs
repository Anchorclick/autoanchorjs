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

pub fn take_screenshot() -> Result<Vec<u8>, String> {
    // Map any screenshots errors into Strings and return the raw byte buffer
    let screen = Screen::from_point(0, 0).map_err(|e| e.to_string())?;
    let image = screen.capture().map_err(|e| e.to_string())?;
    // The `Image` type exposes `From<Image> for Vec<u8>` which gives the RGBA buffer.
    // Encode to PNG bytes so consumers receive a PNG file buffer
    let png = image
        .to_png(Some(Compression::Default))
        .map_err(|e| e.to_string())?;

    Ok(png)
}

// Unit tests moved to an integration test file (`tests/take_screenshot_integration.rs`)
// so they can write an example PNG to disk for easy inspection.