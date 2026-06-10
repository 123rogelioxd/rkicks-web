import type { Product, Pairing } from '@/types/product';
import productsData from '../../data/sneakers.json';
import pairingsData from '../../data/pairings.json';

const products = productsData as Product[];
const pairings = pairingsData as Pairing[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | null {
  return products.find((p) => p.slug === slug) ?? null;
}

export function getAvailableProducts(): Product[] {
  return products.filter((p) => p.status === 'available');
}

export function getRecentAvailable(count = 3): Product[] {
  return products
    .filter((p) => p.status === 'available')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}

export function getFeaturedProduct(): Product | null {
  return products.find((p) => p.status === 'available') ?? null;
}

export function getPairingForSneaker(slug: string): Pairing | null {
  return pairings.find((p) => p.sneakerSlug === slug) ?? null;
}

export function getFeaturedPairing(): (Pairing & { product: Product }) | null {
  for (const pairing of pairings) {
    const product = products.find((p) => p.slug === pairing.sneakerSlug && p.status === 'available');
    if (product) return { ...pairing, product };
  }
  return null;
}

export function getAllPairings(): Pairing[] {
  return pairings;
}

export function getUniqueBrands(): string[] {
  return [...new Set(products.map((p) => p.brand))].sort();
}

export function getUniqueSizes(): number[] {
  return [...new Set(products.map((p) => p.size.us))].sort((a, b) => a - b);
}

export function getMinAvailablePrice(): number | null {
  const available = products.filter((p) => p.status === 'available');
  if (available.length === 0) return null;
  return Math.min(...available.map((p) => p.price));
}
