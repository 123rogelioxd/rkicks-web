import type { Product } from '@/types/product';
import ProductCard from './ProductCard';
import styles from './RelatedProducts.module.css';

interface Props {
  current: Product;
  all: Product[];
}

export default function RelatedProducts({ current, all }: Props) {
  const related = all
    .filter(p =>
      p.id !== current.id &&
      p.status !== 'sold' &&
      (p.brand === current.brand || p.size.us === current.size.us)
    )
    .slice(0, 4);

  if (related.length === 0) return null;

  const heading =
    related.some(p => p.brand === current.brand)
      ? `Más de ${current.brand}`
      : `Más en US ${current.size.us}`;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>También disponible</p>
        <h2 className={styles.heading}>{heading}</h2>
      </div>

      <div className={styles.grid}>
        {related.map(product => (
          <ProductCard key={product.id} product={product} variant="grid" />
        ))}
      </div>
    </section>
  );
}
