use super::super::AutomationResult;
use winapi::um::winuser::*;
use winapi::um::errhandlingapi::GetLastError;

pub fn type_text(text: &str) -> Result<AutomationResult, String> {
    unsafe {
        for ch in text.chars() {
            let vk_code = char_to_vk_code(ch);
            if vk_code == 0 {
                continue; // Skip unsupported characters
            }

            // Key down
            let mut input = INPUT {
                type_: INPUT_KEYBOARD,
                u: unsafe { std::mem::zeroed() },
            };
            unsafe {
                *input.u.ki_mut() = KEYBDINPUT {
                    wVk: vk_code,
                    wScan: 0,
                    dwFlags: 0,
                    time: 0,
                    dwExtraInfo: 0,
                };
            }
            
            if SendInput(1, &mut input, std::mem::size_of::<INPUT>() as i32) == 0 {
                return Err(format!("Failed to send key down: {}", GetLastError()));
            }

            // Small delay
            std::thread::sleep(std::time::Duration::from_millis(10));

            // Key up
            let mut input_up = INPUT {
                type_: INPUT_KEYBOARD,
                u: unsafe { std::mem::zeroed() },
            };
            unsafe {
                *input_up.u.ki_mut() = KEYBDINPUT {
                    wVk: vk_code,
                    wScan: 0,
                    dwFlags: KEYEVENTF_KEYUP,
                    time: 0,
                    dwExtraInfo: 0,
                };
            }
            
            if SendInput(1, &mut input_up, std::mem::size_of::<INPUT>() as i32) == 0 {
                return Err(format!("Failed to send key up: {}", GetLastError()));
            }

            std::thread::sleep(std::time::Duration::from_millis(10));
        }

        Ok(AutomationResult {
            success: true,
            message: Some(format!("Typed text: {}", text)),
            data: None,
        })
    }
}

pub fn press_key(key: &str, modifiers: Option<Vec<String>>) -> Result<AutomationResult, String> {
    unsafe {
        let vk_code = key_to_vk_code(key);
        if vk_code == 0 {
            return Err(format!("Unsupported key: {}", key));
        }

        // Press modifiers first
        if let Some(ref mods) = modifiers {
            for modifier in mods {
                let mod_vk = key_to_vk_code(&modifier);
                if mod_vk != 0 {
                    let mut input = INPUT {
                        type_: INPUT_KEYBOARD,
                        u: unsafe { std::mem::zeroed() },
                    };
                    unsafe {
                        *input.u.ki_mut() = KEYBDINPUT {
                            wVk: mod_vk,
                            wScan: 0,
                            dwFlags: 0,
                            time: 0,
                            dwExtraInfo: 0,
                        };
                    }
                    SendInput(1, &mut input, std::mem::size_of::<INPUT>() as i32);
                }
            }
        }

        // Press main key
        let mut input = INPUT {
            type_: INPUT_KEYBOARD,
            u: unsafe { std::mem::zeroed() },
        };
        unsafe {
            *input.u.ki_mut() = KEYBDINPUT {
                wVk: vk_code,
                wScan: 0,
                dwFlags: 0,
                time: 0,
                dwExtraInfo: 0,
            };
        }
        
        if SendInput(1, &mut input, std::mem::size_of::<INPUT>() as i32) == 0 {
            return Err(format!("Failed to send key down: {}", GetLastError()));
        }

        std::thread::sleep(std::time::Duration::from_millis(10));

        // Release main key
        let mut input_up = INPUT {
            type_: INPUT_KEYBOARD,
            u: unsafe { std::mem::zeroed() },
        };
        unsafe {
            *input_up.u.ki_mut() = KEYBDINPUT {
                wVk: vk_code,
                wScan: 0,
                dwFlags: KEYEVENTF_KEYUP,
                time: 0,
                dwExtraInfo: 0,
            };
        }
        
        if SendInput(1, &mut input_up, std::mem::size_of::<INPUT>() as i32) == 0 {
            return Err(format!("Failed to send key up: {}", GetLastError()));
        }

        // Release modifiers
        if let Some(ref mods) = modifiers {
            for modifier in mods {
                let mod_vk = key_to_vk_code(&modifier);
                if mod_vk != 0 {
                    let mut input = INPUT {
                        type_: INPUT_KEYBOARD,
                        u: unsafe { std::mem::zeroed() },
                    };
                    unsafe {
                        *input.u.ki_mut() = KEYBDINPUT {
                            wVk: mod_vk,
                            wScan: 0,
                            dwFlags: KEYEVENTF_KEYUP,
                            time: 0,
                            dwExtraInfo: 0,
                        };
                    }
                    SendInput(1, &mut input, std::mem::size_of::<INPUT>() as i32);
                }
            }
        }

        Ok(AutomationResult {
            success: true,
            message: Some(format!("Pressed key: {}", key)),
            data: None,
        })
    }
}

fn char_to_vk_code(ch: char) -> u16 {
    match ch {
        'a'..='z' => (ch as u16 - 'a' as u16) + 0x41, // VK_A
        'A'..='Z' => (ch as u16 - 'A' as u16) + 0x41, // VK_A
        '0'..='9' => (ch as u16 - '0' as u16) + 0x30, // VK_0
        ' ' => 0x20, // VK_SPACE
        '\n' => 0x0D, // VK_RETURN
        '\t' => 0x09, // VK_TAB
        _ => 0, // Unsupported character
    }
}

fn key_to_vk_code(key: &str) -> u16 {
    let key_lower = key.to_lowercase();
    
    // Handle single letter keys
    if key_lower.len() == 1 {
        let ch = key_lower.chars().next().unwrap();
        if ch >= 'a' && ch <= 'z' {
            return (ch as u16 - 'a' as u16) + 0x41; // VK_A to VK_Z
        }
        if ch >= '0' && ch <= '9' {
            return (ch as u16 - '0' as u16) + 0x30; // VK_0 to VK_9
        }
    }
    
    match key_lower.as_str() {
        "enter" | "return" => 0x0D, // VK_RETURN
        "space" => 0x20, // VK_SPACE
        "tab" => 0x09, // VK_TAB
        "escape" | "esc" => 0x1B, // VK_ESCAPE
        "backspace" => 0x08, // VK_BACK
        "delete" => 0x2E, // VK_DELETE
        "ctrl" | "control" => 0x11, // VK_CONTROL
        "alt" => 0x12, // VK_MENU
        "shift" => 0x10, // VK_SHIFT
        "win" | "windows" => 0x5B, // VK_LWIN
        "up" => 0x26, // VK_UP
        "down" => 0x28, // VK_DOWN
        "left" => 0x25, // VK_LEFT
        "right" => 0x27, // VK_RIGHT
        "f1" => 0x70, // VK_F1
        "f2" => 0x71, // VK_F2
        "f3" => 0x72, // VK_F3
        "f4" => 0x73, // VK_F4
        "f5" => 0x74, // VK_F5
        "f6" => 0x75, // VK_F6
        "f7" => 0x76, // VK_F7
        "f8" => 0x77, // VK_F8
        "f9" => 0x78, // VK_F9
        "f10" => 0x79, // VK_F10
        "f11" => 0x7A, // VK_F11
        "f12" => 0x7B, // VK_F12
        _ => 0, // Unsupported key
    }
}
