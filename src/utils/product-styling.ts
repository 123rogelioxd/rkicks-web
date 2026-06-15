import type { Product } from '@/types/product';

/**
 * Words that signal a versatile / neutral base colorway. Detected from the
 * real colorway (subtitle) + model so the styling guidance stays grounded in
 * the actual product instead of generic marketing copy.
 */
const NEUTRAL_KEYWORDS = [
  'white', 'blanco', 'black', 'negro', 'cream', 'crema', 'bone', 'hueso',
  'sail', 'beige', 'tan', 'arena', 'gris', 'grey', 'gray', 'marfil',
  'olive', 'olivo', 'navy', 'marino',
];

export type ColorwayTone = 'neutral' | 'accent';

export interface ProductStyling {
  tone: ColorwayTone;
  lead: string;
  pairings: string[];
  useCase: string;
}

export function getColorwayTone(product: Product): ColorwayTone {
  const haystack = `${product.subtitle} ${product.model} ${product.category}`.toLowerCase();
  return NEUTRAL_KEYWORDS.some((keyword) => haystack.includes(keyword)) ? 'neutral' : 'accent';
}

/**
 * Product-focused styling guidance for the PDP "Por qué funciona este par"
 * block. Claims are deliberately modest and tied to verifiable attributes
 * (colorway tone + condition) so the copy stays specific, not exaggerated.
 */
export function getProductStyling(product: Product): ProductStyling {
  const tone = getColorwayTone(product);
  const isNew = product.condition === 'new';

  if (tone === 'neutral') {
    return {
      tone,
      lead:
        'Su base neutra hace casi todo el trabajo: combina con la mayoría de tu clóset sin competir con el resto del outfit.',
      pairings: ['Jeans y playera', 'Pants o joggers', 'Shorts en clima cálido'],
      useCase: isNew
        ? 'Llega sin uso, listo para entrar de inmediato a tu rotación diaria.'
        : 'Un par para todos los días, del trabajo relajado a salir el fin.',
    };
  }

  return {
    tone,
    lead:
      'El color carga el outfit, así que rinde mejor como punto focal: déjalo destacar sobre básicos en tonos neutros.',
    pairings: ['Jeans oscuros', 'Básicos en blanco o negro', 'Looks de un solo tono'],
    useCase: isNew
      ? 'Llega sin uso, listo para estrenar cuando quieras que el calzado hable.'
      : 'Para los días en que quieres que el tenis sea el centro del look.',
  };
}
