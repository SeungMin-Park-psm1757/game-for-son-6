import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const distDir = join(root, 'dist');
const distAssetsDir = join(distDir, 'assets');
const distArtDir = join(distDir, 'art');
const targetAssetsDir = join(root, 'assets');
const targetArtDir = join(root, 'art');
const publicDir = join(root, 'public');
const publicFiles = ['favicon.svg', 'manifest.webmanifest'];

if (!existsSync(distAssetsDir)) {
  throw new Error('Missing dist/assets directory. Run Vite build first.');
}

rmSync(targetAssetsDir, { recursive: true, force: true });
mkdirSync(targetAssetsDir, { recursive: true });
cpSync(distAssetsDir, targetAssetsDir, { recursive: true });

if (existsSync(distArtDir)) {
  rmSync(targetArtDir, { recursive: true, force: true });
  mkdirSync(targetArtDir, { recursive: true });
  cpSync(distArtDir, targetArtDir, { recursive: true });
}

const assetFiles = readdirSync(targetAssetsDir);
const jsFile = assetFiles.find((file) => file.endsWith('.js'));
const cssFile = assetFiles.find((file) => file.endsWith('.css'));

if (!jsFile || !cssFile) {
  throw new Error('Expected built JS and CSS assets were not found.');
}

copyFileSync(join(targetAssetsDir, jsFile), join(targetAssetsDir, 'app.js'));
copyFileSync(join(targetAssetsDir, cssFile), join(targetAssetsDir, 'app.css'));

for (const file of publicFiles) {
  const source = join(publicDir, file);
  if (existsSync(source)) {
    copyFileSync(source, join(root, file));
  }
}
