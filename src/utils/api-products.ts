import type {
  BoxStatus,
  ConditionGrade,
  Flaw,
  FlawLevel,
  Pairing,
  Photo,
  EvidencePhotoType,
  PhotoType,
  Product,
  ProductVariant,
  ProductStatus,
} from '@/types/product';

export const RKICKS_API_BASE = 'https://api.rdecants.com/api/rkicks';
const ENABLE_PRODUCTION_API_DEBUG = true;

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
  size?: string | number | null;
  price?: string | number | null;
  stock_quantity?: string | number | null;
  inventory_quantity?: string | number | null;
  quantity?: string | number | null;
  condition?: string | null;
  flaw_level?: string | null;
  flaws?: unknown;
  box_status?: string | null;
  availability?: string | null;
  available_sizes?: unknown;
  variants?: unknown;
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
  published?: boolean | null;
};

export async function fetchLiveCatalog(): Promise<Product[]> {
  const data = await fetchNoStoreJson<ApiProduct[]>(cacheBust(`${RKICKS_API_BASE}/catalog`));
  if (!Array.isArray(data)) throw new Error('RKicks API catalog response was not an array');
  return data
    .filter(isPublicAvailableApiProduct)
    .map(mapApiProduct)
    .filter((product): product is Product => Boolean(product));
}

export async function fetchPublicCatalog(): Promise<Product[]> {
  return fetchLiveCatalog();
}

export async function fetchCatalogSlugs(): Promise<string[]> {
  const data = await fetchNoStoreJson<ApiProduct[]>(cacheBust(`${RKICKS_API_BASE}/catalog`));
  if (!Array.isArray(data)) throw new Error('RKicks API catalog response was not an array');
  return data
    .filter(isPublicAvailableApiProduct)
    .map((product) => product.slug)
    .filter((slug): slug is string => Boolean(slug));
}

export async function fetchAdminCatalog(): Promise<Product[]> {
  const data = await fetchNoStoreJson<ApiProduct[]>(cacheBust(`${RKICKS_API_BASE}/catalog`));
  if (!Array.isArray(data)) throw new Error('RKicks API catalog response was not an array');
  return data
    .filter((product) => Boolean(product.slug))
    .map(mapApiProduct)
    .filter((product): product is Product => Boolean(product));
}

export async function fetchLiveProductBySlug(slug: string): Promise<Product | null> {
  const encodedSlug = encodeURIComponent(slug);
  const data = await fetchNoStoreJson<ApiProduct>(cacheBust(`${RKICKS_API_BASE}/products/${encodedSlug}`));
  if (!isPublicAvailableApiProduct(data)) return null;
  return mapApiProduct(data);
}

export async function fetchStaticProductBySlug(slug: string): Promise<Product | null> {
  const encodedSlug = encodeURIComponent(slug);
  try {
    const response = await fetch(`${RKICKS_API_BASE}/products/${encodedSlug}`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) return null;
    const data = await response.json() as ApiProduct;
    if (!isPublicAvailableApiProduct(data)) return null;
    return mapApiProduct(data);
  } catch (error) {
    logRuntimeApi(`static product fallback failed for ${slug}`, error);
    return null;
  }
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
  const variants = mapVariants(apiProduct);
  const price = getProductPrice(apiProduct, variants);

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
    price,
    status: getProductStatus(apiProduct, variants),
    variants,
    condition: mapCondition(conditionReport?.condition_grade ?? apiProduct.condition),
    flawLevel: mapFlawLevel(conditionReport?.flaw_level ?? apiProduct.flaw_level),
    flaws: mapFlaws(apiProduct.flaws, conditionReport),
    box: mapBox(conditionReport?.box_status ?? apiProduct.box_status),
    photos: photoUrls.length > 0
      ? photoUrls.map((photo, index) => ({
          ...photo,
          type: photo.type ?? (index === 0 ? 'editorial' : 'condition'),
          alt: photo.alt || `${brand} ${model}${subtitle ? ` ${subtitle}` : ''}`,
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

function cacheBust(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_=${Date.now()}`;
}

async function fetchNoStoreJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`RKicks API request failed with ${response.status}`);
    }

    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeout);
  }
}

export function logRuntimeApi(message: string, details?: unknown): void {
  if (!shouldLogRuntimeApi()) return;
  console.info(`[rkicks-runtime-api] ${message}`, details ?? '');
}

function shouldLogRuntimeApi(): boolean {
  return process.env.NODE_ENV !== 'production' || ENABLE_PRODUCTION_API_DEBUG;
}

function isPublicAvailableApiProduct(product: ApiProduct): boolean {
  return product.published !== false && productHasAvailableVariant(product) && Boolean(product.slug);
}

function productHasAvailableVariant(product: ApiProduct): boolean {
  const variants = mapVariants(product);
  if (variants.length > 0) {
    return variants.some((variant) => variant.status === 'available');
  }

  return mapStatus(product.availability) === 'available';
}

function getProductStatus(apiProduct: ApiProduct, variants: ProductVariant[]): ProductStatus {
  if (variants.some((variant) => variant.status === 'available')) return 'available';
  return variants[0]?.status ?? mapStatus(apiProduct.availability);
}

function getProductPrice(apiProduct: ApiProduct, variants: ProductVariant[]): number {
  const availablePrices = variants
    .filter((variant) => variant.status === 'available')
    .map((variant) => variant.salePrice)
    .filter((price): price is number => typeof price === 'number' && price > 0);

  return availablePrices[0] ?? numberOr(apiProduct.price, 0);
}

function mapVariants(apiProduct: ApiProduct): ProductVariant[] {
  if (Array.isArray(apiProduct.variants) && apiProduct.variants.length > 0) {
    return apiProduct.variants
      .map((variant, index) => mapVariantRecord(variant, index))
      .filter((variant): variant is ProductVariant => Boolean(variant));
  }

  const availableSizes = getStringArray(apiProduct.available_sizes);
  if (availableSizes.length > 0) {
    return availableSizes.map((sizeLabel, index) => ({
      id: `${formatProductId(apiProduct.id)}-size-${index + 1}`,
      sizeLabel,
      status: 'available',
      salePrice: numberOr(apiProduct.price, 0),
    }));
  }

  const legacySize = getLegacySizeLabel(apiProduct);
  if (!legacySize) return [];

  return [{
    id: `${formatProductId(apiProduct.id)}-legacy-size`,
    sizeLabel: legacySize,
    status: mapStatus(apiProduct.availability),
    salePrice: numberOr(apiProduct.price, 0),
  }];
}

function mapVariantRecord(variant: unknown, index: number): ProductVariant | null {
  if (!isRecord(variant)) return null;

  const sizeLabel = stringOr(variant.size_label ?? variant.sizeLabel ?? variant.size, '').trim();
  if (!sizeLabel) return null;
  const id = stringOr(variant.id, '').trim() || `variant-${index + 1}`;

  return {
    id,
    sizeLabel,
    status: mapStatus(variant.status ?? variant.availability),
    salePrice: numberOr(variant.sale_price ?? variant.salePrice ?? variant.price, 0),
    sizeMx: optionalSizeValue(variant.size_mx ?? variant.sizeMx ?? variant.mx),
    sizeUs: optionalSizeValue(variant.size_us ?? variant.sizeUs ?? variant.us),
    sizeEu: optionalSizeValue(variant.size_eu ?? variant.sizeEu ?? variant.eu ?? variant.eur),
    sizeCm: optionalSizeValue(variant.size_cm ?? variant.sizeCm ?? variant.cm),
    stockQuantity: optionalPositiveNumber(variant.stock_quantity ?? variant.stockQuantity ?? variant.inventory_quantity ?? variant.inventoryQuantity ?? variant.quantity),
  };
}

function getLegacySizeLabel(apiProduct: ApiProduct): string {
  const explicit = stringOr(apiProduct.size, '').trim();
  if (explicit) return explicit;

  const mx = stringOr(apiProduct.size_mx ?? apiProduct.size_cm, '').trim();
  if (mx) return `${mx} MX`;

  const us = stringOr(apiProduct.size_us, '').trim();
  return us ? `US ${us}` : '';
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
  if (isEvidencePhotoType(normalized)) {
    if (normalized === 'defect_closeup') return 'condition';
    if (normalized === 'receipt') return 'detail';
    return 'detail';
  }
  if (normalized === 'condition') return 'condition';
  if (normalized === 'detail') return 'detail';
  if (normalized === 'lifestyle') return 'lifestyle';
  return fallback;
}

function mapEvidencePhotoType(type: unknown, fallback?: EvidencePhotoType): EvidencePhotoType | undefined {
  const normalized = normalize(type);
  if (normalized === 'principal' || normalized === 'primary' || normalized === 'editorial') return fallback ?? 'front';
  if (normalized === 'left' || normalized === 'left_side' || normalized === 'lateral_left') return 'left_side';
  if (normalized === 'right' || normalized === 'right_side' || normalized === 'lateral_right') return 'right_side';
  if (normalized === 'back' || normalized === 'heel') return 'heel';
  if (normalized === 'sole' || normalized === 'outsole') return 'outsole';
  if (normalized === 'size' || normalized === 'size_tag' || normalized === 'label_size') return 'size_tag';
  if (normalized === 'box' || normalized === 'box_label') return 'box_label';
  if (normalized === 'top' || normalized === 'top_down' || normalized === 'topdown') return 'top_down';
  if (normalized === 'flaw' || normalized === 'defect' || normalized === 'defect_closeup') return 'defect_closeup';
  if (normalized === 'receipt' || normalized === 'proof' || normalized === 'proof_of_purchase') return 'receipt';
  return fallback;
}

function isEvidencePhotoType(value: string): value is EvidencePhotoType {
  return [
    'front',
    'left_side',
    'right_side',
    'heel',
    'outsole',
    'size_tag',
    'box_label',
    'top_down',
    'defect_closeup',
    'receipt',
  ].includes(value);
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

function getPhotoUrls(apiProduct: ApiProduct): Photo[] {
  const photos: Photo[] = [];
  const primaryPhotoUrl = cleanUrl(apiProduct.primary_photo_url ?? apiProduct.primaryPhotoUrl);
  const photoUrl = cleanUrl(apiProduct.photo_url ?? apiProduct.photoUrl);

  if (primaryPhotoUrl) {
    photos.push({
      url: primaryPhotoUrl,
      type: 'editorial',
      alt: stringOr(apiProduct.model, 'Sneaker RKicks'),
      evidenceType: 'front',
    });
  }

  if (photoUrl && photoUrl !== primaryPhotoUrl) {
    photos.push({
      url: photoUrl,
      type: 'condition',
      alt: stringOr(apiProduct.model, 'Sneaker RKicks'),
      evidenceType: 'top_down',
    });
  }

  if (Array.isArray(apiProduct.photos)) {
    apiProduct.photos.forEach((photo, index) => {
      if (typeof photo === 'string') {
        const url = cleanUrl(photo);
        if (url) {
        photos.push({
          url,
          type: index === 0 ? 'editorial' : 'condition',
          alt: stringOr(apiProduct.model, 'Sneaker RKicks'),
          evidenceType: mapEvidencePhotoType(undefined, index === 0 ? 'front' : undefined),
        });
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
        evidenceType: mapEvidencePhotoType(photo.evidence_type ?? photo.evidenceType ?? photo.photo_type ?? photo.type, index === 0 ? 'front' : undefined),
      });
    });
  }

  const seen = new Set<string>();
  return photos.filter((photo) => {
    if (!photo.url || seen.has(photo.url)) return false;
    seen.add(photo.url);
    return true;
  });
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

function optionalPositiveNumber(value: unknown): number | undefined {
  const numeric = numberOr(value, 0);
  return numeric > 0 ? numeric : undefined;
}

function optionalSizeValue(value: unknown): number | string | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return value.trim() || undefined;
  return undefined;
}

function getStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
