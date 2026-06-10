import type { FlawLevel } from '@/types/product';
import styles from './FlawBar.module.css';

const levelCount: Record<FlawLevel, number> = {
  none: 1, minor: 2, visible: 3, heavy: 4,
};

interface Props {
  level: FlawLevel;
}

export default function FlawBar({ level }: Props) {
  const active = levelCount[level];
  return (
    <span className={styles.bar} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`${styles.seg} ${i < active ? `${styles.active} ${styles[level]}` : ''}`}
        />
      ))}
    </span>
  );
}
