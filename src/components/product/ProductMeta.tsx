import type { Product, ProductVariant } from '@/types/product';
import { formatPrice } from '@/utils/currency';
import {
  conditionLabel,
  flawLevelLabelES,
  getVariantDetailSizeLabel,
  getVariantPrice,
  getVariantStatus,
  statusLabelES,
} from '@/utils/inventory';
import StatusPill from '@/components/ui/StatusPill';
import ConditionChip from '@/components/ui/ConditionChip';
import FlawBar from '@/components/ui/FlawBar';
import styles from './ProductMeta.module.css';

interface Props {
  product: Product;
  selectedVariant?: ProductVariant | null;
  onSelectVariant?: (variant: ProductVariant) => void;
}

export default function ProductMeta({ product, selectedVariant, onSelectVariant }: Props) {
  const displayedPrice = getVariantPrice(product, selectedVariant);
  const displayedStatus = getVariantStatus(product, selectedVariant);
  const displayedSize = selectedVariant ? getVariantDetailSizeLabel(product, selectedVariant) : null;

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
        <span className={styles.price}>{formatPrice(displayedPrice)}</span>
        <span className={styles.currency}>MXN</span>
        <StatusPill status={displayedStatus} />
      </div>

      {displayedSize && (
        <p className={styles.selectedSize}>
          <span>Talla seleccionada</span>
          {displayedSize}
        </p>
      )}

      <div className={styles.selectorBlock}>
        <p className={styles.selectorTitle}>Selecciona talla</p>
        <div className={styles.variantGrid}>
          {product.variants.map((variant) => {
            const selectable = variant.status === 'available';
            const selected = selectedVariant?.id === variant.id;

            return (
              <button
                key={variant.id}
                type="button"
                className={`${styles.variantChip} ${selected ? styles.variantChipSelected : ''}`}
                disabled={!selectable}
                onClick={() => selectable && onSelectVariant?.(variant)}
                aria-pressed={selected}
              >
                <span className={styles.variantSize}>{variant.sizeLabel}</span>
                <span className={styles.variantStatus}>{statusLabelES[variant.status]}</span>
              </button>
            );
          })}
        </div>
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
