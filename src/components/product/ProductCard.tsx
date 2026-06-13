import Link from 'next/link';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils/currency';
import { getAvailableSizeLabels } from '@/utils/inventory';
import StatusPill from '@/components/ui/StatusPill';
import ConditionChip from '@/components/ui/ConditionChip';
import FlawDot from '@/components/ui/FlawDot';
import RCGPill from '@/components/rcg/RCGPill';
import ProductImage from './ProductImage';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
  variant?: 'grid' | 'compact';
}

export default function ProductCard({ product, variant = 'grid' }: Props) {
  const editorial = product.photos.find((p) => p.type === 'editorial') ?? product.photos[0];
  const availableSizes = getAvailableSizeLabels(product);

  // Honest scarcity — derived only from real available-variant count.
  const scarcityNote =
    product.status === 'available' && availableSizes.length > 0 && availableSizes.length <= 2
      ? availableSizes.length === 1
        ? 'Última talla disponible'
        : 'Pocas piezas disponibles'
      : null;

  return (
    <Link
      href={`/producto?slug=${encodeURIComponent(product.slug)}`}
      className={`${styles.card} ${product.status === 'sold' ? styles.sold : ''} ${variant === 'compact' ? styles.compact : ''}`}
    >
      <div className={styles.imageWrap}>
        <ProductImage
          src={editorial?.url ?? ''}
          alt={editorial?.alt ?? product.model}
          brand={product.brand}
          objectFit="contain"
          variant={variant === 'grid' ? 'catalogCard' : 'default'}
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        />
        <span className={styles.flawDotWrap}>
          <FlawDot level={product.flawLevel} />
        </span>
      </div>

      <div className={styles.body}>
        <p className={styles.eyebrow}>{product.brand}</p>
        <p className={styles.name}>{product.model}</p>

        <div className={styles.meta}>
          {availableSizes.length > 0 && (
            <span className={styles.availableSizes}>Tallas: {availableSizes.join(' / ')}</span>
          )}
          <ConditionChip condition={product.condition} />
        </div>

        {scarcityNote && (
          <span className={styles.scarcity}>
            <span className={styles.scarcityDot} aria-hidden="true" />
            {scarcityNote}
          </span>
        )}

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <StatusPill status={product.status} />
        </div>

        {variant === 'grid' && <RCGPill />}
      </div>
    </Link>
  );
}
