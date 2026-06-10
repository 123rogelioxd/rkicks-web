import type { Product } from '@/types/product';
import styles from './AuthenticityBlock.module.css';

interface Props {
  product: Product;
}

const checks = [
  {
    title:    'Autenticidad verificada',
    detail:   'Inspeccionado físicamente por el equipo RKicks antes de publicación.',
  },
  {
    title:    'Fotos reales del par',
    detail:   'Todas las imágenes corresponden al par exacto en inventario.',
  },
  {
    title:    'Condición documentada',
    detail:   'Cada defecto está numerado, descrito y fotografiado con luz natural.',
  },
  {
    title:    'Defectos divulgados',
    detail:   'Si no aparece en las fotos ni en el mapa, no existe.',
  },
  {
    title:    'Talla verificada',
    detail:   'Medida en insole y confirmada contra etiqueta de fábrica.',
  },
];

export default function AuthenticityBlock({ product }: Props) {
  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Verificación RKicks</span>
        <span className={styles.listingId}>{product.id}</span>
      </div>

      <ul className={styles.list} aria-label="Lista de verificación de autenticidad">
        {checks.map((check, i) => (
          <li key={i} className={styles.item}>
            <span className={styles.check} aria-hidden="true">
              <CheckIcon />
            </span>
            <div className={styles.itemBody}>
              <p className={styles.itemTitle}>{check.title}</p>
              <p className={styles.itemDetail}>{check.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className={styles.guarantee}>
        Si algo no coincide con lo que publicamos, te devolvemos tu dinero.
      </p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6.5 L4.5 9 L10 3.5" stroke="var(--rk-available)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
