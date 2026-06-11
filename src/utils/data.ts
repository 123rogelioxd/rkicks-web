import type {
  BoxStatus,
  ConditionGrade,
  Flaw,
  FlawLevel,
  Pairing,
  Photo,
  PhotoType,
  Product,
  ProductStatus,
} from '@/types/product';
import { get } from 'node:https';
import productsData from '../../data/sneakers.json';
import pairingsData from '../../data/pairings.json';

const API_BASE = 'https://api.rdecants.com/api/rkicks';

const fallbackProducts = productsData as Product[];
const fallbackPairings = pairingsData as Pairing[];

type ApiProduct = Record<string, unknown> & {
  id?: string | number | null;
  slug?: string | null;
  brand?: string | null;
  model?: string | null;
  colorway?: string | null;
  release_year?: string | number | null;
  size_us?: string | number | null;
  size_mx?: string | number | null;
  size_eu?: string | number | null;
  size_cm?: string | number | null;
  price?: string | number | null;
  condition?: string | null;
  flaw_level?: string | null;
  flaws?: unknown;
  box_status?: string | null;
  availability?: string | null;
  photo_url?: string | null;
  primary_photo_url?: string | null;
  photos?: unknown;
  created_at?: string | null;
  updated_at?: string | null;
  notes?: string | null;
  condition_report?: {
    condition_grade?: string | null;
    condition_description?: string | null;
    flaw_level?: string | null;
    flaw_notes?: string | null;
    flaw_photos?: unknown;
    box_status?: string | null;
    verified_at?: string | null;
  } | null;
  complete_the_fit?: unknown;
};

let catalogPromise: Promise<Product[]> | null = null;
const productPromises = new Map<string, Promise<Product | null>>();

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await requestJson<T>(url, path);
    } catch (error) {
      if (attempt === 3) throw error;
      await wait(500 * attempt);
    }
  }

  throw new Error(`RKicks API ${path} failed`);
}

function requestJson<T>(url: string, path: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const req = get(url, { family: 4, headers: { Accept: 'application/json' }, timeout: 15000 }, (res) => {
      const chunks: Buffer[] = [];

      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');

        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`RKicks API ${path} failed with ${res.statusCode}`));
          return;
        }

        try {
          resolve(JSON.parse(body) as T);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('timeout', () => {
      req.destroy(new Error(`RKicks API ${path} timed out`));
    });
    req.on('error', reject);
  });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getApiCatalog(): Promise<Product[]> {
  try {
    const data = await fetchJson<ApiProduct[]>('/catalog');
    if (!Array.isArray(data)) throw new Error('RKicks API catalog response was not an array');
    return data.map(mapApiProduct).filter((product): product is Product => Boolean(product));
  } catch (error) {
    console.warn('Using local RKicks mock data because the production API could not be loaded.', error);
    return fallbackProducts;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  catalogPromise ??= getApiCatalog();
  return catalogPromise;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!productPromises.has(slug)) {
    productPromises.set(slug, getApiProductBySlug(slug));
  }

  return productPromises.get(slug) ?? null;
}

async function getApiProductBySlug(slug: string): Promise<Product | null> {
  const catalogProduct = (await getAllProducts()).find((p) => p.slug === slug) ?? null;

  try {
    const data = await fetchJson<ApiProduct>(`/products/${encodeURIComponent(slug)}`);
    return mapApiProduct(data) ?? catalogProduct;
  } catch (error) {
    if (catalogProduct) return catalogProduct;
    console.warn(`Using local RKicks mock data for ${slug} because the production API could not be loaded.`, error);
    return fallbackProducts.find((p) => p.slug === slug) ?? null;
  }
}

export async function getAvailableProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.status === 'available');
}

export async function getRecentAvailable(count = 3): Promise<Product[]> {
  const products = await getAllProducts();
  return products
    .filter((p) => p.status === 'available')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}

export async function getFeaturedProduct(): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((p) => p.status === 'available') ?? null;
}

export async function getPairingForSneaker(slug: string): Promise<Pairing | null> {
  const products = await getAllProducts();
  const apiPairing = products
    .map((product) => product.pairing ? getPairingFromProduct(product) : null)
    .find((pairing) => pairing?.sneakerSlug === slug);

  if (apiPairing) return apiPairing;

  const pairings = fallbackPairings;
  return pairings.find((p) => p.sneakerSlug === slug) ?? null;
}

export async function getFeaturedPairing(): Promise<(Pairing & { product: Product }) | null> {
  const products = await getAllProducts();
  const pairings = await getAllPairings();

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
  return [...new Set(products.map((p) => p.brand))].sort();
}

export async function getUniqueSizes(): Promise<number[]> {
  const products = await getAllProducts();
  return [...new Set(products.map((p) => p.size.us))].sort((a, b) => a - b);
}

export async function getMinAvailablePrice(): Promise<number | null> {
  const products = await getAllProducts();
  const available = products.filter((p) => p.status === 'available');
  if (available.length === 0) return null;
  return Math.min(...available.map((p) => p.price));
}

function mapApiProduct(apiProduct: ApiProduct): Product | null {
  if (!apiProduct.slug) return null;

  const brand = stringOr(apiProduct.brand, 'RKicks');
  const model = stringOr(apiProduct.model, 'Sneaker premium');
  const conditionReport = apiProduct.condition_report;
  const photoUrls = getPhotoUrls(apiProduct);
  const subtitle = getSubtitle(apiProduct);

  return {
    id: formatProductId(apiProduct.id),
    slug: apiProduct.slug,
    brand,
    category: stringOr(apiProduct.category, model),
    model,
    subtitle,
    size: {
      us: numberOr(apiProduct.size_us, 0),
      eur: numberOr(apiProduct.size_eu, estimateEurFromUs(apiProduct.size_us)),
      cm: numberOr(apiProduct.size_cm, numberOr(apiProduct.size_mx, 0)),
    },
    price: numberOr(apiProduct.price, 0),
    status: mapStatus(apiProduct.availability),
    condition: mapCondition(conditionReport?.condition_grade ?? apiProduct.condition),
    flawLevel: mapFlawLevel(conditionReport?.flaw_level ?? apiProduct.flaw_level),
    flaws: mapFlaws(apiProduct.flaws, conditionReport),
    box: mapBox(conditionReport?.box_status ?? apiProduct.box_status),
    photos: photoUrls.length > 0
      ? photoUrls.map((url, index) => ({
          url,
          type: index === 0 ? 'editorial' : 'condition',
          alt: `${brand} ${model}${subtitle ? ` ${subtitle}` : ''}`,
        }))
      : [{
          url: '',
          type: 'editorial',
          alt: `${brand} ${model}${subtitle ? ` ${subtitle}` : ''}`,
        }],
    pairing: getApiPairingSlug(apiProduct),
    createdAt: stringOr(apiProduct.created_at ?? apiProduct.updated_at ?? conditionReport?.verified_at, '1970-01-01T00:00:00.000Z'),
    notes: apiProduct.notes ?? conditionReport?.condition_description ?? undefined,
  };
}

function mapStatus(status: unknown): ProductStatus {
  const normalized = normalize(status);
  if (normalized === 'reserved') return 'reserved';
  if (normalized === 'sold') return 'sold';
  if (normalized === 'pre_order' || normalized === 'preorder' || normalized === 'pre-order') return 'pre-order';
  return 'available';
}

function mapCondition(condition: unknown): ConditionGrade {
  const normalized = normalize(condition);
  if (normalized === 'like_new' || normalized === 'like-new') return 'like-new';
  if (normalized === 'excellent') return 'excellent';
  if (normalized === 'good') return 'good';
  if (normalized === 'fair') return 'fair';
  return 'new';
}

function mapFlawLevel(level: unknown): FlawLevel {
  const normalized = normalize(level);
  if (normalized === 'minor') return 'minor';
  if (normalized === 'visible') return 'visible';
  if (normalized === 'heavy') return 'heavy';
  return 'none';
}

function mapBox(box: unknown): BoxStatus {
  const normalized = normalize(box);
  if (normalized.includes('replacement')) return 'replacement';
  if (normalized === 'none' || normalized === 'no_box' || normalized === 'without_box') return 'none';
  return 'original';
}

function mapPhotoType(type: unknown, fallback: PhotoType): PhotoType {
  const normalized = normalize(type);
  if (normalized === 'condition') return 'condition';
  if (normalized === 'detail') return 'detail';
  if (normalized === 'lifestyle') return 'lifestyle';
  return fallback;
}

function mapFlaws(flaws: unknown, conditionReport: ApiProduct['condition_report']): Flaw[] {
  if (Array.isArray(flaws) && flaws.length > 0) {
    return flaws.map((flaw, index) => {
      const item = isRecord(flaw) ? flaw : {};
      return {
        id: numberOr(item.id, index + 1),
        location: stringOr(item.location, 'Condicion general'),
        severity: mapFlawLevel(item.severity ?? item.flaw_level ?? conditionReport?.flaw_level),
        description: stringOr(item.description ?? item.notes, conditionReport?.flaw_notes ?? 'Detalle documentado por RKicks.'),
        photos: getStringArray(item.photos),
      };
    });
  }

  if (conditionReport?.flaw_notes) {
    return [{
      id: 1,
      location: 'Condicion general',
      severity: mapFlawLevel(conditionReport.flaw_level),
      description: conditionReport.flaw_notes,
      photos: getStringArray(conditionReport.flaw_photos),
    }];
  }

  return [];
}

function getPhotoUrls(apiProduct: ApiProduct): string[] {
  const photos: Photo[] = [];

  if (apiProduct.primary_photo_url) {
    photos.push({
      url: apiProduct.primary_photo_url,
      type: 'editorial',
      alt: stringOr(apiProduct.model, 'Sneaker RKicks'),
    });
  }

  if (apiProduct.photo_url && apiProduct.photo_url !== apiProduct.primary_photo_url) {
    photos.push({
      url: apiProduct.photo_url,
      type: 'condition',
      alt: stringOr(apiProduct.model, 'Sneaker RKicks'),
    });
  }

  if (Array.isArray(apiProduct.photos)) {
    apiProduct.photos.forEach((photo, index) => {
      if (typeof photo === 'string') {
        photos.push({ url: photo, type: index === 0 ? 'editorial' : 'condition', alt: stringOr(apiProduct.model, 'Sneaker RKicks') });
        return;
      }

      if (!isRecord(photo)) return;
      const url = stringOr(photo.url ?? photo.photo_url ?? photo.src, '');
      if (!url) return;

      photos.push({
        url,
        type: mapPhotoType(photo.type, index === 0 ? 'editorial' : 'condition'),
        alt: stringOr(photo.alt, stringOr(apiProduct.model, 'Sneaker RKicks')),
      });
    });
  }

  return [...new Set(photos.map((photo) => photo.url).filter(Boolean))];
}

function getSubtitle(apiProduct: ApiProduct): string {
  const colorway = stringOr(apiProduct.colorway, '');
  const year = stringOr(apiProduct.release_year, '');
  return [colorway ? `"${colorway}"` : '', year].filter(Boolean).join(' ');
}

function getApiPairingSlug(apiProduct: ApiProduct): string | undefined {
  if (!Array.isArray(apiProduct.complete_the_fit)) return undefined;

  const first = apiProduct.complete_the_fit.find(isRecord);
  if (!first) return undefined;

  return stringOr(first.fragranceSlug ?? first.fragrance_slug ?? first.slug, '') || undefined;
}

function getPairingFromProduct(product: Product): Pairing | null {
  if (!product.pairing) return null;

  return {
    sneakerSlug: product.slug,
    fragranceName: product.pairing,
    fragranceSlug: product.pairing,
    rationale: product.notes ?? 'Seleccionado por RKicks para completar el fit.',
  };
}

function formatProductId(id: unknown): string {
  if (typeof id === 'number') return `RK-${String(id).padStart(4, '0')}`;
  const value = stringOr(id, '');
  return value ? (value.startsWith('RK-') ? value : `RK-${value}`) : 'RK-0000';
}

function estimateEurFromUs(sizeUs: unknown): number {
  const us = numberOr(sizeUs, 0);
  return us > 0 ? us + 33.5 : 0;
}

function normalize(value: unknown): string {
  return stringOr(value, '').trim().toLowerCase().replace(/\s+/g, '_');
}

function stringOr(value: unknown, fallback: string): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return fallback;
}

function numberOr(value: unknown, fallback: number): number {
  if (value === null || value === undefined || value === '') return fallback;
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function getStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
