import type { Pairing, Product } from '@/types/product';
import productsData from '../../data/sneakers.json';
import pairingsData from '../../data/pairings.json';
import { getPairingFromProduct } from './api-products';

const fallbackProducts = productsData as Product[];
const fallbackPairings = pairingsData as Pairing[];

export function getFallbackProducts(): Product[] {
  return fallbackProducts;
}

export function getFallbackProductBySlug(slug: string): Product | null {
  return fallbackProducts.find((product) => product.slug === slug) ?? null;
}

export function getFallbackPairings(): Pairing[] {
  return fallbackPairings;
}

export function getFallbackPairingForSneaker(slug: string): Pairing | null {
  return fallbackPairings.find((pairing) => pairing.sneakerSlug === slug) ?? null;
}

export async function getAllProducts(): Promise<Product[]> {
  return getFallbackProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return getFallbackProductBySlug(slug);
}

export async function getAvailableProducts(): Promise<Product[]> {
  return fallbackProducts.filter((product) => product.status === 'available');
}

export async function getRecentAvailable(count = 3): Promise<Product[]> {
  return fallbackProducts
    .filter((product) => product.status === 'available')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}

export async function getFeaturedProduct(): Promise<Product | null> {
  return fallbackProducts.find((product) => product.status === 'available') ?? null;
}

export async function getPairingForSneaker(slug: string): Promise<Pairing | null> {
  const apiPairing = fallbackProducts
    .map((product) => product.pairing ? getPairingFromProduct(product) : null)
    .find((pairing) => pairing?.sneakerSlug === slug);

  if (apiPairing) return apiPairing;
  return getFallbackPairingForSneaker(slug);
}

export async function getFeaturedPairing(): Promise<(Pairing & { product: Product }) | null> {
  const pairings = await getAllPairings();

  for (const pairing of pairings) {
    const product = fallbackProducts.find((p) => p.slug === pairing.sneakerSlug && p.status === 'available');
    if (product) return { ...pairing, product };
  }

  return null;
}

export async function getAllPairings(): Promise<Pairing[]> {
  const apiPairings = fallbackProducts
    .map(getPairingFromProduct)
    .filter((pairing): pairing is Pairing => Boolean(pairing));

  return apiPairings.length > 0 ? apiPairings : fallbackPairings;
}

export async function getUniqueBrands(): Promise<string[]> {
  return [...new Set(fallbackProducts.map((product) => product.brand))].sort();
}

export async function getUniqueSizes(): Promise<number[]> {
  return [...new Set(fallbackProducts.map((product) => product.size.us))].sort((a, b) => a - b);
}

export async function getMinAvailablePrice(): Promise<number | null> {
  const available = fallbackProducts.filter((product) => product.status === 'available');
  if (available.length === 0) return null;
  return Math.min(...available.map((product) => product.price));
}
