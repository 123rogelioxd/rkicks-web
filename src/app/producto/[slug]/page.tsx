import type { Metadata } from 'next';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { fetchCatalogSlugs } from '@/utils/api-products';
import ProductRuntimeClient from './ProductRuntimeClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, ' ')} - RKicks`,
    description: 'Producto RKicks cargado desde el catalogo en vivo. Real Condition Guarantee.',
  };
}

export async function generateStaticParams() {
  const slugs = await fetchCatalogSlugs();
  return slugs.map((slug) => ({ slug }));
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
