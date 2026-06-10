import type { Product, ProductStatus, ConditionGrade, FlawLevel } from '@/types/product';

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
