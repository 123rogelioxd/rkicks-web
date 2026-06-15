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
                Tenis premium · México
              </p>

              <h1 className={styles.heroHeadline}>
                Tenis originales. Estado real. Sin sorpresas.
              </h1>

              <p className={styles.heroDescriptor}>
                Fotografiamos cada par con su estado real y documentamos cada
                detalle. Apártalo por WhatsApp sin letra chica ni sorpresas.
              </p>

              <HomeRuntimeClient />
            </div>
          </div>
        </div>
      </div>

      <main className="rk-zone-bone">
        <HomeCatalogRuntimeClient />

        <section className={styles.howSection}>
          <div className="rk-page">
            <div className={styles.howHeader}>
              <Eyebrow>Cómo comprar</Eyebrow>
              <h2 className={styles.howH}>Comprar es así de simple</h2>
              <p className={styles.howIntro}>
                Cuatro pasos, sin fricción y con acompañamiento real por
                WhatsApp en cada uno.
              </p>
            </div>

            <ol className={styles.howGrid}>
              <li className={styles.howStep}>
                <span className={styles.howStepNum}>01</span>
                <h3 className={styles.howStepTitle}>Explora el inventario</h3>
                <p className={styles.howStepBody}>
                  Revisa los pares disponibles con fotos reales y su condición
                  documentada.
                </p>
              </li>
              <li className={styles.howStep}>
                <span className={styles.howStepNum}>02</span>
                <h3 className={styles.howStepTitle}>Escríbenos por WhatsApp</h3>
                <p className={styles.howStepBody}>
                  Confirmamos talla, estado y disponibilidad al momento, sin
                  compromiso.
                </p>
              </li>
              <li className={styles.howStep}>
                <span className={styles.howStepNum}>03</span>
                <h3 className={styles.howStepTitle}>Aparta con el 50%</h3>
                <p className={styles.howStepBody}>
                  Acordamos el método de pago y aseguras tu par con el 50%.
                </p>
              </li>
              <li className={styles.howStep}>
                <span className={styles.howStepNum}>04</span>
                <h3 className={styles.howStepTitle}>Recíbelo donde estés</h3>
                <p className={styles.howStepBody}>
                  Coordinamos el envío o la entrega por WhatsApp, hasta que tu
                  par llegue a ti.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <div className="rk-zone-bone">
          <RealDeliveries />
        </div>

        <section className={styles.rcgSection}>
          <div className="rk-page">
            <div className={styles.rcgInner}>
              <div className={styles.rcgLeft}>
                <Eyebrow>Condición Verificada</Eyebrow>
                <h2 className={styles.rcgHeadline}>
                  Lo que ves es lo que llega.
                </h2>
                <p className={styles.rcgBody}>
                  Cada par es original y se fotografía con luz honesta.
                  Documentamos su estado real: cada detalle, numerado y descrito
                  en palabras simples. Si algo no coincide con lo que publicamos,
                  te devolvemos tu dinero.
                </p>
                <Link href="/real-condition" className={styles.rcgLink}>
                  Conocer cómo verificamos -&gt;
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
