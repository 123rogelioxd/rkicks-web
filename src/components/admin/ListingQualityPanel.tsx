import type { Product } from '@/types/product';
import { getProductQualityScore, getPublishingWarning, QUALITY_THRESHOLD_READY } from '@/utils/product-quality';
import { getEvidenceScore } from '@/utils/product-evidence';
import styles from './ListingQualityPanel.module.css';

interface Props {
  product: Product;
}

export default function ListingQualityPanel({ product }: Props) {
  const quality = getProductQualityScore(product);
  const evidenceScore = getEvidenceScore(product);
  const publishingWarning = getPublishingWarning(quality.score);
  const isReady = quality.score >= QUALITY_THRESHOLD_READY;

  const tierClass =
    quality.tier === 'ready'
      ? styles.tierReady
      : quality.tier === 'needs-improvement'
        ? styles.tierNeeds
        : styles.tierWeak;

  return (
    <section className={styles.panel} aria-label="Listing Quality Panel">
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Listing Quality Panel</p>
          <div className={styles.scoreRow}>
            <span className={styles.scoreNum}>{quality.score}</span>
            <span className={styles.scoreDenom}>&thinsp;/ 100</span>
          </div>
        </div>
        <span className={`${styles.tierBadge} ${tierClass}`}>{quality.tierLabel}</span>
      </div>

      {/* Score breakdown */}
      <div className={styles.breakdown}>
        <p className={styles.eyebrow}>Desglose</p>
        {[
          { label: 'Fotos', score: quality.breakdown.photoEvidence, max: 40 },
          { label: 'Información', score: quality.breakdown.productInfo, max: 20 },
          { label: 'Variantes', score: quality.breakdown.variantQuality, max: 15 },
          { label: 'Confianza', score: quality.breakdown.trustEvidence, max: 15 },
          { label: 'Precio', score: quality.breakdown.pricingReadiness, max: 10 },
        ].map(({ label, score, max }) => (
          <div key={label} className={styles.breakdownRow}>
            <span className={styles.breakdownLabel}>{label}</span>
            <div className={styles.breakdownBar}>
              <div
                className={styles.breakdownFill}
                style={{ width: `${(score / max) * 100}%` }}
                aria-valuenow={score}
                aria-valuemax={max}
              />
            </div>
            <span className={styles.breakdownScore}>{score}/{max}</span>
          </div>
        ))}
      </div>

      {/* Evidence score */}
      <div className={styles.evidenceRow}>
        <span className={styles.breakdownLabel}>Evidencia fotográfica</span>
        <span className={`${styles.evidencePill} ${evidenceScore === 100 ? styles.evidenceComplete : styles.evidenceIncomplete}`}>
          {evidenceScore}%
        </span>
      </div>

      {/* Warnings */}
      {quality.warnings.length > 0 && (
        <div className={styles.warnings}>
          <p className={styles.eyebrow}>Advertencias</p>
          {quality.warnings.map((w) => (
            <p key={w} className={styles.warning}>
              <span aria-hidden="true">⚠</span> {w}
            </p>
          ))}
        </div>
      )}

      {/* Publishing warning / gate */}
      {publishingWarning && (
        <div className={styles.publishBlock}>
          <p className={styles.publishWarning}>{publishingWarning}</p>
          <p className={styles.publishOverride}>
            El operador puede publicar igualmente. Se recomienda completar la documentación primero.
          </p>
        </div>
      )}

      {isReady && (
        <p className={styles.publishReady}>✓ Este listing está listo para publicar.</p>
      )}
    </section>
  );
}
