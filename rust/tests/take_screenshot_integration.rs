// Integration test which writes a PNG file to disk so you can open it and visually
// verify the screenshot. This only runs on Windows.

#[cfg(target_os = "windows")]
#[test]
fn take_screenshot_writes_png_to_disk() {
    // Use the library's public modules - integration tests are a separate crate
    use autoanchor_core::screen::windows::take_screenshot;
    use std::fs;

    // First write a full-screen screenshot
    match take_screenshot(false) {
        Ok(bytes) => {
            assert!(bytes.len() > 8, "PNG bytes should be non-empty");
            assert!(bytes.starts_with(&[0x89, b'P', b'N', b'G', 0x0D, 0x0A, 0x1A, 0x0A]));

            // Write to a file in the crate directory so it's easy to find
            let target = "screenshot_integration.png";
            fs::write(target, &bytes).expect("failed to write screenshot to disk");
            println!("Wrote screenshot to {}", target);
        }

    // Also test active-window capture if available
    match take_screenshot(true) {
        Ok(bytes) => {
            assert!(bytes.len() > 8, "PNG bytes should be non-empty");
            assert!(bytes.starts_with(&[0x89, b'P', b'N', b'G', 0x0D, 0x0A, 0x1A, 0x0A]));

            let target = "screenshot_integration_active.png";
            fs::write(target, &bytes).expect("failed to write screenshot to disk");
            println!("Wrote screenshot to {}", target);
        }
        Err(e) => println!("Active-window screenshot unavailable: {}", e),
    }
        Err(e) => panic!("take_screenshot failed: {}", e),
    }
}
