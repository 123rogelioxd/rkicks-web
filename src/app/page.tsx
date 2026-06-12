import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import RCGStamp from '@/components/rcg/RCGStamp';
import { WhatsAppSection } from '@/components/whatsapp/WhatsAppCTA';
import Eyebrow from '@/components/ui/Eyebrow';
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

          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>
              Boutique de sneakers premium - Mexico
            </p>

            <h1 className={styles.heroHeadline}>
              Curado por gente que sabe.
            </h1>

            <p className={styles.heroDescriptor}>
              Cada par seleccionado, verificado y documentado.
              Condicion honesta. Sin sorpresas. Todo se cierra en WhatsApp.
            </p>

            <HomeRuntimeClient />
          </div>
        </div>
      </div>

      <main className="rk-zone-bone">
        <HomeCatalogRuntimeClient />

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
