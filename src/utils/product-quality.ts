import type { Product } from '@/types/product';
import { getProductEvidenceSummary, type ProductEvidenceSummary } from './product-evidence';

export type QualityTier = 'weak' | 'needs-improvement' | 'ready';

export interface QualityScoreBreakdown {
  photoEvidence: number;    // 0–40 (5 pts per required photo)
  productInfo: number;      // 0–20
  variantQuality: number;   // 0–15
  trustEvidence: number;    // 0–15
  pricingReadiness: number; // 0–10
}

export interface ProductQualityResult {
  score: number;
  tier: QualityTier;
  tierLabel: string;
  breakdown: QualityScoreBreakdown;
  warnings: string[];
}

export const QUALITY_THRESHOLD_READY = 80;
export const QUALITY_THRESHOLD_NEEDS_IMPROVEMENT = 50;

export const TIER_LABELS: Record<QualityTier, string> = {
  ready: 'Excellent Listing',
  'needs-improvement': 'Needs Improvement',
  weak: 'Weak Listing',
};

const MODEL_FALLBACK = 'Sneaker premium';
const BRAND_FALLBACK = 'RKicks';

export function getProductQualityScore(product: Product): ProductQualityResult {
  const evidence = getProductEvidenceSummary(product);
  return computeQualityScore(product, evidence);
}

export function computeQualityScore(
  product: Product,
  evidence: ProductEvidenceSummary,
): ProductQualityResult {
  const warnings = new Set<string>();

  // ── 1. Photo evidence — 40 pts (5 per required photo) ──────────────
  const photoEvidence = evidence.completedRequired * 5;
  if (evidence.completedRequired < evidence.requiredTotal) {
    warnings.add(`Solo ${evidence.completedRequired} / ${evidence.requiredTotal} fotos requeridas`);
    for (const item of evidence.checklist) {
      if (!item.complete) warnings.add(`Falta foto: ${item.labelES}`);
    }
  }

  // ── 2. Product information — 20 pts ────────────────────────────────
  let productInfo = 0;
  if (product.model && product.model !== MODEL_FALLBACK) {
    productInfo += 4;
  } else {
    warnings.add('Falta nombre del modelo');
  }
  if (product.brand && product.brand !== BRAND_FALLBACK) {
    productInfo += 3;
  } else {
    warnings.add('Falta marca');
  }
  if (product.subtitle?.trim()) {
    productInfo += 3;
  } else {
    warnings.add('Falta colorway o año');
  }
  productInfo += 4; // condition is always present
  if (product.notes && product.notes.trim().length > 10) {
    productInfo += 6;
  } else {
    warnings.add('Falta descripción');
  }

  // ── 3. Size / variant quality — 15 pts ─────────────────────────────
  let variantQuality = 0;
  const availableVariants = product.variants.filter((v) => v.status === 'available');
  if (availableVariants.length > 0) {
    variantQuality += 5;
  } else {
    warnings.add('No hay variante disponible');
  }
  const hasMxSize = product.variants.some(
    (v) => v.sizeMx !== undefined && v.sizeMx !== null && v.sizeMx !== '',
  );
  if (hasMxSize) {
    variantQuality += 4;
  } else {
    warnings.add('Falta talla MX');
  }
  const hasVariantPrice = product.variants.some(
    (v) => typeof v.salePrice === 'number' && v.salePrice > 0,
  );
  if (hasVariantPrice) {
    variantQuality += 3;
  } else {
    warnings.add('Falta precio en variantes');
  }
  if (product.variants.length > 0) {
    variantQuality += 3;
  }

  // ── 4. Trust evidence — 15 pts ─────────────────────────────────────
  let trustEvidence = 0;
  if (evidence.hasSizeTag) trustEvidence += 4;
  if (evidence.hasBoxLabel) trustEvidence += 4;
  if (evidence.hasExactPairEvidence) trustEvidence += 4;
  if (product.notes?.trim()) {
    trustEvidence += 3;
  } else {
    warnings.add('Falta descripción de autenticidad');
  }

  // ── 5. Pricing readiness — 10 pts ──────────────────────────────────
  let pricingReadiness = 0;
  if (hasVariantPrice) pricingReadiness += 4;
  if (product.price > 0) {
    pricingReadiness += 4;
  } else {
    warnings.add('Precio público incompleto');
  }
  if (product.status === 'available') pricingReadiness += 2;

  const score = photoEvidence + productInfo + variantQuality + trustEvidence + pricingReadiness;
  const tier = scoreTier(score);

  return {
    score,
    tier,
    tierLabel: TIER_LABELS[tier],
    breakdown: { photoEvidence, productInfo, variantQuality, trustEvidence, pricingReadiness },
    warnings: [...new Set(warnings)],
  };
}

export function scoreTier(score: number): QualityTier {
  if (score >= QUALITY_THRESHOLD_READY) return 'ready';
  if (score >= QUALITY_THRESHOLD_NEEDS_IMPROVEMENT) return 'needs-improvement';
  return 'weak';
}

export function getPublishingWarning(score: number): string | null {
  if (score >= QUALITY_THRESHOLD_READY) return null;
  if (score >= QUALITY_THRESHOLD_NEEDS_IMPROVEMENT) {
    return 'Este listing puede no convertir bien porque la evidencia está incompleta.';
  }
  return 'Este listing tiene evidencia muy débil. Completa la documentación antes de publicar.';
}
