import Link from 'next/link';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils/currency';
import StatusPill from '@/components/ui/StatusPill';
import ConditionChip from '@/components/ui/ConditionChip';
import FlawDot from '@/components/ui/FlawDot';
import FlawBar from '@/components/ui/FlawBar';
import RCGPill from '@/components/rcg/RCGPill';
import ProductImage from './ProductImage';
import styles from './ProductCardFeatured.module.css';

interface Props {
  product: Product;
}

export default function ProductCardFeatured({ product }: Props) {
  const editorial = product.photos.find((p) => p.type === 'editorial') ?? product.photos[0];

  return (
    <Link href={`/producto/${product.slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <ProductImage
          src={editorial?.url ?? ''}
          alt={editorial?.alt ?? product.model}
          brand={product.brand}
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        />
        <span className={styles.flawDotWrap}>
          <FlawDot level={product.flawLevel} />
        </span>
      </div>

      <div className={styles.body}>
        <p className={styles.label}>Destacado</p>
        <p className={styles.eyebrow}>{product.brand} · {product.category}</p>
        <p className={styles.name}>{product.model}</p>
        {product.subtitle && (
          <p className={styles.subtitle}>{product.subtitle}</p>
        )}

        <div className={styles.meta}>
          <span className={styles.sizeLabel}>US {product.size.us}</span>
          <ConditionChip condition={product.condition} />
          <FlawBar level={product.flawLevel} />
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <StatusPill status={product.status} />
          <RCGPill />
        </div>
      </div>
    </Link>
  );
}
