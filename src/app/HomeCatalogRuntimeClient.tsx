'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import CompleteTheFit from '@/components/ecosystem/CompleteTheFit';
import Eyebrow from '@/components/ui/Eyebrow';
import Skeleton from '@/components/ui/Skeleton';
import type { Product } from '@/types/product';
import { fetchLiveCatalog, getPairingFromProduct, logRuntimeApi } from '@/utils/api-products';
import styles from './page.module.css';

export default function HomeCatalogRuntimeClient() {
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
        logRuntimeApi('homepage products load failed', error);
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

  const recentPairs = useMemo(
    () => [...availableProducts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3),
    [availableProducts]
  );

  const featuredPair = useMemo(
    () => availableProducts
      .map((product) => {
        const pairing = getPairingFromProduct(product);
        return pairing ? { ...pairing, product } : null;
      })
      .find((pairing) => pairing !== null) ?? null,
    [availableProducts]
  );

  return (
    <>
      <section className={styles.availableSection}>
        <div className="rk-page">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Eyebrow>Disponible ahora</Eyebrow>
              <h2 className={styles.sectionH}>Pares disponibles</h2>
            </div>
            <Link href="/catalogo" className={styles.sectionLink}>
              Ver catalogo -&gt;
            </Link>
          </div>

          {loading ? (
            <div className={styles.compactGrid} aria-busy="true" aria-label="Cargando productos recientes">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} height={210} radius="var(--rk-radius-md)" />
              ))}
            </div>
          ) : (
            <div className={styles.compactGrid}>
              {recentPairs.map((product) => (
                <ProductCard key={product.id} product={product} variant="compact" />
              ))}
            </div>
          )}
        </div>
      </section>

      {featuredPair && (
        <section className={styles.ctfSection}>
          <div className="rk-page">
            <CompleteTheFit
              pairing={featuredPair}
              product={featuredPair.product}
            />
          </div>
        </section>
      )}
    </>
  );
}
