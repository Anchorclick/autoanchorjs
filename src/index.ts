import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as os from 'os';

export interface Point {
  x: number;
  y: number;
}

export interface AutomationResult {
  success: boolean;
  message?: string;
  data?: any;
}

export interface MouseEvent {
  action: string;
  x?: number;
  y?: number;
  button?: string;
}

export interface KeyboardEvent {
  action: string;
  key: string;
  modifiers?: string[];
}

class AutoAnchor {
  private binaryPath: string;

  constructor() {
    this.binaryPath = this.getBinaryPath();
  }

  private getBinaryPath(): string {
    const platform = os.platform();
    const arch = os.arch();
    const binaryName = platform === 'win32' ? 'autoanchor.exe' : 'autoanchor';
    
    return path.join(__dirname, '..', 'binaries', platform, arch, binaryName);
  }

  private async executeCommand(args: string[]): Promise<AutomationResult> {
    return new Promise((resolve, reject) => {
      const child: ChildProcess = spawn(this.binaryPath, args, {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(stdout);
            resolve(result);
          } catch (error) {
            reject(new Error(`Failed to parse result: ${error}`));
          }
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to execute command: ${error.message}`));
      });
    });
  }

  /**
   * Get the current cursor position
   */
  async getCursorPosition(): Promise<Point> {
    const result = await this.executeCommand(['cursor-position']);
    if (result.success && result.data) {
      return result.data as Point;
    }
    throw new Error(result.message || 'Failed to get cursor position');
  }

  /**
   * Move the cursor to the specified coordinates
   */
  async moveCursor(x: number, y: number): Promise<void> {
    const result = await this.executeCommand(['move-cursor', x.toString(), y.toString()]);
    if (!result.success) {
      throw new Error(result.message || 'Failed to move cursor');
    }
  }

  /**
   * Click at the specified coordinates or current position
   */
  async click(button: 'left' | 'right' | 'middle' = 'left', x?: number, y?: number): Promise<void> {
    const args = ['click', button];
    if (x !== undefined && y !== undefined) {
      args.push(x.toString(), y.toString());
    }
    
    const result = await this.executeCommand(args);
    if (!result.success) {
      throw new Error(result.message || 'Failed to click');
    }
  }

  /**
   * Type text at the current cursor position
   */
  async typeText(text: string): Promise<void> {
    const result = await this.executeCommand(['type-text', text]);
    if (!result.success) {
      throw new Error(result.message || 'Failed to type text');
    }
  }

  /**
   * Press a key with optional modifiers
   */
  async pressKey(key: string, modifiers?: string[]): Promise<void> {
    const args = ['press-key', key];
    if (modifiers && modifiers.length > 0) {
      args.push(...modifiers);
    }
    
    const result = await this.executeCommand(args);
    if (!result.success) {
      throw new Error(result.message || 'Failed to press key');
    }
  }

  /**
   * Get the screen size
   */
  async getScreenSize(): Promise<Point> {
    const result = await this.executeCommand(['screen-size']);
    if (result.success && result.data) {
      return result.data as Point;
    }
    throw new Error(result.message || 'Failed to get screen size');
  }

  /**
   * Take a screenshot (PNG) and return as a Buffer
   */
  async takeScreenshot(): Promise<Buffer> {
    const result = await this.executeCommand(['screenshot']);
    if (result.success && result.data) {
      const b64 = result.data as string;
      return Buffer.from(b64, 'base64');
    }
    throw new Error(result.message || 'Failed to take screenshot');
  }

  /**
   * Convenience method for left click
   */
  async leftClick(x?: number, y?: number): Promise<void> {
    return this.click('left', x, y);
  }

  /**
   * Convenience method for right click
   */
  async rightClick(x?: number, y?: number): Promise<void> {
    return this.click('right', x, y);
  }

  /**
   * Convenience method for middle click
   */
  async middleClick(x?: number, y?: number): Promise<void> {
    return this.click('middle', x, y);
  }

  /**
   * Convenience method for pressing Enter
   */
  async pressEnter(): Promise<void> {
    return this.pressKey('enter');
  }

  /**
   * Convenience method for pressing Tab
   */
  async pressTab(): Promise<void> {
    return this.pressKey('tab');
  }

  /**
   * Convenience method for pressing Escape
   */
  async pressEscape(): Promise<void> {
    return this.pressKey('escape');
  }

  /**
   * Convenience method for pressing Ctrl+C
   */
  async pressCtrlC(): Promise<void> {
    return this.pressKey('c', ['ctrl']);
  }

  /**
   * Convenience method for pressing Ctrl+V
   */
  async pressCtrlV(): Promise<void> {
    return this.pressKey('v', ['ctrl']);
  }

  /**
   * Convenience method for pressing Ctrl+A
   */
  async pressCtrlA(): Promise<void> {
    return this.pressKey('a', ['ctrl']);
  }
}

// Create and export a default instance
const autoAnchor = new AutoAnchor();
export default autoAnchor;

// Export the class for custom instances
export { AutoAnchor };

// Export individual functions for convenience
export const getCursorPosition = () => autoAnchor.getCursorPosition();
export const moveCursor = (x: number, y: number) => autoAnchor.moveCursor(x, y);
export const click = (button?: 'left' | 'right' | 'middle', x?: number, y?: number) => autoAnchor.click(button, x, y);
export const leftClick = (x?: number, y?: number) => autoAnchor.leftClick(x, y);
export const rightClick = (x?: number, y?: number) => autoAnchor.rightClick(x, y);
export const middleClick = (x?: number, y?: number) => autoAnchor.middleClick(x, y);
export const typeText = (text: string) => autoAnchor.typeText(text);
export const pressKey = (key: string, modifiers?: string[]) => autoAnchor.pressKey(key, modifiers);
export const pressEnter = () => autoAnchor.pressEnter();
export const pressTab = () => autoAnchor.pressTab();
export const pressEscape = () => autoAnchor.pressEscape();
export const pressCtrlC = () => autoAnchor.pressCtrlC();
export const pressCtrlV = () => autoAnchor.pressCtrlV();
export const pressCtrlA = () => autoAnchor.pressCtrlA();
export const getScreenSize = () => autoAnchor.getScreenSize();
export const takeScreenshot = () => autoAnchor.takeScreenshot();