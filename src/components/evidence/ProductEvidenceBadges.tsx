import type { Product } from '@/types/product';
import { getProductEvidenceSummary } from '@/utils/product-evidence';
import styles from './ProductEvidenceBadges.module.css';

interface BadgeDef {
  labelComplete: string;
  labelPending: string;
  complete: boolean;
}

interface Props {
  product: Product;
  variant?: 'gallery' | 'cta';
}

function buildBadges(evidence: ReturnType<typeof getProductEvidenceSummary>, variant: 'gallery' | 'cta'): BadgeDef[] {
  if (variant === 'cta') {
    return [
      {
        labelComplete: 'Foto del par exacto',
        labelPending: 'Fotos disponibles',
        complete: evidence.hasExactPairEvidence,
      },
      {
        labelComplete: 'Fotos reales',
        labelPending: 'Fotos disponibles',
        complete: evidence.hasRealPhotos,
      },
      {
        labelComplete: 'Autenticidad verificada',
        labelPending: 'Autenticidad verificada',
        complete: true,
      },
      {
        labelComplete: 'Compra por WhatsApp',
        labelPending: 'Compra por WhatsApp',
        complete: true,
      },
    ];
  }

  return [
    {
      labelComplete: 'Fotos reales',
      labelPending: 'Fotos disponibles',
      complete: evidence.hasRealPhotos,
    },
    {
      labelComplete: 'Foto del par exacto',
      labelPending: 'Pide fotos adicionales',
      complete: evidence.hasExactPairEvidence,
    },
    {
      labelComplete: 'Etiqueta de talla incluida',
      labelPending: 'Verificación en proceso',
      complete: evidence.hasSizeTag,
    },
    {
      labelComplete: 'Caja documentada',
      labelPending: 'Consulta por WhatsApp',
      complete: evidence.hasBoxLabel,
    },
  ];
}

export default function ProductEvidenceBadges({ product, variant = 'gallery' }: Props) {
  const evidence = getProductEvidenceSummary(product);
  const badges = buildBadges(evidence, variant);

  return (
    <div className={`${styles.wrap} ${variant === 'cta' ? styles.cta : ''}`} aria-label="Evidencia del producto">
      {badges.map((badge) => (
        <span
          key={badge.labelComplete}
          className={`${styles.badge} ${badge.complete ? styles.complete : styles.pending}`}
        >
          <span aria-hidden="true">{badge.complete ? '✓' : '·'}</span>
          {badge.complete ? badge.labelComplete : badge.labelPending}
        </span>
      ))}
    </div>
  );
}
