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

export const RKICKS_API_BASE = 'https://api.rdecants.com/api/rkicks';

export type ApiProduct = Record<string, unknown> & {
  id?: string | number | null;
  slug?: string | null;
  brand?: string | null;
  category?: string | null;
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
  photoUrl?: string | null;
  primaryPhotoUrl?: string | null;
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

export async function fetchLiveCatalog(): Promise<Product[]> {
  const data = await fetchRuntimeJson<ApiProduct[]>('/api/rkicks/catalog.php', '/catalog');
  if (!Array.isArray(data)) throw new Error('RKicks API catalog response was not an array');
  return data.map(mapApiProduct).filter((product): product is Product => Boolean(product));
}

export async function fetchLiveProductBySlug(slug: string): Promise<Product | null> {
  const encodedSlug = encodeURIComponent(slug);
  const data = await fetchRuntimeJson<ApiProduct>(
    `/api/rkicks/product.php?slug=${encodedSlug}`,
    `/products/${encodedSlug}`
  );
  return mapApiProduct(data);
}

export function getPairingFromProduct(product: Product): Pairing | null {
  if (!product.pairing) return null;

  return {
    sneakerSlug: product.slug,
    fragranceName: product.pairing,
    fragranceSlug: product.pairing,
    rationale: product.notes ?? 'Seleccionado por RKicks para completar el fit.',
  };
}

export function mapApiProduct(apiProduct: ApiProduct): Product | null {
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

async function fetchRuntimeJson<T>(sameOriginPath: string, apiPath: string): Promise<T> {
  try {
    return await fetchJsonUrl<T>(cacheBust(sameOriginPath));
  } catch {
    return fetchJsonUrl<T>(cacheBust(`${RKICKS_API_BASE}${apiPath}`));
  }
}

function cacheBust(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_=${Date.now()}`;
}

async function fetchJsonUrl<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`RKicks API request failed with ${response.status}`);
    }

    return response.json() as Promise<T>;
  } finally {
    window.clearTimeout(timeout);
  }
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
        photos: getStringArray(item.photos).map(resolveApiAssetUrl),
      };
    });
  }

  if (conditionReport?.flaw_notes) {
    return [{
      id: 1,
      location: 'Condicion general',
      severity: mapFlawLevel(conditionReport.flaw_level),
      description: conditionReport.flaw_notes,
      photos: getStringArray(conditionReport.flaw_photos).map(resolveApiAssetUrl),
    }];
  }

  return [];
}

function getPhotoUrls(apiProduct: ApiProduct): string[] {
  const photos: Photo[] = [];
  const primaryPhotoUrl = cleanUrl(apiProduct.primary_photo_url ?? apiProduct.primaryPhotoUrl);
  const photoUrl = cleanUrl(apiProduct.photo_url ?? apiProduct.photoUrl);

  if (primaryPhotoUrl) {
    photos.push({
      url: primaryPhotoUrl,
      type: 'editorial',
      alt: stringOr(apiProduct.model, 'Sneaker RKicks'),
    });
  }

  if (photoUrl && photoUrl !== primaryPhotoUrl) {
    photos.push({
      url: photoUrl,
      type: 'condition',
      alt: stringOr(apiProduct.model, 'Sneaker RKicks'),
    });
  }

  if (Array.isArray(apiProduct.photos)) {
    apiProduct.photos.forEach((photo, index) => {
      if (typeof photo === 'string') {
        const url = cleanUrl(photo);
        if (url) {
          photos.push({ url, type: index === 0 ? 'editorial' : 'condition', alt: stringOr(apiProduct.model, 'Sneaker RKicks') });
        }
        return;
      }

      if (!isRecord(photo)) return;
      const url = cleanUrl(photo.url ?? photo.photo_url ?? photo.primary_photo_url ?? photo.src);
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

function cleanUrl(value: unknown): string {
  return resolveApiAssetUrl(stringOr(value, '').trim());
}

function resolveApiAssetUrl(value: string): string {
  if (!value) return '';
  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) return value;
  const apiOrigin = new URL(RKICKS_API_BASE).origin;
  return new URL(value.startsWith('/') ? value : `/${value}`, apiOrigin).toString();
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
