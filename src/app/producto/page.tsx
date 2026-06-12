import { Suspense } from 'react';
import type { Metadata } from 'next';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Skeleton from '@/components/ui/Skeleton';
import ProductQueryClient from './ProductQueryClient';
import styles from './[slug]/page.module.css';

export const metadata: Metadata = {
  title: 'Producto - RKicks',
  description: 'Producto RKicks cargado desde el catalogo en vivo. Real Condition Guarantee.',
};

export default function ProductQueryPage() {
  return (
    <>
      <Nav />
      <Suspense fallback={
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
      }>
        <ProductQueryClient />
      </Suspense>
      <Footer />
    </>
  );
}
