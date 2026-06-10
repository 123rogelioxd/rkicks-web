import type { Product } from '@/types/product';
import { formatPrice } from '@/utils/currency';
import { conditionLabel, flawLevelLabelES } from '@/utils/inventory';
import StatusPill from '@/components/ui/StatusPill';
import ConditionChip from '@/components/ui/ConditionChip';
import FlawBar from '@/components/ui/FlawBar';
import styles from './ProductMeta.module.css';

interface Props {
  product: Product;
}

export default function ProductMeta({ product }: Props) {
  return (
    <div className={styles.meta}>
      {/* Eyebrow — brand + category */}
      <p className={styles.eyebrow}>{product.brand} · {product.category}</p>

      {/* Model name */}
      <h1 className={styles.name}>{product.model}</h1>

      {/* Subtitle — Cormorant italic · colorway/year */}
      {product.subtitle && (
        <p className={styles.subtitle}>{product.subtitle}</p>
      )}

      {/* Price — dominant */}
      <div className={styles.priceRow}>
        <span className={styles.price}>{formatPrice(product.price)}</span>
        <span className={styles.currency}>MXN</span>
        <StatusPill status={product.status} />
      </div>

      {/* Size chips */}
      <div className={styles.sizeRow}>
        <span className={styles.sizeChip}>
          <span className={styles.sizeLabel}>US</span>
          {product.size.us}
        </span>
        <span className={styles.sizeDivider} aria-hidden="true" />
        <span className={styles.sizeChip}>
          <span className={styles.sizeLabel}>EUR</span>
          {product.size.eur}
        </span>
        <span className={styles.sizeDivider} aria-hidden="true" />
        <span className={styles.sizeChip}>
          <span className={styles.sizeLabel}>CM</span>
          {product.size.cm}
        </span>
      </div>

      {/* Condition + flaw bar row */}
      <div className={styles.conditionRow}>
        <ConditionChip condition={product.condition} />
        <FlawBar level={product.flawLevel} />
        <span className={styles.flawLabel}>{flawLevelLabelES[product.flawLevel]}</span>
      </div>

      {/* Listing ID */}
      <p className={styles.listingId}>{product.id}</p>
    </div>
  );
}
