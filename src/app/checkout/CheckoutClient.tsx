'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import EmptyState from '@/components/ui/EmptyState';
import ProductImage from '@/components/product/ProductImage';
import PurchaseTrust from '@/components/conversion/PurchaseTrust';
import type { Product } from '@/types/product';
import {
  type CheckoutCartItem,
  getCartItemIdentity,
  readCart,
  removeCartItem,
  updateCartItemQuantity,
  writeCart,
} from '@/utils/checkout-cart';
import { formatPrice } from '@/utils/currency';
import { fetchLiveCatalog, logRuntimeApi } from '@/utils/api-products';
import { getVariantPrimarySizeLabel } from '@/utils/inventory';
import { getWhatsAppURL, buildRKicksCheckoutMessage } from '@/utils/whatsapp';
import { trackEvent } from '@/utils/analytics';
import styles from './page.module.css';

export default function CheckoutClient() {
  const [items, setItems] = useState<CheckoutCartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const storedItems = readCart();
    setItems(storedItems);
    trackEvent('checkout_opened', {
      item_count: storedItems.length,
    });

    async function refreshAvailability() {
      try {
        const liveProducts = await fetchLiveCatalog();
        if (cancelled) return;
        const refreshed = reconcileCart(storedItems, liveProducts);
        setItems(refreshed);
        writeCart(refreshed);
      } catch (error) {
        logRuntimeApi('checkout availability refresh failed', error);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    refreshAvailability();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasUnavailable = items.some((item) => item.unavailable);
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const message = useMemo(
    () => buildRKicksCheckoutMessage({
      items: items.filter((item) => !item.unavailable).map((item) => ({
        name: item.productName,
        sizeLabel: item.selectedSizeLabel,
        price: item.price,
        quantity: item.quantity,
      })),
      customerName,
      customerPhone,
    }),
    [items, customerName, customerPhone]
  );
  const canCheckout = items.length > 0 && !hasUnavailable && !checking;
  const canFinalize = canCheckout;

  const handleRemove = (item: CheckoutCartItem) => {
    setItems(removeCartItem(getCartItemIdentity(item)));
  };

  const handleQuantity = (item: CheckoutCartItem, quantity: number) => {
    setItems(updateCartItemQuantity(getCartItemIdentity(item), quantity));
  };

  return (
    <main className={`rk-zone-bone ${styles.checkout}`}>
      <div className={`rk-page ${styles.inner}`}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>RKicks checkout</p>
          <h1 className={styles.title}>Finaliza por WhatsApp</h1>
        </header>

        {items.length === 0 ? (
          <div className={styles.emptyWrap}>
            <EmptyState
              heading="Tu carrito está vacío."
              body="Agrega un par disponible desde el catálogo para continuar."
            />
            <Link href="/catalogo" className={styles.emptyLink}>
              Ver catalogo
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            <section className={styles.items} aria-label="Pares seleccionados">
              {items.map((item) => {
                const quantityEnabled = (item.stockQuantity ?? 1) > 1 && !item.unavailable;

                return (
                  <article
                    key={getCartItemIdentity(item)}
                    className={`${styles.item} ${item.unavailable ? styles.itemUnavailable : ''}`}
                  >
                    <div className={styles.imageWrap}>
                      <ProductImage
                        src={item.image}
                        alt={item.productName}
                        brand={item.brand}
                        objectFit="contain"
                        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                      />
                    </div>

                    <div className={styles.itemBody}>
                      <div>
                        <p className={styles.brand}>{item.brand}</p>
                        <h2 className={styles.itemName}>{item.productName}</h2>
                        <p className={styles.size}>{item.selectedSizeLabel}</p>
                      </div>

                      <div className={styles.itemFooter}>
                        <span className={styles.price}>{formatPrice(item.price)}</span>
                        {quantityEnabled ? (
                          <label className={styles.qty}>
                            Cantidad
                            <input
                              type="number"
                              min={1}
                              max={item.stockQuantity}
                              value={item.quantity}
                              onChange={(event) => handleQuantity(item, Number(event.target.value))}
                            />
                          </label>
                        ) : (
                          <span className={styles.fixedQty}>Qty 1</span>
                        )}
                        <button
                          type="button"
                          className={styles.remove}
                          onClick={() => handleRemove(item)}
                        >
                          Quitar
                        </button>
                      </div>

                      {item.unavailable && (
                        <p className={styles.unavailable}>Esta talla ya no está disponible. Quítala para finalizar.</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className={styles.summary} aria-label="Resumen">
              <div className={styles.summaryTop}>
                <span>Total</span>
                <strong>{formatPrice(total)} MXN</strong>
              </div>

              <PurchaseTrust variant="checkout" />

              <label className={styles.field}>
                Nombre (opcional)
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Tu nombre"
                />
              </label>

              <label className={styles.field}>
                Teléfono (opcional)
                <input
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  placeholder="+52..."
                />
              </label>

              <p className={styles.messageHint}>
                Te llevamos a WhatsApp con tu par y talla ya escritos.
              </p>

              <a
                className={`${styles.finalize} ${!canFinalize ? styles.finalizeDisabled : ''}`}
                href={canFinalize ? getWhatsAppURL(message) : undefined}
                aria-disabled={!canFinalize}
                onClick={(event) => {
                  if (!canFinalize) {
                    event.preventDefault();
                    return;
                  }
                  trackEvent('checkout_whatsapp_sent', {
                    item_count: items.length,
                    total,
                  });
                }}
              >
                Finalizar por WhatsApp
              </a>

              <Link href="/catalogo" className={styles.continueLink}>
                Seguir viendo pares
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function reconcileCart(items: CheckoutCartItem[], liveProducts: Product[]): CheckoutCartItem[] {
  return items.map((item) => {
    const liveProduct = liveProducts.find((product) => product.slug === item.productSlug);
    const liveVariant = liveProduct?.variants.find((variant) => {
      if (item.variantId) return variant.id === item.variantId;
      return getVariantPrimarySizeLabel(liveProduct, variant) === item.selectedSizeLabel;
    });
    const unavailable = !liveProduct || !liveVariant || liveVariant.status !== 'available';
    const maxQuantity = liveVariant?.stockQuantity && liveVariant.stockQuantity > 1 ? liveVariant.stockQuantity : 1;

    return {
      ...item,
      cartKey: getCartItemIdentity(item),
      productId: liveProduct?.id ?? item.productId,
      productName: liveProduct?.model ?? item.productName,
      brand: liveProduct?.brand ?? item.brand,
      selectedSizeLabel: liveProduct && liveVariant ? getVariantPrimarySizeLabel(liveProduct, liveVariant) : item.selectedSizeLabel,
      price: liveVariant?.salePrice && liveVariant.salePrice > 0 ? liveVariant.salePrice : liveProduct?.price ?? item.price,
      stockQuantity: liveVariant?.stockQuantity,
      quantity: Math.min(item.quantity, maxQuantity),
      unavailable,
    };
  });
}
