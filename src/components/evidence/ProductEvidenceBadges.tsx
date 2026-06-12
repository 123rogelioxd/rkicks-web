import type { Product } from '@/types/product';
import { getProductEvidenceSummary } from '@/utils/product-evidence';
import styles from './ProductEvidenceBadges.module.css';

interface Props {
  product: Product;
  variant?: 'gallery' | 'cta';
}

export default function ProductEvidenceBadges({ product, variant = 'gallery' }: Props) {
  const evidence = getProductEvidenceSummary(product);
  const badges = variant === 'cta'
    ? [
        { label: 'Exact pair shown', complete: evidence.hasExactPairEvidence },
        { label: 'Real photos', complete: evidence.hasRealPhotos },
        { label: 'Authenticity reviewed', complete: true },
        { label: 'WhatsApp purchase support', complete: true },
      ]
    : [
        { label: 'Real photos', complete: evidence.hasRealPhotos },
        { label: 'Exact pair shown', complete: evidence.hasExactPairEvidence },
        { label: 'Size tag included', complete: evidence.hasSizeTag },
        { label: 'Box label included', complete: evidence.hasBoxLabel },
      ];

  return (
    <div className={`${styles.wrap} ${variant === 'cta' ? styles.cta : ''}`} aria-label="Product evidence">
      {badges.map((badge) => (
        <span
          key={badge.label}
          className={`${styles.badge} ${badge.complete ? styles.complete : styles.pending}`}
        >
          <span aria-hidden="true">{badge.complete ? '✓' : '•'}</span>
          {badge.label}
        </span>
      ))}
    </div>
  );
}
