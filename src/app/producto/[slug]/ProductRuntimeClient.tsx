'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ProductGallery from '@/components/product/ProductGallery';
import ProductMeta from '@/components/product/ProductMeta';
import ProductQuickSummary from '@/components/product/ProductQuickSummary';
import WhyItWorks from '@/components/product/WhyItWorks';
import FlawMap from '@/components/rcg/FlawMap';
import RelatedProducts from '@/components/product/RelatedProducts';
import CompleteTheFit from '@/components/ecosystem/CompleteTheFit';
import { WhatsAppProductCTA } from '@/components/whatsapp/WhatsAppCTA';
import DemandCaptureWhatsApp from '@/components/catalog/DemandCaptureWhatsApp';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import type { Product, ProductVariant } from '@/types/product';
import {
  fetchLiveCatalog,
  fetchLiveProductBySlug,
  getPairingFromProduct,
  logRuntimeApi,
} from '@/utils/api-products';
import { trackEvent } from '@/utils/analytics';
import styles from './page.module.css';

interface Props {
  slug: string;
  initialProduct?: Product | null;
}

export default function ProductRuntimeClient({
  slug,
  initialProduct = null,
}: Props) {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    const availableVariants = initialProduct?.variants.filter((variant) => variant.status === 'available') ?? [];
    return availableVariants.length === 1 ? availableVariants[0] : null;
  });
  const [loading, setLoading] = useState(!initialProduct);
  const [productError, setProductError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setProductError(null);
      try {
        const liveProduct = await fetchLiveProductBySlug(slug);
        if (!liveProduct) throw new Error(`RKicks product ${slug} was not found in the live API`);
        if (!cancelled) {
          const availableVariants = liveProduct.variants.filter((variant) => variant.status === 'available');
          setProduct(liveProduct);
          setSelectedVariant(availableVariants.length === 1 ? availableVariants[0] : null);
          trackEvent('product_view', {
            product_id: liveProduct.id,
            product_slug: liveProduct.slug,
            product_name: liveProduct.model,
          });
        }
      } catch (error) {
        logRuntimeApi(`product load failed for ${slug}`, error);
        if (!cancelled && !initialProduct) {
          setProduct(null);
          setProductError('No pudimos cargar este producto en vivo.');
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
        logRuntimeApi('related-products load failed', error);
        if (!cancelled) setAllProducts([]);
      }
    }

    loadProduct();
    loadRelatedCatalog();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const pairing = useMemo(
    () => product ? getPairingFromProduct(product) : null,
    [product]
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
            <ProductMeta
              product={product}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
            />
            <ProductQuickSummary product={product} selectedVariant={selectedVariant} />
          </section>

          {product.status !== 'sold' && (
            <section className={styles.ctaSection}>
              <WhatsAppProductCTA product={product} selectedVariant={selectedVariant} />
              <p className={styles.ctaNote}>
                Apartas con el 50%. Coordinamos pago y entrega por WhatsApp.
              </p>
            </section>
          )}

          {product.status === 'sold' && (
            <section className={styles.soldSection}>
              <p className={styles.soldNote}>Este par ya fue vendido.</p>
              <Link href="/catalogo" className={styles.soldLink}>
                Ver pares similares -&gt;
              </Link>
              <div className={styles.demandCapture}>
                <DemandCaptureWhatsApp product={product} />
              </div>
            </section>
          )}

          {product.status === 'available' && (
            <div className={styles.demandCapture}>
              <DemandCaptureWhatsApp product={product} compact />
            </div>
          )}

          <section className={styles.whySection}>
            <WhyItWorks product={product} />
          </section>

          <section className={styles.trustSection}>
            <p className={styles.trustLine}>
              Fotos reales del par y Condición Verificada por RKicks. Si algo no
              coincide con lo que ves, te regresamos tu dinero.
            </p>
            <Link href="/real-condition" className={styles.trustLink}>
              Cómo revisamos cada par -&gt;
            </Link>
            {product.flaws.length > 0 && (
              <FlawMap flaws={product.flaws} flawLevel={product.flawLevel} />
            )}
          </section>

          {pairing && (
            <section className={styles.ctfSection}>
              <CompleteTheFit pairing={pairing} product={product} />
            </section>
          )}

          <RelatedProducts current={product} all={allProducts} />

          <div className={styles.mobileSpacer} aria-hidden="true" />
        </div>
      </main>
    </>
  );
}
