'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { Photo, PhotoType } from '@/types/product';
import PlaceholderPhoto from './PlaceholderPhoto';
import styles from './ProductGallery.module.css';

interface Props {
  photos: Photo[];
  brand: string;
  model: string;
}

const typeLabel: Record<PhotoType, string> = {
  editorial: 'Editorial',
  condition: 'Condición',
  detail:    'Detalle',
  lifestyle: 'Lifestyle',
};

export default function ProductGallery({ photos, brand, model }: Props) {
  const [activeIdx, setActiveIdx]       = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgErrors, setImgErrors]       = useState<Record<number, boolean>>({});
  const touchStartX  = useRef(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const total       = Math.max(photos.length, 1);
  const activePhoto = photos[activeIdx] ?? photos[0];

  const goNext = useCallback(() => setActiveIdx(i => (i + 1) % total), [total]);
  const goPrev = useCallback(() => setActiveIdx(i => (i - 1 + total) % total), [total]);

  useEffect(() => {
    if (!lightboxOpen) return;
    // Focus close button when lightbox opens
    closeButtonRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      setLightboxOpen(false);
      if (e.key === 'ArrowRight')  goNext();
      if (e.key === 'ArrowLeft')   goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, goNext, goPrev]);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 48) delta > 0 ? goNext() : goPrev();
  };

  const markError  = (idx: number) => setImgErrors(prev => ({ ...prev, [idx]: true }));
  const useFallback = (idx: number) => imgErrors[idx] || !photos[idx]?.url || photos[idx].url === '';

  return (
    <>
      {/* ── Hero image ── */}
      <div
        className={styles.heroWrap}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setLightboxOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Ver en pantalla completa: ${activePhoto?.alt ?? model}`}
        onKeyDown={e => { if (e.key === 'Enter') setLightboxOpen(true); }}
      >
        {useFallback(activeIdx) ? (
          <PlaceholderPhoto
            type={activePhoto?.type ?? 'editorial'}
            brand={brand}
            className={styles.heroFill}
          />
        ) : (
          <img
            src={activePhoto.url}
            alt={activePhoto.alt}
            className={styles.heroImg}
            onError={() => markError(activeIdx)}
            draggable={false}
          />
        )}

        <span className={styles.counter} aria-label={`Foto ${activeIdx + 1} de ${total}`}>
          {total} {total === 1 ? 'Photo' : 'Photos'}
        </span>
      </div>

      {/* ── Thumbnails ── */}
      {photos.length > 1 && (
        <div className={styles.thumbStrip} role="list" aria-label="Fotos del producto">
          {photos.map((photo, idx) => (
            <button
              key={idx}
              type="button"
              role="listitem"
              className={`${styles.thumb} ${idx === activeIdx ? styles.thumbActive : ''}`}
              onClick={() => setActiveIdx(idx)}
              aria-label={`${typeLabel[photo.type]} ${idx + 1}`}
              aria-current={idx === activeIdx}
            >
              {useFallback(idx) ? (
                <PlaceholderPhoto type={photo.type} brand={brand} className={styles.thumbFill} />
              ) : (
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className={styles.thumbImg}
                  onError={() => markError(idx)}
                  draggable={false}
                />
              )}
              <span className={styles.thumbLabel}>{typeLabel[photo.type]}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Galería de fotos"
          onClick={e => { if (e.target === e.currentTarget) setLightboxOpen(false); }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.lbClose}
            onClick={() => setLightboxOpen(false)}
            aria-label="Cerrar galería"
          >
            ✕
          </button>

          <div className={styles.lbImgWrap}>
            {useFallback(activeIdx) ? (
              <PlaceholderPhoto
                type={activePhoto?.type ?? 'editorial'}
                brand={brand}
                className={styles.lbFill}
              />
            ) : (
              <img
                src={activePhoto.url}
                alt={activePhoto.alt}
                className={styles.lbImg}
                onError={() => markError(activeIdx)}
              />
            )}
          </div>

          {total > 1 && (
            <>
              <button
                type="button"
                className={`${styles.lbNav} ${styles.lbPrev}`}
                onClick={e => { e.stopPropagation(); goPrev(); }}
                aria-label="Foto anterior"
              >
                ←
              </button>
              <button
                type="button"
                className={`${styles.lbNav} ${styles.lbNext}`}
                onClick={e => { e.stopPropagation(); goNext(); }}
                aria-label="Foto siguiente"
              >
                →
              </button>
            </>
          )}

          <span className={styles.lbCounter}>{activeIdx + 1}&thinsp;/&thinsp;{total}</span>
        </div>
      )}
    </>
  );
}
