'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { fetchLiveCatalog, logRuntimeApi } from '@/utils/api-products';
import { formatPrice } from '@/utils/currency';
import styles from './page.module.css';

export default function HomeRuntimeClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      setLoading(true);
      try {
        const liveProducts = await fetchLiveCatalog();
        if (!cancelled) setProducts(liveProducts);
      } catch (error) {
        logRuntimeApi('homepage catalog load failed', error);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  const availableProducts = useMemo(
    () => products.filter((product) => product.status === 'available'),
    [products]
  );

  const minPrice = availableProducts.length > 0
    ? Math.min(...availableProducts.map((product) => product.price))
    : null;

  const countLabel = loading
    ? 'Cargando inventario'
    : `${availableProducts.length} disponibles ahora`;

  const ctaLabel = loading
    ? 'Ver catalogo'
    : `Ver ${availableProducts.length} pares ->`;

  return (
    <>
      <div className={styles.heroStats} aria-label="Inventario actual" aria-busy={loading}>
        <span className={styles.heroStat}>
          <span className={styles.heroStatDot} aria-hidden="true" />
          {countLabel}
        </span>

        {minPrice !== null && (
          <>
            <span className={styles.heroStatDiv} aria-hidden="true" />
            <span className={styles.heroStat}>
              Desde {formatPrice(minPrice)} MXN
            </span>
          </>
        )}

        <span className={styles.heroStatDiv} aria-hidden="true" />
        <span className={styles.heroStat}>
          Real Condition Guarantee
        </span>
      </div>

      <div className={styles.heroCTARow}>
        <Link href="/catalogo" className={styles.heroCTA}>
          {ctaLabel}
        </Link>
        <Link href="/real-condition" className={styles.heroSecondaryLink}>
          Que es Real Condition
        </Link>
      </div>

    </>
  );
}
