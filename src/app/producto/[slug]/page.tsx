import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import ProductRuntimeClient from './ProductRuntimeClient';
import { formatPrice } from '@/utils/currency';
import {
  getFallbackPairingForSneaker,
  getFallbackProductBySlug,
  getFallbackProducts,
} from '@/utils/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getFallbackProducts().map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getFallbackProductBySlug(slug);
  if (!product) return { title: 'Producto no encontrado - RKicks' };

  return {
    title: `${product.model} - US ${product.size.us} - ${formatPrice(product.price)} MXN - RKicks`,
    description: `${product.brand} ${product.model}. ${product.subtitle ?? ''} Condicion: ${product.condition}. Real Condition Guarantee.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getFallbackProductBySlug(slug);

  if (!product) notFound();

  return (
    <>
      <Nav />
      <ProductRuntimeClient
        slug={slug}
        fallbackProduct={product}
        fallbackPairing={getFallbackPairingForSneaker(slug)}
        fallbackProducts={getFallbackProducts()}
      />
      <Footer />
    </>
  );
}
