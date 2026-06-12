'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  openWhatsApp,
  buildGenericMessage,
  buildProductMessage,
  buildReservedMessage,
  buildPreorderMessage,
} from '@/utils/whatsapp';
import { addSelectedVariantToCart, isSelectedVariantInCart } from '@/utils/checkout-cart';
import { conditionLabel, getAvailableVariants, getVariantPrimarySizeLabel } from '@/utils/inventory';
import { trackEvent } from '@/utils/analytics';
import type { Product, ProductVariant } from '@/types/product';
import styles from './WhatsAppCTA.module.css';

function WAIcon() {
  return (
    <svg className={styles.waIcon} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M9 1C4.582 1 1 4.582 1 9c0 1.563.43 3.026 1.178 4.278L1 17l3.838-1.151A8 8 0 1 0 9 1Zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Zm3.24-4.78c-.18-.09-1.064-.524-1.229-.584-.165-.06-.285-.09-.405.09-.12.18-.465.584-.57.704-.105.12-.21.135-.39.045-.18-.09-.76-.28-1.447-.893-.535-.478-.896-1.068-1.001-1.248-.105-.18-.011-.277.079-.367.081-.08.18-.21.27-.315.09-.105.12-.18.18-.3.06-.12.03-.225-.015-.315-.045-.09-.405-.975-.555-1.335-.146-.35-.294-.3-.405-.306-.105-.006-.225-.006-.345-.006s-.315.045-.48.225c-.165.18-.63.615-.63 1.5s.645 1.74.735 1.86c.09.12 1.27 1.94 3.075 2.72.43.186.765.297 1.026.38.43.135.822.116 1.131.07.345-.05 1.064-.435 1.214-.855.15-.42.15-.78.105-.855-.045-.075-.165-.12-.345-.21Z"
        fill="currentColor"/>
    </svg>
  );
}

export function WhatsAppSection() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <p className={styles.sectionSub}>Curado por gente que sabe</p>
        <h2 className={styles.sectionHeading}>Tienes preguntas sobre algun par?</h2>
        <button
          type="button"
          className={styles.btn}
          onClick={() => openWhatsApp(buildGenericMessage())}
        >
          <WAIcon />
          Preguntar por WhatsApp
        </button>
      </div>
    </section>
  );
}

interface ProductCTAProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

export function WhatsAppProductCTA({ product, selectedVariant }: ProductCTAProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [selectedInCart, setSelectedInCart] = useState(false);
  const availableVariants = getAvailableVariants(product);
  const actionableVariant = selectedVariant ?? (availableVariants.length === 1 ? availableVariants[0] : null);
  const checkoutLabel = selectedInCart ? 'Ya está en carrito' : 'Agregar al carrito';

  useEffect(() => {
    const syncSelectedInCart = () => {
      setSelectedInCart(isSelectedVariantInCart(product, actionableVariant));
    };

    syncSelectedInCart();
    setMessage(null);
    window.addEventListener('rkicks-cart-updated', syncSelectedInCart);
    window.addEventListener('storage', syncSelectedInCart);

    return () => {
      window.removeEventListener('rkicks-cart-updated', syncSelectedInCart);
      window.removeEventListener('storage', syncSelectedInCart);
    };
  }, [product, actionableVariant]);

  const metaSize = useMemo(() => {
    if (selectedVariant) return getVariantPrimarySizeLabel(product, selectedVariant);
    return availableVariants.map((variant) => variant.sizeLabel).join(' / ');
  }, [availableVariants, product, selectedVariant]);
  const ctaLabel = {
    available: 'Preguntar por WhatsApp',
    reserved: 'Unirse a la lista de espera',
    'pre-order': 'Reservar mi par',
    sold: null,
  }[product.status];

  const handleClick = () => {
    if (product.status === 'available') {
      if (!selectedVariant && availableVariants.length > 1) {
        setMessage('Selecciona una talla antes de abrir WhatsApp.');
        return;
      }

      setMessage(null);
      trackEvent('product_whatsapp_click', {
        product_id: product.id,
        product_slug: product.slug,
        variant_id: actionableVariant?.id,
        size_label: actionableVariant ? getVariantPrimarySizeLabel(product, actionableVariant) : null,
      });
      openWhatsApp(buildProductMessage(product, actionableVariant));
    }

    if (product.status === 'reserved') openWhatsApp(buildReservedMessage(product, selectedVariant));
    if (product.status === 'pre-order') openWhatsApp(buildPreorderMessage(product, selectedVariant));
  };

  const handleAddToCheckout = () => {
    if (!selectedVariant && availableVariants.length > 1) {
      setMessage('Selecciona una talla antes de agregar al checkout.');
      return;
    }

    const result = addSelectedVariantToCart(product, actionableVariant, window.location.origin);

    if (result.ok) {
      trackEvent('add_to_cart', {
        product_id: product.id,
        product_slug: product.slug,
        variant_id: actionableVariant?.id,
        size_label: actionableVariant ? getVariantPrimarySizeLabel(product, actionableVariant) : null,
      });
      setSelectedInCart(true);
      setMessage(result.incremented ? 'Cantidad actualizada en carrito.' : 'Par agregado al carrito.');
      return;
    }

    const copy = {
      'missing-variant': 'Selecciona una talla antes de agregar al checkout.',
      unavailable: 'Esta talla ya no esta disponible.',
      duplicate: 'Esta talla ya está en tu carrito.',
    }[result.reason];
    if (result.reason === 'duplicate') setSelectedInCart(true);
    setMessage(copy);
  };

  if (!ctaLabel) return null;

  const meta = `${product.id} - ${metaSize} - ${conditionLabel[product.condition]}`;

  return (
    <div className={styles.sticky}>
      <button
        type="button"
        className={styles.stickyBtn}
        onClick={handleClick}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <WAIcon />
          {ctaLabel}
        </span>
      </button>
      {product.status === 'available' && (
        <button
          type="button"
          className={styles.checkoutBtn}
          onClick={handleAddToCheckout}
        >
          {checkoutLabel}
        </button>
      )}
      {selectedInCart && (
        <Link href="/checkout" className={styles.checkoutLink}>
          Ir al checkout
        </Link>
      )}
      <p className={styles.stickyMeta}>{meta}</p>
      {message && <p className={styles.stickyMessage}>{message}</p>}
    </div>
  );
}

interface Props {
  product?: Product;
  label?: string;
}

export default function WhatsAppCTA({ product, label }: Props) {
  const handleClick = () => {
    if (product) openWhatsApp(buildProductMessage(product));
    else openWhatsApp(buildGenericMessage());
  };

  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.btnInk}`}
      onClick={handleClick}
    >
      <WAIcon />
      {label ?? 'Preguntar por WhatsApp'}
    </button>
  );
}
