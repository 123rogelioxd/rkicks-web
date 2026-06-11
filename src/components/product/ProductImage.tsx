'use client';
import { useState } from 'react';
import PlaceholderPhoto from './PlaceholderPhoto';
import styles from './ProductImage.module.css';

interface Props {
  src: string;
  alt: string;
  brand?: string;
  className?: string;
  style?: React.CSSProperties;
  eager?: boolean;
  objectFit?: 'cover' | 'contain';
}

export default function ProductImage({ src, alt, brand, className, style, eager, objectFit = 'cover' }: Props) {
  const [failed, setFailed] = useState(false);
  const useFallback = failed || !src;

  return (
    <div className={`${styles.wrap} ${className ?? ''}`} style={style}>
      {!useFallback && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`${styles.img} ${objectFit === 'contain' ? styles.contain : styles.cover}`}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
        />
      )}
      {useFallback && <PlaceholderPhoto brand={brand} className={styles.placeholder} />}
    </div>
  );
}
