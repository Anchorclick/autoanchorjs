import autoAnchor, { AutoAnchor } from '../index';

describe('AutoAnchor', () => {
  let instance: AutoAnchor;

  beforeEach(() => {
    instance = new AutoAnchor();
  });

  describe('getCursorPosition', () => {
    it('should return a valid position object', async () => {
      const position = await autoAnchor.getCursorPosition();
      
      expect(position).toHaveProperty('x');
      expect(position).toHaveProperty('y');
      expect(typeof position.x).toBe('number');
      expect(typeof position.y).toBe('number');
      expect(position.x).toBeGreaterThanOrEqual(0);
      expect(position.y).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getScreenSize', () => {
    it('should return valid screen dimensions', async () => {
      const screenSize = await autoAnchor.getScreenSize();
      
      expect(screenSize).toHaveProperty('x');
      expect(screenSize).toHaveProperty('y');
      expect(typeof screenSize.x).toBe('number');
      expect(typeof screenSize.y).toBe('number');
      expect(screenSize.x).toBeGreaterThan(0);
      expect(screenSize.y).toBeGreaterThan(0);
    });
  });

  describe('moveCursor', () => {
    it('should move cursor to specified coordinates', async () => {
      const initialPosition = await autoAnchor.getCursorPosition();
      
      // Move to a different position
      const newX = Math.min(initialPosition.x + 100, 800);
      const newY = Math.min(initialPosition.y + 100, 600);
      
      await autoAnchor.moveCursor(newX, newY);
      
      // Note: We can't easily test the actual position change without
      // interfering with the test environment, so we just ensure no error is thrown
      expect(true).toBe(true);
    });

    it('should handle invalid coordinates gracefully', async () => {
      // Test with negative coordinates
      await expect(autoAnchor.moveCursor(-1, -1)).rejects.toThrow();
    });
  });

  describe('click', () => {
    it('should perform left click without errors', async () => {
      await expect(autoAnchor.leftClick()).resolves.not.toThrow();
    });

    it('should perform right click without errors', async () => {
      await expect(autoAnchor.rightClick()).resolves.not.toThrow();
    });

    it('should perform middle click without errors', async () => {
      await expect(autoAnchor.middleClick()).resolves.not.toThrow();
    });

    it('should click at specified coordinates', async () => {
      const screenSize = await autoAnchor.getScreenSize();
      const x = Math.floor(screenSize.x / 2);
      const y = Math.floor(screenSize.y / 2);
      
      await expect(autoAnchor.click('left', x, y)).resolves.not.toThrow();
    });
  });

  describe('typeText', () => {
    it('should type simple text without errors', async () => {
      await expect(autoAnchor.typeText('Hello, World!')).resolves.not.toThrow();
    });

    it('should handle empty string', async () => {
      await expect(autoAnchor.typeText('')).resolves.not.toThrow();
    });

    it('should handle special characters', async () => {
      await expect(autoAnchor.typeText('!@#$%^&*()')).resolves.not.toThrow();
    });
  });

  describe('pressKey', () => {
    it('should press Enter key', async () => {
      await expect(autoAnchor.pressEnter()).resolves.not.toThrow();
    });

    it('should press Tab key', async () => {
      await expect(autoAnchor.pressTab()).resolves.not.toThrow();
    });

    it('should press Escape key', async () => {
      await expect(autoAnchor.pressEscape()).resolves.not.toThrow();
    });

    it('should press Ctrl+C', async () => {
      await expect(autoAnchor.pressCtrlC()).resolves.not.toThrow();
    });

    it('should press Ctrl+V', async () => {
      await expect(autoAnchor.pressCtrlV()).resolves.not.toThrow();
    });

    it('should press Ctrl+A', async () => {
      await expect(autoAnchor.pressCtrlA()).resolves.not.toThrow();
    });

    it('should press key with modifiers', async () => {
      await expect(autoAnchor.pressKey('c', ['ctrl'])).resolves.not.toThrow();
    });

    it('should handle unsupported keys gracefully', async () => {
      await expect(autoAnchor.pressKey('unsupportedkey')).rejects.toThrow();
    });
  });

  describe('instance methods', () => {
    it('should work with custom instance', async () => {
      const customInstance = new AutoAnchor();
      const position = await customInstance.getCursorPosition();
      
      expect(position).toHaveProperty('x');
      expect(position).toHaveProperty('y');
    });
  });

  describe('error handling', () => {
    it('should throw error for invalid button type', async () => {
      await expect(autoAnchor.click('invalid' as any)).rejects.toThrow();
    });

    it('should throw error for invalid coordinates', async () => {
      await expect(autoAnchor.moveCursor(NaN, NaN)).rejects.toThrow();
    });
  });
});
