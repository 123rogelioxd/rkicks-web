import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import RCGStamp from '@/components/rcg/RCGStamp';
import { WhatsAppSection } from '@/components/whatsapp/WhatsAppCTA';
import Eyebrow from '@/components/ui/Eyebrow';
import RealDeliveries from '@/components/social/RealDeliveries';
import HomeCatalogRuntimeClient from './HomeCatalogRuntimeClient';
import HomeRuntimeClient from './HomeRuntimeClient';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <>
      <Nav />

      <div className={styles.heroZone}>
        <div className={styles.hero}>
          <div className={styles.heroBg} aria-hidden="true" />

          <div className={styles.heroInner}>
            <div
              className={styles.heroImage}
              aria-hidden="true"
              style={{ backgroundImage: "url('/images/hero/rkicks-hero-jordan.jpg')" }}
            />

            <div className={styles.heroContent}>
              <p className={styles.heroEyebrow}>
                Sneakers premium · México
              </p>

              <h1 className={styles.heroHeadline}>
                Selección privada de sneakers.
              </h1>

              <p className={styles.heroDescriptor}>
                Pares originales, verificados y listos para comprar por WhatsApp.
                Sin vueltas, sin sorpresas.
              </p>

              <HomeRuntimeClient />
            </div>
          </div>
        </div>

        <div className={styles.heroTrust}>
          <div className={styles.heroTrustInner}>
            <div className={styles.heroTrustItem}>
              <span className={styles.heroTrustTitle}>Foto del par exacto</span>
              <span className={styles.heroTrustBody}>Ves lo que vas a recibir.</span>
            </div>
            <div className={styles.heroTrustItem}>
              <span className={styles.heroTrustTitle}>Autenticidad revisada</span>
              <span className={styles.heroTrustBody}>Sin réplicas.</span>
            </div>
            <div className={styles.heroTrustItem}>
              <span className={styles.heroTrustTitle}>Garantía Real Condition</span>
              <span className={styles.heroTrustBody}>Si no coincide, te devolvemos tu dinero.</span>
            </div>
            <div className={styles.heroTrustItem}>
              <span className={styles.heroTrustTitle}>Compra asistida</span>
              <span className={styles.heroTrustBody}>Te ayudamos por WhatsApp.</span>
            </div>
          </div>
        </div>
      </div>

      <main className="rk-zone-bone">
        <HomeCatalogRuntimeClient />

        <div className="rk-zone-bone">
          <RealDeliveries />
        </div>

        <section className={styles.rcgSection}>
          <div className="rk-page">
            <div className={styles.rcgInner}>
              <div className={styles.rcgLeft}>
                <Eyebrow>Real Condition Guarantee</Eyebrow>
                <h2 className={styles.rcgHeadline}>
                  Lo que ves es lo que llega.
                </h2>
                <p className={styles.rcgBody}>
                  Cada par es fotografiado con luz honesta. Cada defecto esta documentado,
                  numerado y descrito en lenguaje simple. Si algo no coincide con lo que
                  publicamos, te devolvemos tu dinero.
                </p>
                <Link href="/real-condition" className={styles.rcgLink}>
                  Conocer el programa -&gt;
                </Link>
              </div>
              <div className={styles.rcgRight}>
                <RCGStamp />
              </div>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppSection />

      <Footer />
    </>
  );
}
