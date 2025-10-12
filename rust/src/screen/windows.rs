use super::super::Point;
use winapi::um::winuser::*;

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
