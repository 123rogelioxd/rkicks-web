import type { Product } from '@/types/product';
import {
  evidenceQualityRecommendations,
  getProductEvidenceSummary,
} from '@/utils/product-evidence';
import styles from './ProductEvidenceChecklist.module.css';

interface Props {
  product: Product;
}

export default function ProductEvidenceChecklist({ product }: Props) {
  const evidence = getProductEvidenceSummary(product);

  return (
    <section className={styles.wrap} aria-label="Product Evidence Checklist">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Product Evidence Checklist</p>
          <h2 className={styles.title}>Evidence score: {evidence.scoreLabel}</h2>
        </div>
        <span className={`${styles.status} ${evidence.canPublish ? styles.ready : styles.draft}`}>
          {evidence.statusLabel}
        </span>
      </div>

      <div className={styles.checklist}>
        {evidence.checklist.map((item) => (
          <span key={item.type} className={item.complete ? styles.complete : styles.missing}>
            <span aria-hidden="true">{item.complete ? '✓' : '•'}</span>
            {item.label}
          </span>
        ))}
      </div>

      {!evidence.canPublish && (
        <p className={styles.blocked}>Cannot publish until all required evidence photos are uploaded.</p>
      )}

      <div className={styles.recommendations}>
        <p className={styles.eyebrow}>Photo quality</p>
        {evidenceQualityRecommendations.map((recommendation) => (
          <span key={recommendation}>{recommendation}</span>
        ))}
      </div>
    </section>
  );
}
