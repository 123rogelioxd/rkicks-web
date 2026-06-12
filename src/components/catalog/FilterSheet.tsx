'use client';
import { useState, useEffect } from 'react';
import FilterChip from '@/components/ui/FilterChip';
import type { ProductStatus, ConditionGrade } from '@/types/product';
import { statusLabelES, conditionLabel } from '@/utils/inventory';
import type { ActiveFilters } from './FilterRail';
import styles from './FilterSheet.module.css';

interface Props {
  open:     boolean;
  onClose:  () => void;
  brands:   string[];
  sizes:    number[];
  active:   ActiveFilters;
  onApply:  (next: ActiveFilters) => void;
}

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

const STATUS_OPTIONS: ProductStatus[] = ['available', 'reserved', 'pre-order', 'sold'];
const COND_OPTIONS: ConditionGrade[]  = ['new', 'like-new', 'excellent', 'good', 'fair'];

export default function FilterSheet({ open, onClose, brands, sizes, active, onApply }: Props) {
  const [local, setLocal] = useState<ActiveFilters>(active);

  useEffect(() => { setLocal(active); }, [active, open]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const hasActive =
    local.brands.length + local.sizes.length + local.statuses.length + local.conditions.length > 0;

  return (
    <>
      <div
        className={`${styles.backdrop} ${open ? styles.open : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`${styles.sheet} ${open ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros"
      >
        <div className={styles.handle} aria-hidden="true" />

        <div className={styles.header}>
          <span className={styles.title}>Filtros</span>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Cerrar filtros">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {/* Size */}
          <div className={styles.group}>
            <p className={styles.groupLabel}>Talla MX</p>
            <div className={styles.sizeGrid}>
              {sizes.map((s) => (
                <FilterChip
                  key={s}
                  label={`${s} MX`}
                  active={local.sizes.includes(s)}
                  onClick={() => setLocal((p) => ({ ...p, sizes: toggle(p.sizes, s) }))}
                />
              ))}
            </div>
          </div>

          {/* Status */}
          <div className={styles.group}>
            <p className={styles.groupLabel}>Disponibilidad</p>
            <div className={styles.chips}>
              {STATUS_OPTIONS.map((st) => (
                <FilterChip
                  key={st}
                  label={statusLabelES[st]}
                  active={local.statuses.includes(st)}
                  onClick={() => setLocal((p) => ({ ...p, statuses: toggle(p.statuses, st) }))}
                />
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className={styles.group}>
            <p className={styles.groupLabel}>Marca</p>
            <div className={styles.chips}>
              {brands.map((b) => (
                <FilterChip
                  key={b}
                  label={b}
                  active={local.brands.includes(b)}
                  onClick={() => setLocal((p) => ({ ...p, brands: toggle(p.brands, b) }))}
                />
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className={styles.group}>
            <p className={styles.groupLabel}>Condición</p>
            <div className={styles.chips}>
              {COND_OPTIONS.map((c) => (
                <FilterChip
                  key={c}
                  label={conditionLabel[c]}
                  active={local.conditions.includes(c)}
                  onClick={() => setLocal((p) => ({ ...p, conditions: toggle(p.conditions, c) }))}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          {hasActive && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setLocal({ brands: [], sizes: [], statuses: [], conditions: [] })}
            >
              Limpiar
            </button>
          )}
          <button
            type="button"
            className={styles.applyBtn}
            onClick={() => { onApply(local); onClose(); }}
          >
            Ver resultados
          </button>
        </div>
      </div>
    </>
  );
}
