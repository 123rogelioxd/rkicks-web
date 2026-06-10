'use client';
import styles from './SearchInput.module.css';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchInput({ value, onChange }: Props) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon} aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </span>

      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="BUSCAR MARCA, MODELO"
        aria-label="Buscar productos"
      />

      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
        >
          ×
        </button>
      )}
    </div>
  );
}
