import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const root = process.cwd();
const require = createRequire(import.meta.url);

function loadTsModule(relativePath) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;

  const sandbox = {
    exports: {},
    module: { exports: {} },
    require,
  };
  sandbox.module.exports = sandbox.exports;
  vm.runInNewContext(transpiled, sandbox, { filename: relativePath });
  return sandbox.exports;
}

const evidence = loadTsModule('src/utils/product-evidence.ts');

function photo(evidenceType) {
  return {
    url: `https://example.com/${evidenceType}.webp`,
    type: 'detail',
    alt: evidenceType,
    evidenceType,
  };
}

const requiredTypes = evidence.REQUIRED_EVIDENCE_PHOTOS;
const insufficientProduct = {
  photos: requiredTypes.slice(0, 6).map(photo),
};
const completeProduct = {
  photos: requiredTypes.map(photo),
};

const insufficient = evidence.getProductEvidenceSummary(insufficientProduct);
assert.equal(insufficient.completedRequired, 6, 'evidence score counts completed required photos');
assert.equal(insufficient.requiredTotal, 8, 'evidence score has eight required photos');
assert.equal(insufficient.canPublish, false, 'publish is blocked with insufficient evidence');
assert.equal(insufficient.statusLabel, 'Draft only', 'insufficient evidence is draft only');

const complete = evidence.getProductEvidenceSummary(completeProduct);
assert.equal(complete.completedRequired, 8, 'all required photos are counted');
assert.equal(complete.canPublish, true, 'publish is allowed with minimum evidence');
assert.equal(complete.statusLabel, 'Ready to publish', 'complete evidence is ready to publish');
assert.equal(complete.hasSizeTag, true, 'size tag evidence is detected');
assert.equal(complete.hasBoxLabel, true, 'box label evidence is detected');

const badgesSource = fs.readFileSync(path.join(root, 'src/components/evidence/ProductEvidenceBadges.tsx'), 'utf8');
assert.match(badgesSource, /Exact pair shown/, 'PDP displays exact-pair evidence badge');
assert.match(badgesSource, /Real photos/, 'PDP displays real-photo evidence badge');
assert.match(badgesSource, /Size tag included/, 'PDP displays size-tag evidence badge');
assert.match(badgesSource, /Box label included/, 'PDP displays box-label evidence badge');

const newVerifiedSource = fs.readFileSync(path.join(root, 'src/components/evidence/NewVerified.tsx'), 'utf8');
assert.match(newVerifiedSource, /New Verified/, 'NEW products show New Verified section');
assert.match(newVerifiedSource, /Unworn/, 'New Verified includes unworn check');
assert.match(newVerifiedSource, /Clean outsole/, 'New Verified includes clean outsole check');

const gallerySource = fs.readFileSync(path.join(root, 'src/components/product/ProductGallery.tsx'), 'utf8');
assert.match(gallerySource, /Photos/, 'gallery shows total photo count');
assert.match(gallerySource, /thumbStrip/, 'gallery supports thumbnail strip');
assert.match(gallerySource, /lightboxOpen/, 'gallery supports fullscreen preview');
assert.match(gallerySource, /handleTouchEnd/, 'gallery supports mobile swipe');

console.log('Product Evidence Layer v1 checks passed.');
