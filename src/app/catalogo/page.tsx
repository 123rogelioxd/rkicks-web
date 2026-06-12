import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import CatalogClient from '@/components/catalog/CatalogClient';
import styles from './page.module.css';

export const metadata = {
  title: 'Catálogo',
  description: 'Todos los pares disponibles en RKicks. Verificados, documentados, con precio honesto.',
};

export default function CatalogPage() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className="rk-page">
          <CatalogClient initialQuery="" />
        </div>
      </main>
      <Footer />
    </>
  );
}
