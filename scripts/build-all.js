const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

const platform = os.platform();
const arch = os.arch();

console.log(`Building for ${platform}-${arch}...`);

// Build Rust
console.log('Building Rust binary...');
const rustBuild = spawn('cargo', ['build', '--release'], {
  cwd: path.join(__dirname, '..', 'rust'),
  stdio: 'inherit'
});

rustBuild.on('close', (code) => {
  if (code !== 0) {
    console.error('Rust build failed');
    process.exit(1);
  }
  
  console.log('Rust build completed');
  
  // Build TypeScript
  console.log('Building TypeScript...');
  const tsBuild = spawn('npx', ['tsc'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });
  
  tsBuild.on('close', (tsCode) => {
    if (tsCode !== 0) {
      console.error('TypeScript build failed');
      process.exit(1);
    }
    
    console.log('TypeScript build completed');
    
    // Copy binaries
    console.log('Copying binaries...');
    const copyBinaries = spawn('node', ['scripts/copy-binaries.js'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    copyBinaries.on('close', (copyCode) => {
      if (copyCode !== 0) {
        console.error('Binary copy failed');
        process.exit(1);
      }
      
      console.log('Build completed successfully!');
    });
  });
});
