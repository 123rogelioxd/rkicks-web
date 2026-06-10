'use client';
import styles from './FilterChip.module.css';

interface Props {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function FilterChip({ label, active, onClick }: Props) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${active ? styles.active : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
