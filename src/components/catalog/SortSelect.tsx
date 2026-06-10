'use client';
import styles from './SortSelect.module.css';

export type SortOption = 'recent' | 'price-asc' | 'price-desc' | 'condition';

const options: { value: SortOption; label: string }[] = [
  { value: 'recent',     label: 'Más reciente' },
  { value: 'price-asc',  label: 'Precio: menor' },
  { value: 'price-desc', label: 'Precio: mayor' },
  { value: 'condition',  label: 'Condición: mejor' },
];

interface Props {
  value: SortOption;
  onChange: (v: SortOption) => void;
}

export default function SortSelect({ value, onChange }: Props) {
  return (
    <div className={styles.wrap}>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        aria-label="Ordenar por"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg className={styles.chevron} width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}
