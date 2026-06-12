import type { Product, ProductVariant } from '@/types/product';
import { conditionLabel, flawLevelLabelES, getVariantDetailSizeLabel } from '@/utils/inventory';
import styles from './ConditionTable.module.css';

interface Props {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

const boxLabel: Record<string, string> = {
  original: 'Caja original',
  replacement: 'Caja de reemplazo',
  none: 'Sin caja',
};

export default function ConditionTable({ product, selectedVariant }: Props) {
  const rows: Array<{ label: string; value: string; highlight?: boolean }> = [
    {
      label: 'Condicion general',
      value: conditionLabel[product.condition],
      highlight: true,
    },
    {
      label: 'Nivel de detalle',
      value: flawLevelLabelES[product.flawLevel],
    },
    {
      label: 'Caja',
      value: boxLabel[product.box] ?? product.box,
    },
    {
      label: 'Talla',
      value: getVariantDetailSizeLabel(product, selectedVariant),
    },
    {
      label: 'Autenticidad',
      value: 'Verificado por RKicks',
    },
  ];

  return (
    <div className={styles.table} role="table" aria-label="Especificaciones de condicion">
      {rows.map((row, i) => (
        <div
          key={i}
          className={`${styles.row} ${row.highlight ? styles.rowHighlight : ''}`}
          role="row"
        >
          <span className={styles.label} role="rowheader">{row.label}</span>
          <span className={styles.value} role="cell">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
