import styles from './RCGPill.module.css';

export default function RCGPill() {
  return (
    <span className={styles.pill}>
      <span className={styles.dot} aria-hidden="true" />
      Real Condition Garantizado
    </span>
  );
}
