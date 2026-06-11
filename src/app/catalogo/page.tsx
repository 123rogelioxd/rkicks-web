import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import CatalogClient from '@/components/catalog/CatalogClient';
import { getAllProducts, getUniqueBrands, getUniqueSizes } from '@/utils/data';
import styles from './page.module.css';

export const metadata = {
  title: 'Catálogo',
  description: 'Todos los pares disponibles en RKicks. Verificados, documentados, con precio honesto.',
};

export default async function CatalogPage() {
  const products = await getAllProducts();
  const brands = await getUniqueBrands();
  const sizes = await getUniqueSizes();

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className="rk-page">
          <CatalogClient
            products={products}
            brands={brands}
            sizes={sizes}
            initialQuery=""
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
