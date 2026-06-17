'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  getCartItemIdentity,
  readCart,
  removeCartItem,
  type CheckoutCartItem,
} from '@/utils/checkout-cart';
import { buildRKicksCheckoutMessage, getWhatsAppURL } from '@/utils/whatsapp';
import { formatPrice } from '@/utils/currency';
import { trackEvent } from '@/utils/analytics';
import ProductImage from '@/components/product/ProductImage';
import styles from './CartDrawer.module.css';

const TRUST_BADGES = [
  'Autenticidad verificada',
  'Fotos reales del par',
  'Aparta con solo el 50%',
  'Envío a todo México',
];

function WAIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1C4.582 1 1 4.582 1 9c0 1.563.43 3.026 1.178 4.278L1 17l3.838-1.151A8 8 0 1 0 9 1Zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Zm3.24-4.78c-.18-.09-1.064-.524-1.229-.584-.165-.06-.285-.09-.405.09-.12.18-.465.584-.57.704-.105.12-.21.135-.39.045-.18-.09-.76-.28-1.447-.893-.535-.478-.896-1.068-1.001-1.248-.105-.18-.011-.277.079-.367.081-.08.18-.21.27-.315.09-.105.12-.18.18-.3.06-.12.03-.225-.015-.315-.045-.09-.405-.975-.555-1.335-.146-.35-.294-.3-.405-.306-.105-.006-.225-.006-.345-.006s-.315.045-.48.225c-.165.18-.63.615-.63 1.5s.645 1.74.735 1.86c.09.12 1.27 1.94 3.075 2.72.43.186.765.297 1.026.38.43.135.822.116 1.131.07.345-.05 1.064-.435 1.214-.855.15-.42.15-.78.105-.855-.045-.075-.165-.12-.345-.21Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function CartDrawer() {
  const { isOpen, lastAdded, closeCart } = useCart();
  const [items, setItems] = useState<CheckoutCartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener('rkicks-cart-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('rkicks-cart-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // Scroll lock while drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const message = useMemo(
    () =>
      buildRKicksCheckoutMessage({
        items: items.map((item) => ({
          name: item.productName,
          sizeLabel: item.selectedSizeLabel,
          price: item.price,
          quantity: item.quantity,
        })),
      }),
    [items],
  );

  const handleRemove = useCallback((item: CheckoutCartItem) => {
    setItems(removeCartItem(getCartItemIdentity(item)));
  }, []);

  const handleWhatsApp = () => {
    trackEvent('cart_drawer_whatsapp_click', { item_count: items.length, total });
  };

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`}
        aria-hidden="true"
        onClick={closeCart}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tu carrito"
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
      >
        <div className={styles.header}>
          <p className={styles.title}>
            Tu carrito
            {items.length > 0 && <span className={styles.count}>{items.length}</span>}
          </p>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Cerrar carrito"
            onClick={closeCart}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {lastAdded && (
          <div className={styles.toast}>
            <span className={styles.toastCheck}>✓</span>
            <span>
              <strong>{lastAdded.productName}</strong> · {lastAdded.selectedSizeLabel}
            </span>
          </div>
        )}

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>Tu carrito está vacío</p>
              <p className={styles.emptyBody}>Agrega un par para continuar.</p>
              <Link href="/catalogo" className={styles.emptyLink} onClick={closeCart}>
                Ver catálogo →
              </Link>
            </div>
          ) : (
            <ul className={styles.items}>
              {items.map((item) => (
                <li key={getCartItemIdentity(item)} className={styles.item}>
                  <div className={styles.itemImage}>
                    <ProductImage
                      src={item.image}
                      alt={item.productName}
                      brand={item.brand}
                      objectFit="contain"
                      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <p className={styles.itemBrand}>{item.brand}</p>
                    <p className={styles.itemName}>{item.productName}</p>
                    <p className={styles.itemSize}>Talla {item.selectedSizeLabel}</p>
                    <div className={styles.itemFooter}>
                      <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => handleRemove(item)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <ul className={styles.trust}>
              {TRUST_BADGES.map((badge) => (
                <li key={badge} className={styles.trustItem}>
                  <span className={styles.trustCheck}>✓</span>
                  {badge}
                </li>
              ))}
            </ul>

            <div className={styles.total}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>{formatPrice(total)} MXN</span>
            </div>

            <a
              href={getWhatsAppURL(message)}
              className={styles.ctaWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsApp}
            >
              <WAIcon />
              Apartar por WhatsApp
            </a>

            <button type="button" className={styles.ctaContinue} onClick={closeCart}>
              Seguir viendo →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
