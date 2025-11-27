# AutoAnchorJS

A cross-platform automation library that uses Rust binaries for high-performance cursor, mouse, and keyboard control. Similar to nutjs or robotjs, but with the reliability and performance of Rust.

## Overview

AutoAnchorJS was built not only to provide robust automation capabilities but also to address the shortcomings of existing libraries. By leveraging Rust for the backend, AutoAnchorJS ensures high performance and stability across all major operating systems. The Node.js frontend offers a simple and intuitive API, making it easy for developers to integrate automation features into their applications.

AutoAnchorJS is used internally at Anchorclick to power our new RPA (Robotic Process Automation) Desktop agent (wip), enabling us to automate desktop tasks efficiently and reliably with AI-powered workflows.

## Features

- 🖱️ **Mouse Control**: Move cursor, click (left/right/middle), get position
- ⌨️ **Keyboard Input**: Type text, press keys, keyboard shortcuts
- 📺 **Screen Info**: Get screen dimensions
- 🚀 **High Performance**: Rust backend for maximum speed and reliability
- 🌍 **Cross-Platform**: Windows, macOS, and Linux support
- 📦 **Easy to Use**: Simple JavaScript/TypeScript API
- 🔧 **TypeScript Support**: Full type definitions included

## Installation

```bash
npm install autoanchorjs
```

## Quick Start

```javascript
const autoAnchor = require('autoanchorjs');

async function example() {
  // Get current cursor position
  const position = await autoAnchor.getCursorPosition();
  console.log(`Cursor at: ${position.x}, ${position.y}`);

  // Move cursor to center of screen
  const screenSize = await autoAnchor.getScreenSize();
  await autoAnchor.moveCursor(screenSize.x / 2, screenSize.y / 2);

  // Click at current position
  await autoAnchor.leftClick();

  // Type some text
  await autoAnchor.typeText('Hello, AutoAnchor!');

  // Press Enter
  await autoAnchor.pressEnter();
}
```

## API Reference

### Mouse Functions

#### `getCursorPosition(): Promise<Point>`
Get the current cursor position.

```javascript
const position = await autoAnchor.getCursorPosition();
console.log(`x: ${position.x}, y: ${position.y}`);
```

#### `moveCursor(x: number, y: number): Promise<void>`
Move the cursor to the specified coordinates.

```javascript
await autoAnchor.moveCursor(100, 200);
```

#### `click(button?: 'left' | 'right' | 'middle', x?: number, y?: number): Promise<void>`
Click at the specified coordinates or current position.

```javascript
// Click at current position
await autoAnchor.click();

// Click at specific coordinates
await autoAnchor.click('left', 100, 200);

// Right click at current position
await autoAnchor.click('right');
```

#### `leftClick(x?: number, y?: number): Promise<void>`
Convenience method for left clicking.

```javascript
await autoAnchor.leftClick(100, 200);
```

#### `rightClick(x?: number, y?: number): Promise<void>`
Convenience method for right clicking.

```javascript
await autoAnchor.rightClick();
```

#### `middleClick(x?: number, y?: number): Promise<void>`
Convenience method for middle clicking.

```javascript
await autoAnchor.middleClick();
```

### Keyboard Functions

#### `typeText(text: string): Promise<void>`
Type text at the current cursor position.

```javascript
await autoAnchor.typeText('Hello, World!');
```

#### `pressKey(key: string, modifiers?: string[]): Promise<void>`
Press a key with optional modifiers.

```javascript
// Press a single key
await autoAnchor.pressKey('enter');

// Press key with modifiers
await autoAnchor.pressKey('c', ['ctrl']); // Ctrl+C
await autoAnchor.pressKey('v', ['ctrl', 'shift']); // Ctrl+Shift+V
```

### Screen Functions

#### `getScreenSize(): Promise<Point>`
Get the screen dimensions.

```javascript
const screenSize = await autoAnchor.getScreenSize();
console.log(`Screen: ${screenSize.x}x${screenSize.y}`);
```

#### `takeScreenshot(x?: number, y?: number, width?: number, height?: number): Promise<Buffer>`
Take a screenshot of the specified area or the entire screen.

```javascript
const screenshot = await autoAnchor.takeScreenshot();
require('fs').writeFileSync('screenshot.png', screenshot);
```

#### Convenience Methods

```javascript
await autoAnchor.pressEnter();    // Press Enter
await autoAnchor.pressTab();      // Press Tab
await autoAnchor.pressEscape();   // Press Escape
await autoAnchor.pressCtrlC();    // Press Ctrl+C
await autoAnchor.pressCtrlV();    // Press Ctrl+V
await autoAnchor.pressCtrlA();    // Press Ctrl+A
```

### Screen Functions

#### `getScreenSize(): Promise<Point>`
Get the screen dimensions.

```javascript
const screenSize = await autoAnchor.getScreenSize();
console.log(`Screen: ${screenSize.x}x${screenSize.y}`);
```

## Supported Keys

### Special Keys
- `enter`, `return`
- `space`
- `tab`
- `escape`, `esc`
- `backspace`
- `delete`

### Modifier Keys
- `ctrl`, `control`
- `alt`, `option` (macOS)
- `shift`
- `cmd`, `command` (macOS)
- `win`, `windows` (Windows)
- `super` (Linux)

### Arrow Keys
- `up`
- `down`
- `left`
- `right`

### Function Keys
- `f1` through `f12`

### Letters and Numbers
- `a` through `z`
- `0` through `9`

## Platform Support

| Platform | Architecture | Status |
|----------|-------------|---------|
| Windows  | x64         | ✅      |
| Windows  | ARM64       | ✅      |
| macOS    | x64         | ✅      |
| macOS    | ARM64       | ✅      |
| Linux    | x64         | ✅      |
| Linux    | ARM64       | ✅      |

## Development

### Prerequisites

- Node.js 14+
- Rust 1.70+
- Platform-specific dependencies:
  - **Windows**: Visual Studio Build Tools
  - **macOS**: Xcode Command Line Tools
  - **Linux**: `libx11-dev`, `libxtst-dev`

### Building

```bash
# Install dependencies
npm install

# Build for current platform
npm run build

# Build for all platforms (requires cross-compilation setup)
npm run build:cross-platform

# Build only Rust
npm run build:rust

# Build only TypeScript
npm run build:js
```

### Testing

```bash
npm test
```

### Examples

Run the examples to see AutoAnchor in action:

```bash
# Basic usage example
node examples/basic-usage.js

# Advanced usage example
node examples/advanced-usage.js
```

## How It Works

AutoAnchor uses a hybrid architecture:

1. **Rust Backend**: High-performance, cross-platform automation logic
2. **Node.js Frontend**: JavaScript/TypeScript API that spawns Rust processes
3. **Binary Distribution**: Pre-compiled Rust binaries for each platform

The Rust binary handles all the low-level system calls for mouse and keyboard control, while the Node.js layer provides a clean, promise-based API.

## Comparison with Other Libraries

| Feature | AutoAnchorJS | nut.js | RobotJS |
|---------|------------|-------|---------|
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Cross-Platform | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| TypeScript | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Maintenance | ⭐⭐⭐⭐ | ⭐ | ⭐ |
| Bundle Size | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Troubleshooting

### Common Issues

**Binary not found error**
- Make sure you've run `npm run build` after installation
- Check that the binary exists in `binaries/[platform]/[arch]/`

**Permission denied (Linux/macOS)**
- You may need to grant accessibility permissions
- On macOS: System Preferences → Security & Privacy → Accessibility
- On Linux: Ensure your user is in the appropriate groups

**Build failures**
- Ensure you have the required build tools installed
- Check that Rust is properly installed: `rustc --version`
- Verify platform-specific dependencies are installed

### Getting Help

- Check the [Issues](https://github.com/sewellstephens/autoanchorjs/issues) page
- Create a new issue with detailed information about your problem
- Include your platform, Node.js version, and error messages
