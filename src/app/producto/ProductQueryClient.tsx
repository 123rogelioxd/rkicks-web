'use client';

import { useSearchParams } from 'next/navigation';
import ProductRuntimeClient from './[slug]/ProductRuntimeClient';
import EmptyState from '@/components/ui/EmptyState';
import styles from './[slug]/page.module.css';

export default function ProductQueryClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  if (!slug) {
    return (
      <main className={`rk-zone-bone ${styles.content}`}>
        <div className={`rk-page ${styles.inner}`}>
          <EmptyState
            heading="Producto no especificado."
            body="Vuelve al catalogo y elige un par disponible."
          />
        </div>
      </main>
    );
  }

  return <ProductRuntimeClient slug={slug} />;
}
