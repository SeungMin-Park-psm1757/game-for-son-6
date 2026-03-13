import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const distDir = join(root, 'dist');
const distAssetsDir = join(distDir, 'assets');
const targetAssetsDir = join(root, 'assets');

if (!existsSync(distAssetsDir)) {
  throw new Error('Missing dist/assets directory. Run Vite build first.');
}

rmSync(targetAssetsDir, { recursive: true, force: true });
mkdirSync(targetAssetsDir, { recursive: true });
cpSync(distAssetsDir, targetAssetsDir, { recursive: true });

const assetFiles = readdirSync(targetAssetsDir);
const jsFile = assetFiles.find((file) => file.endsWith('.js'));
const cssFile = assetFiles.find((file) => file.endsWith('.css'));

if (!jsFile || !cssFile) {
  throw new Error('Expected built JS and CSS assets were not found.');
}

copyFileSync(join(targetAssetsDir, jsFile), join(targetAssetsDir, 'app.js'));
copyFileSync(join(targetAssetsDir, cssFile), join(targetAssetsDir, 'app.css'));
