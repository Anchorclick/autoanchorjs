const autoAnchor = require('autoanchorjs');

async function basicExample() {
  try {
    console.log('AutoAnchor Basic Usage Example');
    console.log('==============================');

    // Get current cursor position
    console.log('Getting current cursor position...');
    const position = await autoAnchor.getCursorPosition();
    console.log(`Current position: x=${position.x}, y=${position.y}`);

    // Get screen size
    console.log('Getting screen size...');
    const screenSize = await autoAnchor.getScreenSize();
    console.log(`Screen size: ${screenSize.x}x${screenSize.y}`);

    // Move cursor to center of screen
    const centerX = Math.floor(screenSize.x / 2);
    const centerY = Math.floor(screenSize.y / 2);
    console.log(`Moving cursor to center: (${centerX}, ${centerY})`);
    await autoAnchor.moveCursor(centerX, centerY);

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Click at current position
    console.log('Left clicking at current position...');
    await autoAnchor.leftClick();

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Type some text
    console.log('Typing "Hello, AutoAnchor!"...');
    await autoAnchor.typeText('Hello, AutoAnchor!');

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Press Enter
    console.log('Pressing Enter...');
    await autoAnchor.pressEnter();

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Press Ctrl+A to select all
    console.log('Pressing Ctrl+A...');
    await autoAnchor.pressCtrlA();

    console.log('Example completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

basicExample();
