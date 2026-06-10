import type { Pairing } from '@/types/product';
import type { Product } from '@/types/product';
import styles from './CompleteTheFit.module.css';

interface Props {
  pairing: Pairing;
  product: Product;
}

export default function CompleteTheFit({ pairing, product }: Props) {
  return (
    <div className={styles.block}>
      <div className={styles.left}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          Complete The Fit · RDecants
        </div>

        <p className={styles.pairing}>
          {product.model} → {pairing.fragranceName}
        </p>

        <p className={styles.rationale}>{pairing.rationale}</p>
      </div>

      <div className={styles.actions}>
        <a
          href={`https://rdecants.com/producto/${pairing.fragranceSlug}`}
          className={styles.linkBtn}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver en RDecants →
        </a>
      </div>
    </div>
  );
}
