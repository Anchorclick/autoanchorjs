const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Target platforms and architectures
const targets = [
  { platform: 'win32', arch: 'x64', rustTarget: 'x86_64-pc-windows-msvc' },
  { platform: 'win32', arch: 'arm64', rustTarget: 'aarch64-pc-windows-msvc' },
  { platform: 'darwin', arch: 'x64', rustTarget: 'x86_64-apple-darwin' },
  { platform: 'darwin', arch: 'arm64', rustTarget: 'aarch64-apple-darwin' },
  { platform: 'linux', arch: 'x64', rustTarget: 'x86_64-unknown-linux-gnu' },
  { platform: 'linux', arch: 'arm64', rustTarget: 'aarch64-unknown-linux-gnu' },
];

async function buildForTarget(target) {
  return new Promise((resolve, reject) => {
    console.log(`Building for ${target.platform}-${target.arch} (${target.rustTarget})...`);
    
    const build = spawn('cargo', ['build', '--release', '--target', target.rustTarget], {
      cwd: path.join(__dirname, '..', 'rust'),
      stdio: 'inherit'
    });
    
    build.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Build failed for ${target.platform}-${target.arch}`));
        return;
      }
      
      // Copy binary to the correct location
      const binaryName = target.platform === 'win32' ? 'autoanchor.exe' : 'autoanchor';
      const sourcePath = path.join(__dirname, '..', 'rust', 'target', target.rustTarget, 'release', binaryName);
      const destDir = path.join(__dirname, '..', 'binaries', target.platform, target.arch);
      const destPath = path.join(destDir, binaryName);
      
      // Ensure destination directory exists
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      // Copy binary
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✓ Built and copied ${binaryName} for ${target.platform}-${target.arch}`);
        resolve();
      } else {
        reject(new Error(`Binary not found at ${sourcePath}`));
      }
    });
    
    build.on('error', (error) => {
      reject(error);
    });
  });
}

async function buildAll() {
  console.log('Building cross-platform binaries...');
  
  try {
    // Build TypeScript first
    console.log('Building TypeScript...');
    const tsBuild = spawn('npx', ['tsc'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    await new Promise((resolve, reject) => {
      tsBuild.on('close', (code) => {
        if (code !== 0) {
          reject(new Error('TypeScript build failed'));
        } else {
          resolve();
        }
      });
    });
    
    // Build Rust for each target
    for (const target of targets) {
      try {
        await buildForTarget(target);
      } catch (error) {
        console.warn(`Warning: Failed to build for ${target.platform}-${target.arch}: ${error.message}`);
        // Continue with other targets
      }
    }
    
    console.log('Cross-platform build completed!');
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

buildAll();
