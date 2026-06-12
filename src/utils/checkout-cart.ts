import type { Product, ProductVariant } from '@/types/product';
import { getVariantPrice, getVariantPrimarySizeLabel, variantSupportsQuantity } from './inventory';

export const RKICKS_CART_KEY = 'rkicks.checkout.cart.v1';

export interface CheckoutCartItem {
  productId: string;
  productSlug: string;
  productName: string;
  brand: string;
  variantId: string;
  selectedSizeLabel: string;
  price: number;
  image: string;
  productUrl: string;
  quantity: number;
  stockQuantity?: number;
  unavailable?: boolean;
}

export type AddToCartResult =
  | { ok: true; item: CheckoutCartItem; incremented: boolean }
  | { ok: false; reason: 'missing-variant' | 'unavailable' | 'duplicate' };

export function createCartItem(product: Product, variant: ProductVariant, origin = ''): CheckoutCartItem {
  const image = product.photos.find((photo) => photo.type === 'editorial')?.url ?? product.photos[0]?.url ?? '';
  const productUrl = `${origin}/producto?slug=${encodeURIComponent(product.slug)}`;

  return {
    productId: product.id,
    productSlug: product.slug,
    productName: product.model,
    brand: product.brand,
    variantId: variant.id,
    selectedSizeLabel: getVariantPrimarySizeLabel(product, variant),
    price: getVariantPrice(product, variant),
    image,
    productUrl,
    quantity: 1,
    stockQuantity: variant.stockQuantity,
  };
}

export function readCart(): CheckoutCartItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(RKICKS_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CheckoutCartItem[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(RKICKS_CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('rkicks-cart-updated'));
}

export function removeCartItem(productSlug: string, variantId: string): CheckoutCartItem[] {
  const next = readCart().filter(
    (item) => item.productSlug !== productSlug || item.variantId !== variantId
  );
  writeCart(next);
  return next;
}

export function updateCartItemQuantity(productSlug: string, variantId: string, quantity: number): CheckoutCartItem[] {
  const next = readCart().map((item) => {
    if (item.productSlug !== productSlug || item.variantId !== variantId) return item;
    const max = item.stockQuantity && item.stockQuantity > 1 ? item.stockQuantity : 1;
    return { ...item, quantity: Math.max(1, Math.min(max, quantity)) };
  });
  writeCart(next);
  return next;
}

export function addSelectedVariantToCart(product: Product, variant?: ProductVariant | null, origin = ''): AddToCartResult {
  if (!variant) return { ok: false, reason: 'missing-variant' };
  if (variant.status !== 'available') return { ok: false, reason: 'unavailable' };

  const cart = readCart();
  const existingIndex = cart.findIndex(
    (item) => item.productSlug === product.slug && item.variantId === variant.id
  );

  if (existingIndex >= 0) {
    if (!variantSupportsQuantity(variant)) return { ok: false, reason: 'duplicate' };

    const existing = cart[existingIndex];
    const max = variant.stockQuantity ?? 1;
    if (existing.quantity >= max) return { ok: false, reason: 'duplicate' };

    const updated = {
      ...existing,
      quantity: existing.quantity + 1,
      stockQuantity: variant.stockQuantity,
      price: getVariantPrice(product, variant),
      selectedSizeLabel: getVariantPrimarySizeLabel(product, variant),
    };
    cart[existingIndex] = updated;
    writeCart(cart);
    return { ok: true, item: updated, incremented: true };
  }

  const item = createCartItem(product, variant, origin);
  writeCart([...cart, item]);
  return { ok: true, item, incremented: false };
}

function isCartItem(item: unknown): item is CheckoutCartItem {
  if (typeof item !== 'object' || item === null) return false;
  const record = item as Record<string, unknown>;
  return [
    'productId',
    'productSlug',
    'productName',
    'brand',
    'variantId',
    'selectedSizeLabel',
    'productUrl',
  ].every((key) => typeof record[key] === 'string')
    && typeof record.price === 'number'
    && typeof record.quantity === 'number';
}
