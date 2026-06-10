'use client';
import { useState } from 'react';
import styles from './ProductImage.module.css';

interface Props {
  src: string;
  alt: string;
  brand?: string;
  className?: string;
  style?: React.CSSProperties;
  eager?: boolean;
}

export default function ProductImage({ src, alt, brand, className, style, eager }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`${styles.wrap} ${className ?? ''}`} style={style}>
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={styles.img}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <div className={styles.placeholder}>
          <svg className={styles.placeholderIcon} viewBox="0 0 56 32" fill="none" aria-hidden="true">
            <path d="M5 24 C5 26 13 28 28 27.5 C43 27 51 24 51 22"
              stroke="currentColor" strokeWidth="0.8" fill="none"/>
            <path d="M5 22 C5 20 7 16 11 13 C15 10 21 9 28 9 C35 9 41 11 46 16 C49 19 51 21 51 22 C43 25 28 26 5 22 Z"
              fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="0.7"/>
            <path d="M23 9 Q26 6 29 6 Q32 6 33 9"
              stroke="currentColor" strokeWidth="0.7" fill="none"/>
          </svg>
          {brand && <span className={styles.placeholderBrand}>{brand}</span>}
        </div>
      )}
    </div>
  );
}
