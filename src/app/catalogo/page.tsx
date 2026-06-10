import { Suspense } from 'react';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import CatalogClient from '@/components/catalog/CatalogClient';
import { getAllProducts, getUniqueBrands, getUniqueSizes } from '@/utils/data';
import styles from './page.module.css';

export const metadata = {
  title: 'Catálogo',
  description: 'Todos los pares disponibles en RKicks. Verificados, documentados, con precio honesto.',
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params   = await searchParams;
  const products = getAllProducts();
  const brands   = getUniqueBrands();
  const sizes    = getUniqueSizes();

  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className="rk-page">
          <Suspense>
            <CatalogClient
              products={products}
              brands={brands}
              sizes={sizes}
              initialQuery={params.q ?? ''}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
