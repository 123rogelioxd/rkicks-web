import type { EvidencePhotoType, Product } from '@/types/product';

export const REQUIRED_EVIDENCE_PHOTOS = [
  'front',
  'left_side',
  'right_side',
  'heel',
  'outsole',
  'size_tag',
  'box_label',
  'top_down',
] as const satisfies readonly EvidencePhotoType[];

export const OPTIONAL_EVIDENCE_PHOTOS = [
  'defect_closeup',
  'receipt',
] as const satisfies readonly EvidencePhotoType[];

export type RequiredEvidencePhotoType = (typeof REQUIRED_EVIDENCE_PHOTOS)[number];

export const evidencePhotoLabels: Record<EvidencePhotoType, string> = {
  front: 'Front',
  left_side: 'Left side',
  right_side: 'Right side',
  heel: 'Heel',
  outsole: 'Outsole',
  size_tag: 'Size tag',
  box_label: 'Box label',
  top_down: 'Top-down',
  defect_closeup: 'Defect closeup',
  receipt: 'Receipt / proof',
};

export const evidenceQualityRecommendations = [
  'Neutral background',
  'Natural lighting',
  'No heavy filters',
  'Show actual defects',
  'Avoid screenshots',
] as const;

export interface EvidenceChecklistItem {
  type: RequiredEvidencePhotoType;
  label: string;
  complete: boolean;
}

export interface ProductEvidenceSummary {
  requiredTotal: number;
  completedRequired: number;
  scoreLabel: string;
  canPublish: boolean;
  statusLabel: 'Draft only' | 'Ready to publish';
  checklist: EvidenceChecklistItem[];
  hasRealPhotos: boolean;
  hasExactPairEvidence: boolean;
  hasSizeTag: boolean;
  hasBoxLabel: boolean;
  hasReceipt: boolean;
}

export function getProductEvidenceSummary(product: Pick<Product, 'photos'>): ProductEvidenceSummary {
  const presentTypes = new Set(
    product.photos
      .map((photo) => photo.evidenceType)
      .filter((type): type is EvidencePhotoType => Boolean(type))
  );

  const checklist = REQUIRED_EVIDENCE_PHOTOS.map((type) => ({
    type,
    label: evidencePhotoLabels[type],
    complete: presentTypes.has(type),
  }));
  const completedRequired = checklist.filter((item) => item.complete).length;
  const requiredTotal = REQUIRED_EVIDENCE_PHOTOS.length;
  const hasRealPhotos = product.photos.some((photo) => Boolean(photo.url));

  return {
    requiredTotal,
    completedRequired,
    scoreLabel: `${completedRequired} / ${requiredTotal} photos`,
    canPublish: completedRequired >= requiredTotal,
    statusLabel: completedRequired >= requiredTotal ? 'Ready to publish' : 'Draft only',
    checklist,
    hasRealPhotos,
    hasExactPairEvidence: hasRealPhotos && presentTypes.has('front'),
    hasSizeTag: presentTypes.has('size_tag'),
    hasBoxLabel: presentTypes.has('box_label'),
    hasReceipt: presentTypes.has('receipt'),
  };
}
