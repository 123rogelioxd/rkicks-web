'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCartItemCount, readCart } from '@/utils/checkout-cart';
import { useCart } from '@/context/CartContext';
import styles from './Nav.module.css';

const links = [
  { href: '/catalogo',       label: 'Catálogo' },
  { href: '/real-condition', label: 'Condición Verificada' },
  { href: '/nosotros',       label: 'Nosotros' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [bump, setBump] = useState(false);
  const { openCart } = useCart();

  useEffect(() => {
    const syncCartCount = () => setCartCount(getCartItemCount(readCart()));
    // Cart mutations fire this event — pulse the badge so the add registers visibly.
    const onCartUpdated = () => {
      syncCartCount();
      setBump(true);
      window.setTimeout(() => setBump(false), 600);
    };

    syncCartCount();
    window.addEventListener('rkicks-cart-updated', onCartUpdated);
    window.addEventListener('storage', syncCartCount);

    return () => {
      window.removeEventListener('rkicks-cart-updated', onCartUpdated);
      window.removeEventListener('storage', syncCartCount);
    };
  }, []);

  return (
    <>
      <header className={styles.nav}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoR}>R</span>
            <span className={styles.logoDivider}>|</span>
            <span className={styles.logoKicks}>Kicks</span>
          </Link>

          <nav className={styles.links} aria-label="Principal">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={styles.link}>
                {l.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className={`${styles.cartLink} ${cartCount > 0 ? styles.cartActive : ''} ${bump ? styles.cartBump : ''}`}
            aria-label={`Carrito, ${cartCount} ${cartCount === 1 ? 'par' : 'pares'}`}
            onClick={() => openCart()}
          >
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5.2 6.7h11.6l-1.1 6.1a1.8 1.8 0 0 1-1.8 1.5H7.3a1.8 1.8 0 0 1-1.8-1.6L4.7 4.5H2.8" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 16.8h.1M14 16.8h.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
            {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
          </button>

          <button
            className={styles.hamburger}
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
              <rect x="0" y="0"  width="18" height="1.5" fill="currentColor" rx="1" />
              <rect x="0" y="6"  width="18" height="1.5" fill="currentColor" rx="1" />
              <rect x="0" y="12" width="18" height="1.5" fill="currentColor" rx="1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`${styles.overlay} ${open ? styles.open : ''}`} role="dialog" aria-modal="true">
        <button
          className={styles.overlayClose}
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <nav aria-label="Mobile principal" className={styles.overlayNav}>
          <button
            type="button"
            className={`${styles.overlayLink} ${styles.overlayCartLink} ${styles.overlayBtn}`}
            onClick={() => { setOpen(false); openCart(); }}
          >
            Carrito ({cartCount})
          </button>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={styles.overlayLink}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
