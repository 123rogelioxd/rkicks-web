'use client';
import FilterChip from '@/components/ui/FilterChip';
import type { ProductStatus, ConditionGrade } from '@/types/product';
import { statusLabelES, conditionLabel } from '@/utils/inventory';
import styles from './FilterRail.module.css';

export interface ActiveFilters {
  brands:     string[];
  sizes:      number[];
  statuses:   ProductStatus[];
  conditions: ConditionGrade[];
}

interface Props {
  brands:     string[];
  sizes:      number[];
  active:     ActiveFilters;
  onChange:   (next: ActiveFilters) => void;
}

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

const STATUS_OPTIONS: ProductStatus[] = ['available', 'reserved', 'pre-order', 'sold'];
const COND_OPTIONS: ConditionGrade[]  = ['new', 'like-new', 'excellent', 'good', 'fair'];

export default function FilterRail({ brands, sizes, active, onChange }: Props) {
  const hasActive =
    active.brands.length > 0 ||
    active.sizes.length > 0 ||
    active.statuses.length > 0 ||
    active.conditions.length > 0;

  return (
    <div className={styles.rail}>
      {/* Size — highest priority per spec */}
      <span className={styles.groupLabel}>Talla MX</span>
      {sizes.map((s) => (
        <FilterChip
          key={s}
          label={`${s} MX`}
          active={active.sizes.includes(s)}
          onClick={() => onChange({ ...active, sizes: toggle(active.sizes, s) })}
        />
      ))}

      <span className={styles.divider} aria-hidden="true" />

      {/* Availability */}
      <span className={styles.groupLabel}>Estado</span>
      {STATUS_OPTIONS.map((st) => (
        <FilterChip
          key={st}
          label={statusLabelES[st]}
          active={active.statuses.includes(st)}
          onClick={() => onChange({ ...active, statuses: toggle(active.statuses, st) })}
        />
      ))}

      <span className={styles.divider} aria-hidden="true" />

      {/* Brand */}
      <span className={styles.groupLabel}>Marca</span>
      {brands.map((b) => (
        <FilterChip
          key={b}
          label={b}
          active={active.brands.includes(b)}
          onClick={() => onChange({ ...active, brands: toggle(active.brands, b) })}
        />
      ))}

      <span className={styles.divider} aria-hidden="true" />

      {/* Condition */}
      <span className={styles.groupLabel}>Condición</span>
      {COND_OPTIONS.map((c) => (
        <FilterChip
          key={c}
          label={conditionLabel[c]}
          active={active.conditions.includes(c)}
          onClick={() => onChange({ ...active, conditions: toggle(active.conditions, c) })}
        />
      ))}

      {hasActive && (
        <>
          <span className={styles.divider} aria-hidden="true" />
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => onChange({ brands: [], sizes: [], statuses: [], conditions: [] })}
          >
            Limpiar
          </button>
        </>
      )}
    </div>
  );
}
