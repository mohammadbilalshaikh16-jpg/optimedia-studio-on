import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import http from 'http';

const rootDir = process.cwd();
const distBinDir = path.join(rootDir, 'dist-bin');
const outputFile = path.join(distBinDir, 'optimedia-studio');
const publicDownloadDir = path.join(rootDir, 'public', 'downloads');
const publicDownloadFile = path.join(publicDownloadDir, 'optimedia-studio-linux-x64');

console.log('================================================================');
console.log('  OptiMedia Studio - Standalone Executable Packaging Pipeline  ');
console.log('================================================================');

// 1. Build Frontend
console.log('\n[1/5] Building production React SPA with Vite...');
execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

// 2. Generate Embedded Assets
console.log('\n[2/5] Compiling static assets into memory map...');
execSync('bun scripts/generate-embedded-assets.ts', { stdio: 'inherit', cwd: rootDir });

// 3. Compile Standalone Bun Executable
console.log('\n[3/5] Compiling standalone single-binary application with Bun...');
if (!fs.existsSync(distBinDir)) {
  fs.mkdirSync(distBinDir, { recursive: true });
}

const compileCmd = `bun build --compile --minify --target=bun --outfile=${outputFile} src/standalone.ts`;
console.log(`Running: ${compileCmd}`);
execSync(compileCmd, { stdio: 'inherit', cwd: rootDir });

fs.chmodSync(outputFile, 0o755);

// 4. Copy to public downloads folder so web users can download it
console.log('\n[4/5] Publishing binary for web browser downloads...');
if (!fs.existsSync(publicDownloadDir)) {
  fs.mkdirSync(publicDownloadDir, { recursive: true });
}
fs.copyFileSync(outputFile, publicDownloadFile);
fs.chmodSync(publicDownloadFile, 0o755);

// 5. Verification and live self-test
console.log('\n[5/5] Running verification self-test on compiled binary...');
const stat = fs.statSync(outputFile);
const hash = crypto.createHash('sha256').update(fs.readFileSync(outputFile)).digest('hex');

console.log(`\nDistributable File Details:`);
console.log(`  Path:         ${outputFile}`);
console.log(`  Size:         ${(stat.size / 1024 / 1024).toFixed(2)} MB (${stat.size.toLocaleString()} bytes)`);
console.log(`  SHA-256:      ${hash}`);
console.log(`  Architecture: Linux x86_64 ELF 64-bit standalone executable`);

// Run quick live test
console.log('\nTesting binary execution with --test-mode...');
const testOut = execSync(`${outputFile} --test-mode --port 3899`, { cwd: rootDir }).toString();
console.log(testOut);

console.log('\n================================================================');
console.log('  SUCCESS! Standalone application packaged and verified!        ');
console.log('================================================================');
console.log(`Binary Location: ${outputFile}`);
console.log(`Web Download:    ${publicDownloadFile}`);
console.log(`\nTo run on any fresh system:`);
console.log(`  chmod +x ${path.basename(outputFile)}`);
console.log(`  ./${path.basename(outputFile)}`);
console.log('================================================================\n');
