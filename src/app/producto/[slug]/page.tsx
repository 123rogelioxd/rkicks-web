import { notFound } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
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

import { formatPrice } from '@/utils/currency';
import type { Metadata } from 'next';
import styles from './page.module.css';


import { getProductBySlug, getPairingForSneaker, getAllProducts } from '@/utils/data';

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Producto no encontrado · RKicks' };
  return {
    title: `${product.model} · US ${product.size.us} · ${formatPrice(product.price)} MXN · RKicks`,
    description: `${product.brand} ${product.model}. ${product.subtitle ?? ''} Condición: ${product.condition}. Real Condition Guarantee.`,
  };
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product     = await getProductBySlug(slug);
  if (!product) notFound();

  const pairing     = await getPairingForSneaker(slug);
  const allProducts = await getAllProducts();

  return (
    <>
      <Nav />

      {/* ── INK ZONE: Gallery ── */}
      <div className={styles.galleryZone}>
        <ProductGallery
          photos={product.photos}
          brand={product.brand}
          model={product.model}
        />
      </div>

      {/* ── BONE ZONE: Product content ── */}
      <main className={`rk-zone-bone ${styles.content}`}>
        <div className={`rk-page ${styles.inner}`}>

          {/* Product meta */}
          <section className={styles.metaSection}>
            <ProductMeta product={product} />
          </section>

          {/* Real Condition section */}
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

          {/* Complete The Fit */}
          {pairing && (
            <section className={styles.ctfSection}>
              <CompleteTheFit pairing={pairing} product={product} />
            </section>
          )}

          {/* WhatsApp CTA — sticky on mobile, in-flow on desktop */}
          {product.status !== 'sold' && (
            <section className={styles.ctaSection}>
              <WhatsAppProductCTA product={product} />
            </section>
          )}

          {/* Sold state */}
          {product.status === 'sold' && (
            <section className={styles.soldSection}>
              <p className={styles.soldNote}>Este par ya fue vendido.</p>
              <Link href="/catalogo" className={styles.soldLink}>
                Ver pares similares →
              </Link>
            </section>
          )}

          {/* Related inventory */}
          <RelatedProducts current={product} all={allProducts} />

          {/* Spacer so sticky CTA doesn't cover last content on mobile */}
          <div className={styles.mobileSpacer} aria-hidden="true" />
        </div>
      </main>

      <Footer />
    </>
  );
}
