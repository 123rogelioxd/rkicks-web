import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Nosotros - RKicks',
  description: 'Conoce RKicks: sneakers originales, encargos y verificacion de autenticidad.',
};

const proof = [
  'Venta de sneakers originales seleccionados por el equipo RKicks.',
  'Encargos nacionales e internacionales bajo pedido.',
  'Revision fisica de autenticidad, talla, caja y condicion antes de publicar.',
  'Atencion directa por WhatsApp para confirmar disponibilidad, pago y entrega.',
];

export default function NosotrosPage() {
  return (
    <>
      <Nav />
      <main className={`rk-zone-bone ${styles.page}`}>
        <section className={`rk-page ${styles.hero}`}>
          <p className={styles.eyebrow}>About RKicks</p>
          <h1 className={styles.title}>Sneakers originales, curados y verificados en Mexico.</h1>
          <p className={styles.lede}>
            RKicks es la division de R Supply enfocada en pares originales listos para compra
            y encargos especiales. Trabajamos con inventario seleccionado, fotos reales y una
            compra coordinada directamente por WhatsApp.
          </p>
          <div className={styles.actions}>
            <a href="https://wa.me/529516513018" className={styles.primary} target="_blank" rel="noopener noreferrer">
              Contactar por WhatsApp
            </a>
            <Link href="/catalogo" className={styles.secondary}>
              Ver catalogo
            </Link>
          </div>
        </section>

        <section className={`rk-page ${styles.content}`}>
          <div className={styles.panel}>
            <p className={styles.sectionLabel}>Que es RKicks</p>
            <p className={styles.body}>
              Un punto de compra para sneakers originales, con disponibilidad limitada y una
              seleccion pensada para clientes que quieren comprar con claridad: talla, estado,
              precio, fotos y pasos de compra antes de cerrar.
            </p>
          </div>

          <div className={styles.grid}>
            {proof.map((item) => (
              <div className={styles.proof} key={item}>
                <span className={styles.check}>✓</span>
                <p>{item}</p>
              </div>
            ))}
          </div>

          <div className={styles.details}>
            <div>
              <p className={styles.sectionLabel}>Ubicacion general</p>
              <p className={styles.body}>Operamos desde Oaxaca, Mexico, con entregas y envios coordinados por WhatsApp.</p>
            </div>
            <div>
              <p className={styles.sectionLabel}>Contacto</p>
              <p className={styles.body}>WhatsApp: +52 951 651 3018 · Instagram: @rsupply.kicks</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
