import autoAnchor from '../index';

describe('AutoAnchor Integration Tests', () => {
  // These tests perform actual automation and should be run carefully
  // They're designed to be non-destructive and safe for testing environments

  describe('Basic Automation Flow', () => {
    it('should perform a complete automation sequence', async () => {
      // Get initial state
      const initialPosition = await autoAnchor.getCursorPosition();
      const screenSize = await autoAnchor.getScreenSize();
      
      expect(initialPosition).toBeDefined();
      expect(screenSize).toBeDefined();

      // Move to a safe position (center of screen)
      const centerX = Math.floor(screenSize.x / 2);
      const centerY = Math.floor(screenSize.y / 2);
      
      await autoAnchor.moveCursor(centerX, centerY);
      
      // Perform a click
      await autoAnchor.leftClick();
      
      // Type some text
      await autoAnchor.typeText('AutoAnchor Test');
      
      // Select all text
      await autoAnchor.pressCtrlA();
      
      // Copy the text
      await autoAnchor.pressCtrlC();
      
      // Move to a different position
      const newX = Math.floor(screenSize.x * 0.1);
      const newY = Math.floor(screenSize.y * 0.1);
      await autoAnchor.moveCursor(newX, newY);
      
      // Paste the text
      await autoAnchor.pressCtrlV();
      
      // Clear selection
      await autoAnchor.pressEscape();
      
      // All operations completed without errors
      expect(true).toBe(true);
    }, 30000); // 30 second timeout for integration test
  });

  describe('Mouse Operations', () => {
    it('should perform various mouse operations', async () => {
      const screenSize = await autoAnchor.getScreenSize();
      
      // Test different click types at safe positions
      const positions = [
        { x: Math.floor(screenSize.x * 0.2), y: Math.floor(screenSize.y * 0.2) },
        { x: Math.floor(screenSize.x * 0.8), y: Math.floor(screenSize.y * 0.2) },
        { x: Math.floor(screenSize.x * 0.2), y: Math.floor(screenSize.y * 0.8) },
        { x: Math.floor(screenSize.x * 0.8), y: Math.floor(screenSize.y * 0.8) },
      ];

      for (const pos of positions) {
        await autoAnchor.moveCursor(pos.x, pos.y);
        await autoAnchor.leftClick();
        await autoAnchor.rightClick();
        await autoAnchor.middleClick();
      }
      
      expect(true).toBe(true);
    }, 20000);
  });

  describe('Keyboard Operations', () => {
    it('should perform various keyboard operations', async () => {
      // Test typing different types of content
      const testTexts = [
        'Hello, World!',
        '123456789',
        'Special chars: !@#$%^&*()',
        'Unicode: 你好世界',
        'Mixed: Hello123!@#',
      ];

      for (const text of testTexts) {
        await autoAnchor.typeText(text);
        await autoAnchor.pressCtrlA();
        await autoAnchor.pressCtrlC();
        await autoAnchor.pressCtrlV();
        await autoAnchor.pressEscape();
      }
      
      expect(true).toBe(true);
    }, 25000);
  });

  describe('Screen Information', () => {
    it('should provide accurate screen information', async () => {
      const screenSize = await autoAnchor.getScreenSize();
      const cursorPosition = await autoAnchor.getCursorPosition();
      
      // Verify screen size is reasonable
      expect(screenSize.x).toBeGreaterThan(800);
      expect(screenSize.y).toBeGreaterThan(600);
      
      // Verify cursor position is within screen bounds
      expect(cursorPosition.x).toBeGreaterThanOrEqual(0);
      expect(cursorPosition.x).toBeLessThanOrEqual(screenSize.x);
      expect(cursorPosition.y).toBeGreaterThanOrEqual(0);
      expect(cursorPosition.y).toBeLessThanOrEqual(screenSize.y);
    });
  });

  describe('Error Recovery', () => {
    it('should handle errors gracefully and continue working', async () => {
      // Test with invalid input
      try {
        await autoAnchor.moveCursor(-1, -1);
      } catch (error) {
        // Expected to fail
      }
      
      // Should still work after error
      const position = await autoAnchor.getCursorPosition();
      expect(position).toBeDefined();
      
      // Test with invalid key
      try {
        await autoAnchor.pressKey('invalidkey');
      } catch (error) {
        // Expected to fail
      }
      
      // Should still work after error
      await autoAnchor.pressEnter();
      expect(true).toBe(true);
    });
  });
});
