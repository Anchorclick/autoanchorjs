fn main() {
    // Run the example as:
    // cargo run --example save_screenshot
    println!("Attempting to take a screenshot and write screenshot_example.png to disk...");

    let args: Vec<String> = std::env::args().collect();
    let active_flag = args.iter().any(|a| a == "--active-window" || a == "active");

    match autoanchor_core::screen::windows::take_screenshot(active_flag) {
        Ok(bytes) => {
            let filename = if active_flag { "screenshot_example_active.png" } else { "screenshot_example.png" };
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
