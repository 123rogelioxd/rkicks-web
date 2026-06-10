import type { ProductStatus } from '@/types/product';
import { statusLabelES } from '@/utils/inventory';
import styles from './StatusPill.module.css';

const variantClass: Record<ProductStatus, string> = {
  available:   styles.available,
  reserved:    styles.reserved,
  sold:        styles.sold,
  'pre-order': styles.preorder,
};

interface Props {
  status: ProductStatus;
}

export default function StatusPill({ status }: Props) {
  return (
    <span className={`${styles.pill} ${variantClass[status]}`}>
      <span className={styles.dot} />
      {statusLabelES[status]}
    </span>
  );
}
