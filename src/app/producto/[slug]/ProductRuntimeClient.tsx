'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ProductGallery from '@/components/product/ProductGallery';
import ProductMeta from '@/components/product/ProductMeta';
import ConditionTable from '@/components/rcg/ConditionTable';
import FlawMap from '@/components/rcg/FlawMap';
import AuthenticityBlock from '@/components/rcg/AuthenticityBlock';
import RelatedProducts from '@/components/product/RelatedProducts';
import RCGStamp from '@/components/rcg/RCGStamp';
import CompleteTheFit from '@/components/ecosystem/CompleteTheFit';
import { WhatsAppProductCTA } from '@/components/whatsapp/WhatsAppCTA';
import Eyebrow from '@/components/ui/Eyebrow';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import type { Pairing, Product } from '@/types/product';
import {
  canUseLocalRuntimeFallback,
  fetchLiveCatalog,
  fetchLiveProductBySlug,
  getPairingFromProduct,
  logRuntimeApi,
} from '@/utils/api-products';
import styles from './page.module.css';

interface Props {
  slug: string;
  fallbackProduct: Product;
  fallbackPairing: Pairing | null;
  fallbackProducts: Product[];
}

export default function ProductRuntimeClient({
  slug,
  fallbackProduct,
  fallbackPairing,
  fallbackProducts,
}: Props) {
  const useLocalFallback = canUseLocalRuntimeFallback();
  const [product, setProduct] = useState<Product | null>(() => useLocalFallback ? fallbackProduct : null);
  const [allProducts, setAllProducts] = useState<Product[]>(() => useLocalFallback ? fallbackProducts : []);
  const [loading, setLoading] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setProductError(null);
      try {
        const liveProduct = await fetchLiveProductBySlug(slug);
        if (!liveProduct) throw new Error(`RKicks product ${slug} was not found in the live API`);
        if (!cancelled) setProduct(liveProduct);
      } catch (error) {
        logRuntimeApi(`product fallback reason for ${slug}`, error);
        if (!cancelled) {
          if (canUseLocalRuntimeFallback()) {
            setProduct(fallbackProduct);
          } else {
            setProduct(null);
            setProductError('No pudimos cargar este producto en vivo.');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function loadRelatedCatalog() {
      try {
        const liveProducts = await fetchLiveCatalog();
        if (!cancelled && liveProducts.length > 0) setAllProducts(liveProducts);
      } catch (error) {
        logRuntimeApi('related-products fallback reason', error);
        if (!cancelled && canUseLocalRuntimeFallback()) setAllProducts(fallbackProducts);
      }
    }

    loadProduct();
    loadRelatedCatalog();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const pairing = useMemo(
    () => product ? getPairingFromProduct(product) ?? fallbackPairing : fallbackPairing,
    [fallbackPairing, product]
  );

  if (!product && loading) {
    return (
      <>
        <div className={styles.galleryZone}>
          <Skeleton height={420} radius="0" />
        </div>
        <main className={`rk-zone-bone ${styles.content}`}>
          <div className={`rk-page ${styles.inner}`}>
            <Skeleton height={220} radius="var(--rk-radius-md)" />
          </div>
        </main>
      </>
    );
  }

  if (!product && productError) {
    return (
      <main className={`rk-zone-bone ${styles.content}`}>
        <div className={`rk-page ${styles.inner}`}>
          <EmptyState
            heading={productError}
            body="Intenta recargar la pagina. Si el problema continua, escribenos por WhatsApp."
          />
        </div>
      </main>
    );
  }

  if (!product) return null;

  return (
    <>
      <div className={styles.galleryZone}>
        <ProductGallery
          photos={product.photos}
          brand={product.brand}
          model={product.model}
        />
      </div>

      <main className={`rk-zone-bone ${styles.content}`}>
        <div className={`rk-page ${styles.inner}`}>
          <section className={styles.metaSection}>
            <ProductMeta product={product} />
          </section>

          <section className={styles.rcgSection}>
            <div className={styles.rcgHeader}>
              <div>
                <Eyebrow>Real Condition Guarantee</Eyebrow>
                <h2 className={styles.rcgHeading}>Lo que ves es lo que llega.</h2>
              </div>
              <div className={styles.rcgStampWrap}>
                <RCGStamp />
              </div>
            </div>

            <div className={styles.rcgBody}>
              <ConditionTable product={product} />
              <FlawMap flaws={product.flaws} flawLevel={product.flawLevel} />
              <AuthenticityBlock product={product} />
            </div>
          </section>

          {pairing && (
            <section className={styles.ctfSection}>
              <CompleteTheFit pairing={pairing} product={product} />
            </section>
          )}

          {product.status !== 'sold' && (
            <section className={styles.ctaSection}>
              <WhatsAppProductCTA product={product} />
            </section>
          )}

          {product.status === 'sold' && (
            <section className={styles.soldSection}>
              <p className={styles.soldNote}>Este par ya fue vendido.</p>
              <Link href="/catalogo" className={styles.soldLink}>
                Ver pares similares -&gt;
              </Link>
            </section>
          )}

          <RelatedProducts current={product} all={allProducts} />

          <div className={styles.mobileSpacer} aria-hidden="true" />
        </div>
      </main>
    </>
  );
}
