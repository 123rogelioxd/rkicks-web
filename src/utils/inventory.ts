import type { Product, ProductStatus, ConditionGrade, FlawLevel, ProductVariant } from '@/types/product';

export const conditionLabel: Record<ConditionGrade, string> = {
  'new':       'New',
  'like-new':  'Like New',
  'excellent': 'Excellent',
  'good':      'Good',
  'fair':      'Fair',
};

export const conditionLabelES: Record<ConditionGrade, string> = {
  'new':       'Nuevo',
  'like-new':  'Como Nuevo',
  'excellent': 'Excelente',
  'good':      'Bueno',
  'fair':      'Regular',
};

export const statusLabelES: Record<ProductStatus, string> = {
  'available': 'Disponible',
  'reserved':  'Reservado',
  'sold':      'Vendido',
  'pre-order': 'Pre-orden',
};

export const flawLevelLabelES: Record<FlawLevel, string> = {
  'none':    'Sin defectos',
  'minor':   'Defecto menor',
  'visible': 'Defecto visible',
  'heavy':   'Desgaste notable',
};

export function isAvailable(product: Product): boolean {
  return product.status === 'available';
}

export function isSold(product: Product): boolean {
  return product.status === 'sold';
}

export function getAvailableProducts(products: Product[]): Product[] {
  return products.filter((p) => p.status !== 'sold');
}

export function getAvailableVariants(product: Product): ProductVariant[] {
  return product.variants.filter((variant) => variant.status === 'available');
}

export function getAvailableSizeLabels(product: Product): string[] {
  return getAvailableVariants(product).map((variant) => variant.sizeLabel);
}

export function getVariantPrice(product: Product, variant?: ProductVariant | null): number {
  return variant?.salePrice && variant.salePrice > 0 ? variant.salePrice : product.price;
}

export function getVariantStatus(product: Product, variant?: ProductVariant | null): ProductStatus {
  return variant?.status ?? product.status;
}

export function formatLegacyProductSize(product: Product): string {
  const parts = [
    product.size.us > 0 ? `US ${formatSizeNumber(product.size.us)}` : '',
    product.size.eur > 0 ? `EUR ${formatSizeNumber(product.size.eur)}` : '',
    product.size.cm > 0 ? `${formatSizeNumber(product.size.cm)} cm` : '',
  ].filter(Boolean);

  return parts.join(' · ') || 'Talla por confirmar';
}

export function getVariantPrimarySizeLabel(product: Product, variant?: ProductVariant | null): string {
  if (!variant) return formatLegacyProductSize(product);
  return normalizeSizeLabel(variant.sizeLabel) || buildVariantSizeLabel(variant) || formatLegacyProductSize(product);
}

export function getVariantDetailSizeLabel(product: Product, variant?: ProductVariant | null): string {
  if (!variant) return formatLegacyProductSize(product);

  const details = [
    variant.sizeUs ? `US ${formatSizeValue(variant.sizeUs)}` : '',
    variant.sizeEu ? `EUR ${formatSizeValue(variant.sizeEu)}` : '',
    variant.sizeCm ? `${formatSizeValue(variant.sizeCm)} cm` : '',
  ].filter(Boolean);

  if (details.length > 0) return details.join(' · ');
  return getVariantPrimarySizeLabel(product, variant);
}

export function variantSupportsQuantity(variant?: ProductVariant | null): boolean {
  return typeof variant?.stockQuantity === 'number' && variant.stockQuantity > 1;
}

function buildVariantSizeLabel(variant: ProductVariant): string {
  if (variant.sizeMx) return `${formatSizeValue(variant.sizeMx)} MX`;
  if (variant.sizeUs) return `US ${formatSizeValue(variant.sizeUs)}`;
  if (variant.sizeEu) return `EUR ${formatSizeValue(variant.sizeEu)}`;
  if (variant.sizeCm) return `${formatSizeValue(variant.sizeCm)} cm`;
  return '';
}

function normalizeSizeLabel(label: string): string {
  return label.trim().replace(/\s+/g, ' ');
}

function formatSizeValue(value: number | string): string {
  return typeof value === 'number' ? formatSizeNumber(value) : value.trim();
}

function formatSizeNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(value).replace(/\.0$/, '');
}

export function sortProducts(
  products: Product[],
  sort: 'recent' | 'price-asc' | 'price-desc' | 'condition'
): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'recent':
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'condition': {
      const order: Record<ConditionGrade, number> = {
        new: 0, 'like-new': 1, excellent: 2, good: 3, fair: 4,
      };
      return sorted.sort((a, b) => order[a.condition] - order[b.condition]);
    }
    default:
      return sorted;
  }
}
