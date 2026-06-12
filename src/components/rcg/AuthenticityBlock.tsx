import type { Product } from '@/types/product';
import styles from './AuthenticityBlock.module.css';

interface Props {
  product: Product;
}

const checks = [
  {
    title: 'Size label reviewed',
    detail: 'Etiqueta de talla revisada contra la informacion publicada.',
  },
  {
    title: 'Box label reviewed',
    detail: 'Etiqueta de caja revisada cuando la caja original esta presente.',
  },
  {
    title: 'Construction reviewed',
    detail: 'Materiales, forma, costuras y acabados revisados por RKicks.',
  },
  {
    title: 'RKicks verification completed',
    detail: 'Revision interna completada antes de publicar el par.',
  },
];

export default function AuthenticityBlock({ product }: Props) {
  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Authenticity Review</span>
        <span className={styles.listingId}>{product.id}</span>
      </div>

      <ul className={styles.list} aria-label="Authenticity review checklist">
        {checks.map((check) => (
          <li key={check.title} className={styles.item}>
            <span className={styles.check} aria-hidden="true">
              <CheckIcon />
            </span>
            <div className={styles.itemBody}>
              <p className={styles.itemTitle}>{check.title}</p>
              <p className={styles.itemDetail}>{check.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className={styles.guarantee}>
        Revision factual de RKicks. No es autenticacion de terceros.
      </p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6.5 L4.5 9 L10 3.5" stroke="var(--rk-available)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
