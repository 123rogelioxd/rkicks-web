import type { PhotoType } from '@/types/product';
import styles from './PlaceholderPhoto.module.css';

interface Props {
  type?: PhotoType;
  brand?: string;
  className?: string;
}

const typeLabels: Record<PhotoType, string> = {
  editorial: 'Editorial',
  condition: 'Condición',
  detail:    'Detalle',
  lifestyle: 'Lifestyle',
};

export default function PlaceholderPhoto({ type = 'editorial', brand, className }: Props) {
  return (
    <div
      className={[styles.wrap, styles[type], className].filter(Boolean).join(' ')}
      aria-label={`Placeholder foto ${typeLabels[type]}`}
    >
      {/* Minimal sneaker silhouette — side profile, low opacity */}
      <svg
        className={styles.silhouette}
        viewBox="0 0 180 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M18 80 C18 84 40 88 90 87 C140 86 162 80 162 76"
          fill="rgba(240,234,224,0.06)" stroke="rgba(240,234,224,0.18)" strokeWidth="1" />
        <path d="M18 76 C18 68 24 56 38 46 C52 36 72 32 92 32 C112 32 132 38 148 52 C158 62 162 72 162 76 C140 82 90 85 18 76 Z"
          fill="rgba(240,234,224,0.04)" stroke="rgba(240,234,224,0.16)" strokeWidth="0.8" />
        <path d="M148 52 C158 60 163 70 162 76"
          stroke="rgba(240,234,224,0.12)" strokeWidth="0.8" fill="none" />
        <path d="M18 76 C16 68 17 58 21 50 C25 42 30 42 38 46"
          stroke="rgba(240,234,224,0.12)" strokeWidth="0.8" fill="none" />
        <path d="M78 32 Q88 24 98 24 Q108 24 112 32"
          stroke="rgba(240,234,224,0.1)" strokeWidth="0.8" fill="none" />
        <path d="M18 80 C40 83 90 84 140 82 C155 80 162 78 162 76"
          stroke="rgba(240,234,224,0.1)" strokeWidth="0.5" fill="none" />
        <path d="M45 70 C68 55 108 52 138 62"
          stroke="rgba(240,234,224,0.07)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>

      <span className={styles.label}>{typeLabels[type]}</span>
      {brand && <span className={styles.brandMark}>{brand}</span>}
    </div>
  );
}
