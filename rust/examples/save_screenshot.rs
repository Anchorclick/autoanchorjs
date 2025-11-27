fn main() {
    // Run the example as:
    // cargo run --example save_screenshot
    println!("Attempting to take a screenshot and write screenshot_example.png to disk...");

    match autoanchor_core::screen::windows::take_screenshot() {
        Ok(bytes) => {
            let filename = "screenshot_example.png";
            if let Err(e) = std::fs::write(filename, &bytes) {
                eprintln!("Failed to write {}: {}", filename, e);
                std::process::exit(1);
            }
            println!("Saved screenshot to {}", filename);
        }
        Err(e) => {
            eprintln!("Failed to take screenshot: {}", e);
            std::process::exit(1);
        }
    }
}
