import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.story}>
          RKicks nació de una idea simple: comprar tenis originales no debería
          dar miedo. Revisamos, fotografiamos y documentamos cada par para que
          recibas exactamente lo que viste. Parte de R Supply, junto a RDecants.
        </p>

        <div className={styles.bottom}>
          <div className={styles.brand}>
            <span className={styles.wordmark}>R | Kicks</span>
            <span className={styles.rsupply}>Parte de R Supply</span>
          </div>

          <div className={styles.right}>
            <p className={styles.copy}>© 2026 RKicks</p>
            <div className={styles.socialRow}>
              <a href="https://instagram.com/rsupply.kicks" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="https://wa.me/529516513018" className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
