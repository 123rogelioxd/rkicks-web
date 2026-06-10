import type { Product } from '@/types/product';
import { conditionLabel } from './inventory';

const WHATSAPP_NUMBER = '521XXXXXXXXXX'; // Replace with actual number

export function buildProductMessage(product: Product): string {
  const sizeStr = `US ${product.size.us}`;
  const condStr = conditionLabel[product.condition];
  return encodeURIComponent(
    `Hola, me interesa: ${product.id} · ${product.model} · ${sizeStr} · ${condStr}`
  );
}

export function buildReservedMessage(product: Product): string {
  return encodeURIComponent(
    `Hola, quiero unirme a la lista de espera: ${product.id} · ${product.model} · US ${product.size.us}`
  );
}

export function buildPreorderMessage(product: Product): string {
  return encodeURIComponent(
    `Hola, quiero reservar: ${product.id} · ${product.model} · US ${product.size.us}`
  );
}

export function buildSizeNotifyMessage(sizeUS: number): string {
  return encodeURIComponent(
    `Hola, quisiera que me avisen cuando tengan pares en talla US ${sizeUS}.`
  );
}

export function buildGenericMessage(): string {
  return encodeURIComponent(
    'Hola, me interesa ver los pares disponibles en RKicks.'
  );
}

export function buildCombinedMessage(product: Product, fragranceName: string): string {
  return encodeURIComponent(
    `Hola, me interesan: ${product.id} · ${product.model} · US ${product.size.us} + ${fragranceName} de RDecants.`
  );
}

export function getWhatsAppURL(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

export function openWhatsApp(message: string): void {
  window.open(getWhatsAppURL(message), '_blank', 'noopener,noreferrer');
}
