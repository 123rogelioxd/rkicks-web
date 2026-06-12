import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), 'out');

function assertExists(path, label) {
  if (!existsSync(path)) {
    throw new Error(`${label} is missing: ${path}`);
  }
}

function assertDirectory(path, label) {
  assertExists(path, label);
  if (!statSync(path).isDirectory()) {
    throw new Error(`${label} is not a directory: ${path}`);
  }
}

function assertFile(path, label) {
  assertExists(path, label);
  if (!statSync(path).isFile()) {
    throw new Error(`${label} is not a file: ${path}`);
  }
}

assertDirectory(outDir, 'Static export output');
assertFile(join(outDir, 'index.html'), 'Homepage export');
assertFile(join(outDir, 'catalogo', 'index.html'), 'Catalog page export');
assertFile(join(outDir, 'producto', 'index.html'), 'Runtime product page export');
assertFile(join(outDir, 'real-condition', 'index.html'), 'Real Condition page export');
assertFile(join(outDir, 'nosotros', 'index.html'), 'About page export');
assertDirectory(join(outDir, '_next', 'static'), 'Next static assets');

const productDir = join(outDir, 'producto');
assertDirectory(productDir, 'Product export directory');

const productPages = readdirSync(productDir)
  .filter((entry) => existsSync(join(productDir, entry, 'index.html')));

if (productPages.length === 0) {
  throw new Error('No product pages were exported under out/producto/. Check live catalog slug generation.');
}

const forbiddenFiles = [
  join(outDir, 'api', 'rkicks', 'catalog.php'),
  join(outDir, 'api', 'rkicks', 'product.php'),
];

for (const file of forbiddenFiles) {
  if (existsSync(file)) {
    throw new Error(`Obsolete PHP bridge file should not be exported: ${file}`);
  }
}

console.log(`Verified static export in out/ with ${productPages.length} product page(s).`);
