import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.wordmark}>R | Kicks</span>
          <span className={styles.rsupply}>Parte de R Supply</span>
        </div>

        <div className={styles.right}>
          <p className={styles.copy}>© 2026 RKicks</p>
          <div className={styles.socialRow}>
            <a href="https://instagram.com" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://wa.me/521XXXXXXXXXX" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
