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
import type { Pairing, Product } from '@/types/product';
import { fetchLiveCatalog, fetchLiveProductBySlug, getPairingFromProduct } from '@/utils/api-products';
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
  const [product, setProduct] = useState(fallbackProduct);
  const [allProducts, setAllProducts] = useState(fallbackProducts);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        const liveProduct = await fetchLiveProductBySlug(slug);
        if (!cancelled && liveProduct) setProduct(liveProduct);
      } catch (error) {
        console.warn(`Using local RKicks product fallback for ${slug} because the live API could not be loaded.`, error);
      }
    }

    async function loadRelatedCatalog() {
      try {
        const liveProducts = await fetchLiveCatalog();
        if (!cancelled && liveProducts.length > 0) setAllProducts(liveProducts);
      } catch (error) {
        console.warn('Using local RKicks related-products fallback because the live API could not be loaded.', error);
      }
    }

    loadProduct();
    loadRelatedCatalog();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const pairing = useMemo(
    () => getPairingFromProduct(product) ?? fallbackPairing,
    [fallbackPairing, product]
  );

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
