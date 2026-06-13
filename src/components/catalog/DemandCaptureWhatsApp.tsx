'use client';
import type { Product } from '@/types/product';
import { openWhatsApp, buildDemandCaptureMessage } from '@/utils/whatsapp';
import styles from './DemandCaptureWhatsApp.module.css';

interface Props {
  product?: Product;
  compact?: boolean;
}

function WAIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1C4.582 1 1 4.582 1 9c0 1.563.43 3.026 1.178 4.278L1 17l3.838-1.151A8 8 0 1 0 9 1Zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Zm3.24-4.78c-.18-.09-1.064-.524-1.229-.584-.165-.06-.285-.09-.405.09-.12.18-.465.584-.57.704-.105.12-.21.135-.39.045-.18-.09-.76-.28-1.447-.893-.535-.478-.896-1.068-1.001-1.248-.105-.18-.011-.277.079-.367.081-.08.18-.21.27-.315.09-.105.12-.18.18-.3.06-.12.03-.225-.015-.315-.045-.09-.405-.975-.555-1.335-.146-.35-.294-.3-.405-.306-.105-.006-.225-.006-.345-.006s-.315.045-.48.225c-.165.18-.63.615-.63 1.5s.645 1.74.735 1.86c.09.12 1.27 1.94 3.075 2.72.43.186.765.297 1.026.38.43.135.822.116 1.131.07.345-.05 1.064-.435 1.214-.855.15-.42.15-.78.105-.855-.045-.075-.165-.12-.345-.21Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function DemandCaptureWhatsApp({ product, compact = false }: Props) {
  const handleClick = () => openWhatsApp(buildDemandCaptureMessage(product));

  if (compact) {
    return (
      <button type="button" className={styles.compactBtn} onClick={handleClick}>
        <WAIcon />
        ¿No encuentras tu talla? Avísanos por WhatsApp
      </button>
    );
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.eyebrow}>¿Buscas otra talla?</p>
      <p className={styles.body}>
        {product
          ? `Dinos qué talla necesitas de ${product.model} y te avisamos si lo conseguimos.`
          : 'Dinos qué par buscas y te avisamos cuando lo tengamos.'}
      </p>
      <button type="button" className={styles.btn} onClick={handleClick}>
        <WAIcon />
        Avísame por WhatsApp
      </button>
    </div>
  );
}
