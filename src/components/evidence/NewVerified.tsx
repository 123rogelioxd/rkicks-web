import type { Product } from '@/types/product';
import styles from './NewVerified.module.css';

interface Props {
  product: Product;
}

export default function NewVerified({ product }: Props) {
  if (product.condition !== 'new') return null;

  const checks = [
    'Unworn',
    'Clean outsole',
    product.box === 'original' ? 'Original box' : 'Box status reviewed',
    'RKicks verification completed',
  ];

  return (
    <section className={styles.wrap} aria-label="New Verified">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Condition evidence</p>
        <h2 className={styles.title}>New Verified</h2>
      </div>
      <div className={styles.grid}>
        {checks.map((check) => (
          <span key={check} className={styles.item}>
            <span aria-hidden="true">✓</span>
            {check}
          </span>
        ))}
      </div>
    </section>
  );
}
