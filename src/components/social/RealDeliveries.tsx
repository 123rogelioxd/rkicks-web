import styles from './RealDeliveries.module.css';

export interface DeliveryPhoto {
  url: string;
  alt: string;
  caption?: string;
}

interface Props {
  photos?: DeliveryPhoto[];
}

export default function RealDeliveries({ photos = [] }: Props) {
  return (
    <section className={styles.section} aria-label="Entregas reales RKicks">
      <div className="rk-page">
        <div className={styles.inner}>
          <div className={styles.header}>
            <p className={styles.eyebrow}>Social proof</p>
            <h2 className={styles.heading}>Entregas reales RKicks</h2>
          </div>

          {photos.length === 0 ? (
            <p className={styles.placeholder}>
              Pronto verás entregas reales de RKicks aquí.
            </p>
          ) : (
            <div className={styles.grid}>
              {photos.map((photo, idx) => (
                <figure key={idx} className={styles.card}>
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className={styles.img}
                    loading="lazy"
                  />
                  {photo.caption && (
                    <figcaption className={styles.caption}>{photo.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
