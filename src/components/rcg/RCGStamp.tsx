import styles from './RCGStamp.module.css';

interface Props {
  inverted?: boolean;
}

export default function RCGStamp({ inverted }: Props) {
  return (
    <div className={`${styles.stamp} ${inverted ? styles.inverted : ''}`}>
      <span className={styles.title}>Real Condition Guarantee</span>
      <span className={styles.rule} aria-hidden="true" />
      <span className={styles.sub}>RKicks · Verificado · MX</span>
    </div>
  );
}
