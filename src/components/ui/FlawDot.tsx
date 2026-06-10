import type { FlawLevel } from '@/types/product';
import styles from './FlawDot.module.css';

const levelClass: Record<FlawLevel, string> = {
  none:    styles.none,
  minor:   styles.minor,
  visible: styles.visible,
  heavy:   styles.heavy,
};

interface Props {
  level: FlawLevel;
}

export default function FlawDot({ level }: Props) {
  return <span className={`${styles.dot} ${levelClass[level]}`} aria-hidden="true" />;
}
