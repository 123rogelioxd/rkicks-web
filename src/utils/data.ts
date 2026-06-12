import type { Pairing, Product } from '@/types/product';
import pairingsData from '../../data/pairings.json';
import { fetchPublicCatalog, getPairingFromProduct } from './api-products';

const fallbackPairings = pairingsData as Pairing[];

export function getFallbackPairings(): Pairing[] {
  return fallbackPairings;
}

export function getFallbackPairingForSneaker(slug: string): Pairing | null {
  return fallbackPairings.find((pairing) => pairing.sneakerSlug === slug) ?? null;
}

export async function getAllProducts(): Promise<Product[]> {
  return fetchPublicCatalog();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getAvailableProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((product) => product.status === 'available');
}

export async function getRecentAvailable(count = 3): Promise<Product[]> {
  const products = await getAllProducts();
  return products
    .filter((product) => product.status === 'available')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}

export async function getFeaturedProduct(): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((product) => product.status === 'available') ?? null;
}

export async function getPairingForSneaker(slug: string): Promise<Pairing | null> {
  const products = await getAllProducts();
  const apiPairing = products
    .map((product) => product.pairing ? getPairingFromProduct(product) : null)
    .find((pairing) => pairing?.sneakerSlug === slug);

  if (apiPairing) return apiPairing;
  return getFallbackPairingForSneaker(slug);
}

export async function getFeaturedPairing(): Promise<(Pairing & { product: Product }) | null> {
  const pairings = await getAllPairings();
  const products = await getAllProducts();

  for (const pairing of pairings) {
    const product = products.find((p) => p.slug === pairing.sneakerSlug && p.status === 'available');
    if (product) return { ...pairing, product };
  }

  return null;
}

export async function getAllPairings(): Promise<Pairing[]> {
  const products = await getAllProducts();
  const apiPairings = products
    .map(getPairingFromProduct)
    .filter((pairing): pairing is Pairing => Boolean(pairing));

  return apiPairings.length > 0 ? apiPairings : fallbackPairings;
}

export async function getUniqueBrands(): Promise<string[]> {
  const products = await getAllProducts();
  return [...new Set(products.map((product) => product.brand))].sort();
}

export async function getUniqueSizes(): Promise<number[]> {
  const products = await getAllProducts();
  return [...new Set(products.map((product) => product.size.us))].sort((a, b) => a - b);
}

export async function getMinAvailablePrice(): Promise<number | null> {
  const available = await getAvailableProducts();
  if (available.length === 0) return null;
  return Math.min(...available.map((product) => product.price));
}
