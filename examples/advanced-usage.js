const autoAnchor = require('autoanchorjs');

async function advancedExample() {
  try {
    console.log('AutoAnchor Advanced Usage Example');
    console.log('=================================');

    // Get screen dimensions
    const screenSize = await autoAnchor.getScreenSize();
    console.log(`Screen size: ${screenSize.x}x${screenSize.y}`);

    // Create a simple drawing pattern
    console.log('Creating a simple drawing pattern...');
    
    const startX = Math.floor(screenSize.x * 0.2);
    const startY = Math.floor(screenSize.y * 0.2);
    const endX = Math.floor(screenSize.x * 0.8);
    const endY = Math.floor(screenSize.y * 0.8);

    // Draw a rectangle by clicking at corners
    const corners = [
      { x: startX, y: startY },
      { x: endX, y: startY },
      { x: endX, y: endY },
      { x: startX, y: endY },
      { x: startX, y: startY } // Close the rectangle
    ];

    for (let i = 0; i < corners.length; i++) {
      const corner = corners[i];
      console.log(`Moving to corner ${i + 1}: (${corner.x}, ${corner.y})`);
      await autoAnchor.moveCursor(corner.x, corner.y);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (i === 0) {
        // Start drawing (left click and hold)
        await autoAnchor.leftClick();
      }
    }

    // Move to center and type
    const centerX = Math.floor((startX + endX) / 2);
    const centerY = Math.floor((startY + endY) / 2);
    console.log(`Moving to center: (${centerX}, ${centerY})`);
    await autoAnchor.moveCursor(centerX, centerY);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Type some text
    console.log('Typing in the center...');
    await autoAnchor.typeText('AutoAnchor Demo');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Select all text
    await autoAnchor.pressCtrlA();
    await new Promise(resolve => setTimeout(resolve, 500));

    // Copy the text
    await autoAnchor.pressCtrlC();
    await new Promise(resolve => setTimeout(resolve, 500));

    // Move to a new position
    const newX = Math.floor(screenSize.x * 0.1);
    const newY = Math.floor(screenSize.y * 0.9);
    console.log(`Moving to new position: (${newX}, ${newY})`);
    await autoAnchor.moveCursor(newX, newY);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Paste the text
    console.log('Pasting text...');
    await autoAnchor.pressCtrlV();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demonstrate different click types
    console.log('Demonstrating different click types...');
    
    // Right click
    await autoAnchor.rightClick();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Middle click
    await autoAnchor.middleClick();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demonstrate keyboard shortcuts
    console.log('Demonstrating keyboard shortcuts...');
    
    // Press Escape to cancel any context menus
    await autoAnchor.pressEscape();
    await new Promise(resolve => setTimeout(resolve, 500));

    // Press Tab
    await autoAnchor.pressTab();
    await new Promise(resolve => setTimeout(resolve, 500));

    // Press Enter
    await autoAnchor.pressEnter();
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Advanced example completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

advancedExample();
