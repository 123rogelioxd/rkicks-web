import type { Product } from '@/types/product';
import { getProductStyling } from '@/utils/product-styling';
import styles from './WhyItWorks.module.css';

interface Props {
  product: Product;
}

export default function WhyItWorks({ product }: Props) {
  const styling = getProductStyling(product);

  return (
    <section className={styles.wrap} aria-label="Por qué funciona este par">
      <p className={styles.eyebrow}>Para tu día a día</p>
      <h2 className={styles.heading}>Por qué funciona este par</h2>
      <p className={styles.lead}>{styling.lead}</p>

      <div className={styles.pairings}>
        <span className={styles.pairingsLabel}>Combina con</span>
        <div className={styles.chips}>
          {styling.pairings.map((pairing) => (
            <span key={pairing} className={styles.chip}>{pairing}</span>
          ))}
        </div>
      </div>

      <p className={styles.useCase}>{styling.useCase}</p>
    </section>
  );
}
