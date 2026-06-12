import type { Product, ProductVariant } from '@/types/product';
import { formatPrice } from './currency';
import { getVariantPrice, getVariantPrimarySizeLabel } from './inventory';

export const WHATSAPP_NUMBER = '529516513018';

export interface WhatsAppLineItem {
  name: string;
  sizeLabel: string;
  price: number;
  quantity?: number;
}

export function buildProductMessage(
  product: Product,
  selectedVariant?: ProductVariant | null
): string {
  return buildRKicksCheckoutMessage({
    items: [{
      name: product.model,
      sizeLabel: getVariantPrimarySizeLabel(product, selectedVariant),
      price: getVariantPrice(product, selectedVariant),
      quantity: 1,
    }],
  });
}

export function buildRKicksCheckoutMessage({
  items,
  customerName,
  customerPhone,
}: {
  items: WhatsAppLineItem[];
  customerName?: string;
  customerPhone?: string;
}): string {
  const normalizedItems = items
    .filter((item) => item.name && item.sizeLabel && item.price > 0)
    .map((item) => ({
      ...item,
      quantity: Math.max(1, item.quantity ?? 1),
    }));

  const multiple = normalizedItems.length > 1;
  const total = normalizedItems.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
  const lines = [
    'Hola',
    '',
    multiple ? 'Me interesan estos pares:' : 'Me interesa este par:',
    '',
    ...normalizedItems.map(formatWhatsAppItem),
  ];

  if (multiple) {
    lines.push('', `Total: ${formatPrice(total)} MXN`);
  }

  lines.push('');
  lines.push(`Mi nombre es ${cleanField(customerName) || '____'}.`);

  const phone = cleanField(customerPhone);
  if (phone) lines.push(`Mi telefono es ${phone}.`);

  lines.push('');
  lines.push('Quedo pendiente de disponibilidad y detalles de compra.');

  return cleanMessage(lines.join('\n'));
}

export function buildReservedMessage(product: Product, selectedVariant?: ProductVariant | null): string {
  return cleanMessage(
    `Hola\n\nQuiero unirme a la lista de espera:\n\n- ${product.model} - ${getVariantPrimarySizeLabel(product, selectedVariant)}\n\nMi nombre es ____.`
  );
}

export function buildPreorderMessage(product: Product, selectedVariant?: ProductVariant | null): string {
  return cleanMessage(
    `Hola\n\nQuiero reservar este par:\n\n- ${product.model} - ${getVariantPrimarySizeLabel(product, selectedVariant)}\n\nMi nombre es ____.`
  );
}

export function buildSizeNotifyMessage(sizeMx: number): string {
  return cleanMessage(`Hola, quisiera que me avisen cuando tengan pares en talla ${sizeMx} MX.`);
}

export function buildGenericMessage(): string {
  return cleanMessage('Hola, me interesa ver los pares disponibles en RKicks.');
}

export function buildCombinedMessage(product: Product, fragranceName: string): string {
  return cleanMessage(
    `Hola, me interesan ${product.model} - ${getVariantPrimarySizeLabel(product)} y ${fragranceName} de RDecants.`
  );
}

export function getWhatsAppURL(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string): void {
  window.open(getWhatsAppURL(message), '_blank', 'noopener,noreferrer');
}

function formatWhatsAppItem(item: WhatsAppLineItem): string {
  const quantity = item.quantity && item.quantity > 1 ? ` x${item.quantity}` : '';
  return `• ${item.name} — ${item.sizeLabel} — ${formatPrice(item.price)}${quantity}`;
}

function cleanField(value?: string): string {
  return (value ?? '').trim().replace(/\s+/g, ' ');
}

function cleanMessage(message: string): string {
  return message
    .replace(/[^\S\r\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
