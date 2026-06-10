'use client';
import {
  openWhatsApp,
  buildGenericMessage,
  buildProductMessage,
  buildReservedMessage,
  buildPreorderMessage,
} from '@/utils/whatsapp';
import { conditionLabel } from '@/utils/inventory';
import type { Product } from '@/types/product';
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

/* ── Homepage section ── */
export function WhatsAppSection() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <p className={styles.sectionSub}>Curado por gente que sabe</p>
        <h2 className={styles.sectionHeading}>¿Tienes preguntas sobre algún par?</h2>
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

/* ── Product page CTA ── */
interface ProductCTAProps {
  product: Product;
}

export function WhatsAppProductCTA({ product }: ProductCTAProps) {
  const ctaLabel = {
    available:   'Preguntar por WhatsApp',
    reserved:    'Unirse a la lista de espera',
    'pre-order': 'Reservar mi par',
    sold:        null,
  }[product.status];

  const handleClick = () => {
    if (product.status === 'available')  openWhatsApp(buildProductMessage(product));
    if (product.status === 'reserved')   openWhatsApp(buildReservedMessage(product));
    if (product.status === 'pre-order')  openWhatsApp(buildPreorderMessage(product));
  };

  if (!ctaLabel) return null;

  const meta = `${product.id} · US ${product.size.us} · ${conditionLabel[product.condition]}`;

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
      <p className={styles.stickyMeta}>{meta}</p>
    </div>
  );
}

/* ── Default export: inline full-width button ── */
interface Props {
  product?: Product;
  label?: string;
}

export default function WhatsAppCTA({ product, label }: Props) {
  const handleClick = () => {
    if (product) openWhatsApp(buildProductMessage(product));
    else         openWhatsApp(buildGenericMessage());
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
