import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const root = process.cwd();
const nodeRequire = createRequire(import.meta.url);

// Module registry — allows inter-module requires between src/utils files
const moduleRegistry = new Map();

function loadTsModule(relativePath) {
  const normalizedPath = relativePath.replace(/\\/g, '/');
  if (moduleRegistry.has(normalizedPath)) return moduleRegistry.get(normalizedPath);

  const absolutePath = path.join(root, normalizedPath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;

  const exports = {};
  const mod = { exports };
  moduleRegistry.set(normalizedPath, exports);

  const customRequire = (id) => {
    // Relative imports — resolve against the module's own directory
    if (id.startsWith('./') || id.startsWith('../')) {
      const dir = path.dirname(normalizedPath);
      const resolved = path.posix.join(dir, id).replace(/\\/g, '/');
      const tsResolved = resolved.endsWith('.ts') ? resolved : `${resolved}.ts`;
      if (fs.existsSync(path.join(root, tsResolved))) {
        return loadTsModule(tsResolved);
      }
    }
    // Path aliases or node_modules that are type-only — return empty object
    if (id.startsWith('@/')) return {};
    return nodeRequire(id);
  };

  vm.runInNewContext(transpiled, { exports, module: mod, require: customRequire }, { filename: absolutePath });
  return exports;
}

// ── Load modules ──────────────────────────────────────────────────────────────
const evidence = loadTsModule('src/utils/product-evidence.ts');
const quality  = loadTsModule('src/utils/product-quality.ts');

// ── Helpers ───────────────────────────────────────────────────────────────────
function photo(evidenceType) {
  return {
    url: `https://example.com/${evidenceType}.webp`,
    type: 'detail',
    alt: evidenceType,
    evidenceType,
  };
}

const requiredTypes = evidence.REQUIRED_EVIDENCE_PHOTOS;

const insufficientProduct = { photos: requiredTypes.slice(0, 6).map(photo) };
const completeProduct     = { photos: requiredTypes.map(photo) };

// ── Evidence layer tests (existing) ───────────────────────────────────────────
const insufficient = evidence.getProductEvidenceSummary(insufficientProduct);
assert.equal(insufficient.completedRequired, 6,       'evidence score counts completed required photos');
assert.equal(insufficient.requiredTotal,     8,        'evidence score has eight required photos');
assert.equal(insufficient.canPublish,        false,    'publish is blocked with insufficient evidence');
assert.equal(insufficient.statusLabel,       'Draft only', 'insufficient evidence is draft only');

const complete = evidence.getProductEvidenceSummary(completeProduct);
assert.equal(complete.completedRequired, 8,    'all required photos are counted');
assert.equal(complete.canPublish,        true,  'publish is allowed with minimum evidence');
assert.equal(complete.statusLabel,       'Ready to publish', 'complete evidence is ready to publish');
assert.equal(complete.hasSizeTag,        true,  'size tag evidence is detected');
assert.equal(complete.hasBoxLabel,       true,  'box label evidence is detected');

// Spanish labels on checklist
assert.ok(complete.checklist[0].labelES, 'checklist item has Spanish label');
assert.equal(complete.checklist.find(i => i.type === 'size_tag')?.labelES, 'Etiqueta de talla', 'size_tag Spanish label is correct');

// Evidence score (0-100)
const incompleteScore = evidence.getEvidenceScore(insufficientProduct);
const completeScore   = evidence.getEvidenceScore(completeProduct);
assert.equal(completeScore, 100, 'complete evidence returns score of 100');
assert.equal(incompleteScore, 75, 'six of eight photos returns score of 75');

// ── Product quality score tests ───────────────────────────────────────────────
const baseProduct = {
  id: 'RK-0001',
  slug: 'test-product',
  brand: 'RKicks',
  category: 'Sneaker',
  model: 'Sneaker premium',
  subtitle: '',
  size: { us: 0, eur: 0, cm: 0 },
  price: 0,
  status: 'available',
  variants: [],
  condition: 'new',
  flawLevel: 'none',
  flaws: [],
  box: 'original',
  photos: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  notes: undefined,
};

// Weak listing — minimal product
const weakResult = quality.getProductQualityScore(baseProduct);
assert.equal(weakResult.tier, 'weak', 'minimal product with no photos is a weak listing');
assert.ok(weakResult.score < 50, `weak listing score should be < 50, got ${weakResult.score}`);
assert.ok(weakResult.warnings.length > 0, 'weak listing has warnings');

// Needs-improvement listing — some info but incomplete photos
const needsProduct = {
  ...baseProduct,
  brand: 'Nike',
  model: 'Air Force 1',
  subtitle: '"White" 2023',
  price: 2800,
  status: 'available',
  variants: [{ id: 'v1', sizeLabel: '27 MX', status: 'available', salePrice: 2800, sizeMx: 27 }],
  photos: requiredTypes.slice(0, 5).map(photo), // 5 of 8 photos
  notes: 'Par en buen estado, poco uso.',
};

const needsResult = quality.getProductQualityScore(needsProduct);
assert.ok(
  needsResult.score >= 50 && needsResult.score < 80,
  `needs-improvement score should be 50–79, got ${needsResult.score}`,
);
assert.equal(needsResult.tier, 'needs-improvement', 'partial product is needs-improvement');

// Ready listing — complete product
const readyProduct = {
  ...baseProduct,
  brand: 'Nike',
  model: 'Air Max 90',
  subtitle: '"Triple White" 2023',
  price: 3500,
  status: 'available',
  variants: [{ id: 'v1', sizeLabel: '27 MX', status: 'available', salePrice: 3500, sizeMx: 27 }],
  photos: requiredTypes.map(photo),
  notes: 'Par en excelente estado, sin uso aparente. Suela limpia, sin defectos visibles.',
};

const readyResult = quality.getProductQualityScore(readyProduct);
assert.equal(readyResult.tier, 'ready', 'complete product is a ready listing');
assert.ok(readyResult.score >= 80, `ready listing score should be >= 80, got ${readyResult.score}`);
assert.equal(readyResult.warnings.length, 0, 'ready listing has no warnings');

// Breakdown checks
assert.equal(readyResult.breakdown.photoEvidence, 40, 'photo evidence max is 40');
assert.equal(readyResult.breakdown.productInfo,   20, 'product info max is 20');
assert.equal(readyResult.breakdown.variantQuality, 15, 'variant quality max is 15');
assert.equal(readyResult.breakdown.trustEvidence,  15, 'trust evidence max is 15');
assert.equal(readyResult.breakdown.pricingReadiness, 10, 'pricing readiness max is 10');
assert.equal(readyResult.score, 100, 'perfect product scores 100');

// scoreTier thresholds
assert.equal(quality.scoreTier(100), 'ready',            'score 100 is ready');
assert.equal(quality.scoreTier(80),  'ready',            'score 80 is ready');
assert.equal(quality.scoreTier(79),  'needs-improvement','score 79 is needs-improvement');
assert.equal(quality.scoreTier(50),  'needs-improvement','score 50 is needs-improvement');
assert.equal(quality.scoreTier(49),  'weak',             'score 49 is weak');
assert.equal(quality.scoreTier(0),   'weak',             'score 0 is weak');

// Publishing warning
assert.equal(quality.getPublishingWarning(80), null, 'no warning for score >= 80');
assert.equal(quality.getPublishingWarning(100), null, 'no warning for score 100');
assert.notEqual(quality.getPublishingWarning(79), null, 'warning for score 79');
assert.notEqual(quality.getPublishingWarning(50), null, 'warning for score 50');
assert.notEqual(quality.getPublishingWarning(49), null, 'warning for score 49');
assert.notEqual(quality.getPublishingWarning(0),  null, 'warning for score 0');

// Publish-with-warning operator override — score is returned regardless (no hard block)
const lowScoreResult = quality.getProductQualityScore(baseProduct);
assert.ok(typeof lowScoreResult.score === 'number', 'quality score always returns a number (no hard block)');

// ── Source-level checks ───────────────────────────────────────────────────────
const badgesSource = fs.readFileSync(path.join(root, 'src/components/evidence/ProductEvidenceBadges.tsx'), 'utf8');
// Badges are now in Spanish
assert.match(badgesSource, /Foto del par exacto/,       'PDP evidence badge: exact pair (Spanish)');
assert.match(badgesSource, /Fotos reales/,               'PDP evidence badge: real photos (Spanish)');
assert.match(badgesSource, /Etiqueta de talla incluida/, 'PDP evidence badge: size tag (Spanish)');
assert.match(badgesSource, /Caja documentada/,           'PDP evidence badge: box label (Spanish)');
// Honest soft copy for incomplete evidence
assert.match(badgesSource, /Fotos disponibles/,          'PDP evidence badge: soft pending copy');
assert.match(badgesSource, /Verificación en proceso/,    'PDP evidence badge: soft verification copy');
assert.match(badgesSource, /Pide fotos adicionales/,     'PDP evidence badge: request photos copy');

const newVerifiedSource = fs.readFileSync(path.join(root, 'src/components/evidence/NewVerified.tsx'), 'utf8');
assert.match(newVerifiedSource, /New Verified/, 'NEW products show New Verified section');
assert.match(newVerifiedSource, /Unworn/,       'New Verified includes unworn check');
assert.match(newVerifiedSource, /Clean outsole/,'New Verified includes clean outsole check');

const gallerySource = fs.readFileSync(path.join(root, 'src/components/product/ProductGallery.tsx'), 'utf8');
assert.match(gallerySource, /fotos/,          'gallery shows total photo count in Spanish');
assert.match(gallerySource, /thumbStrip/,     'gallery supports thumbnail strip');
assert.match(gallerySource, /lightboxOpen/,   'gallery supports fullscreen preview');
assert.match(gallerySource, /handleTouchEnd/, 'gallery supports mobile swipe');

const whatsappSource = fs.readFileSync(path.join(root, 'src/utils/whatsapp.ts'), 'utf8');
assert.match(whatsappSource, /buildDemandCaptureMessage/, 'whatsapp util has demand capture message builder');
assert.match(whatsappSource, /Estoy buscando este par/,   'demand capture message includes product reference');
assert.match(whatsappSource, /Quedo pendiente/,           'demand capture message includes follow-up intent');

const demandSource = fs.readFileSync(path.join(root, 'src/components/catalog/DemandCaptureWhatsApp.tsx'), 'utf8');
assert.match(demandSource, /¿Buscas otra talla/,     'demand capture shows correct Spanish heading');
assert.match(demandSource, /buildDemandCaptureMessage/, 'demand capture uses demand message builder');
assert.match(demandSource, /Avísame por WhatsApp/,   'demand capture shows WhatsApp CTA');

const realDeliveriesSource = fs.readFileSync(path.join(root, 'src/components/social/RealDeliveries.tsx'), 'utf8');
assert.match(realDeliveriesSource, /Entregas reales RKicks/, 'real deliveries component has correct heading');
assert.match(realDeliveriesSource, /Pronto verás/,           'real deliveries shows placeholder when no photos');
assert.match(realDeliveriesSource, /DeliveryPhoto/,          'real deliveries accepts photo data for future use');

const qualityPanelSource = fs.readFileSync(path.join(root, 'src/components/admin/ListingQualityPanel.tsx'), 'utf8');
assert.match(qualityPanelSource, /Listing Quality Panel/,  'listing quality panel has correct label');
assert.match(qualityPanelSource, /getPublishingWarning/,   'listing quality panel shows publishing warning');
assert.match(qualityPanelSource, /publishOverride/,        'listing quality panel allows operator override');

console.log('');
console.log('✓ Product Evidence Layer v1 checks passed.');
console.log('✓ Product Quality Score checks passed.');
console.log('✓ Publishing gate checks passed.');
console.log('✓ Demand capture checks passed.');
console.log('✓ Social proof placeholder checks passed.');
console.log('✓ Gallery Spanish counter check passed.');
console.log('✓ Evidence badge Spanish translation checks passed.');
console.log('');
console.log('All Catalog Excellence Sprint v1 checks passed.');
