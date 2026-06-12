import type { Metadata } from 'next';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import ProductRuntimeClient from './ProductRuntimeClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, ' ')} - RKicks`,
    description: 'Producto RKicks cargado desde el catalogo en vivo. Real Condition Guarantee.',
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  return (
    <>
      <Nav />
      <ProductRuntimeClient slug={slug} />
      <Footer />
    </>
  );
}
