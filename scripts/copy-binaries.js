const fs = require('fs');
const path = require('path');
const os = require('os');

const platform = os.platform();
const arch = os.arch();

// Create binaries directory structure
const binariesDir = path.join(__dirname, '..', 'binaries');
const platformDir = path.join(binariesDir, platform);
const archDir = path.join(platformDir, arch);

// Ensure directories exist
if (!fs.existsSync(binariesDir)) {
  fs.mkdirSync(binariesDir, { recursive: true });
}
if (!fs.existsSync(platformDir)) {
  fs.mkdirSync(platformDir, { recursive: true });
}
if (!fs.existsSync(archDir)) {
  fs.mkdirSync(archDir, { recursive: true });
}

// Source and destination paths
const rustTargetDir = path.join(__dirname, '..', 'rust', 'target', 'release');
const binaryName = platform === 'win32' ? 'autoanchor.exe' : 'autoanchor';
const sourcePath = path.join(rustTargetDir, binaryName);
const destPath = path.join(archDir, binaryName);

// Copy binary if it exists
if (fs.existsSync(sourcePath)) {
  fs.copyFileSync(sourcePath, destPath);
  console.log(`Copied ${binaryName} to ${destPath}`);
} else {
  console.error(`Binary not found at ${sourcePath}`);
  console.error('Please run "npm run build:rust" first');
  process.exit(1);
}
