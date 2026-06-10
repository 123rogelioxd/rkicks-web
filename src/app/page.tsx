import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import RCGStamp from '@/components/rcg/RCGStamp';
import CompleteTheFit from '@/components/ecosystem/CompleteTheFit';
import { WhatsAppSection } from '@/components/whatsapp/WhatsAppCTA';
import Eyebrow from '@/components/ui/Eyebrow';
import { getRecentAvailable, getFeaturedPairing, getAvailableProducts, getMinAvailablePrice } from '@/utils/data';
import { formatPrice } from '@/utils/currency';
import styles from './page.module.css';

export default function HomePage() {
  const recentPairs     = getRecentAvailable(3);
  const featuredPair    = getFeaturedPairing();
  const availableCount  = getAvailableProducts().length;
  const minPrice        = getMinAvailablePrice();

  return (
    <>
      <Nav />

      {/* ── INK ZONE: Hero ─────────────────────────────── */}
      <div className={styles.heroZone}>
        <div className={styles.hero}>
          <div className={styles.heroBg} aria-hidden="true" />

          <div className={styles.heroContent}>
            {/* Eyebrow — what RKicks is, in 4 words */}
            <p className={styles.heroEyebrow}>
              Boutique de sneakers premium · México
            </p>

            {/* Headline — brand claim, Cormorant italic, once per section */}
            <h1 className={styles.heroHeadline}>
              Curado por gente que sabe.
            </h1>

            {/* Descriptor — 5-second value prop */}
            <p className={styles.heroDescriptor}>
              Cada par seleccionado, verificado y documentado.
              Condición honesta. Sin sorpresas. Todo se cierra en WhatsApp.
            </p>

            {/* Stats strip — live inventory + price floor + trust */}
            <div className={styles.heroStats} aria-label="Inventario actual">
              <span className={styles.heroStat}>
                <span className={styles.heroStatDot} aria-hidden="true" />
                {availableCount} disponibles ahora
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

            {/* CTA row */}
            <div className={styles.heroCTARow}>
              <Link href="/catalogo" className={styles.heroCTA}>
                Ver {availableCount} pares →
              </Link>
              <Link href="/real-condition" className={styles.heroSecondaryLink}>
                Qué es Real Condition
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── BONE ZONE: Available Now ────────────────────── */}
      <main className="rk-zone-bone">
        <section className={styles.availableSection}>
          <div className="rk-page">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <Eyebrow>Disponible ahora</Eyebrow>
                <h2 className={styles.sectionH}>Pares disponibles</h2>
              </div>
              <Link href="/catalogo" className={styles.sectionLink}>
                Ver catálogo →
              </Link>
            </div>

            <div className={styles.compactGrid}>
              {recentPairs.map((product) => (
                <ProductCard key={product.id} product={product} variant="compact" />
              ))}
            </div>
          </div>
        </section>

        {/* ── RCG Teaser ── */}
        <section className={styles.rcgSection}>
          <div className="rk-page">
            <div className={styles.rcgInner}>
              <div className={styles.rcgLeft}>
                <Eyebrow>Real Condition Guarantee</Eyebrow>
                <h2 className={styles.rcgHeadline}>
                  Lo que ves es lo que llega.
                </h2>
                <p className={styles.rcgBody}>
                  Cada par es fotografiado con luz honesta. Cada defecto está documentado,
                  numerado y descrito en lenguaje simple. Si algo no coincide con lo que
                  publicamos, te devolvemos tu dinero.
                </p>
                <Link href="/real-condition" className={styles.rcgLink}>
                  Conocer el programa →
                </Link>
              </div>
              <div className={styles.rcgRight}>
                <RCGStamp />
              </div>
            </div>
          </div>
        </section>

        {/* ── Complete The Fit ── */}
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
      </main>

      {/* ── INK ZONE: WhatsApp CTA section ─────────────── */}
      <WhatsAppSection />

      <Footer />
    </>
  );
}
