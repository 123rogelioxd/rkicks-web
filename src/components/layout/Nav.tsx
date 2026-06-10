'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Nav.module.css';

const links = [
  { href: '/catalogo',       label: 'Catálogo' },
  { href: '/real-condition', label: 'Real Condition' },
  { href: '/nosotros',       label: 'Nosotros' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

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

        <nav aria-label="Mobile principal">
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
