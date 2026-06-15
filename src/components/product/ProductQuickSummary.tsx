import type { Product, ProductVariant } from '@/types/product';
import {
  boxShortLabelES,
  conditionLabelES,
  getConditionPercent,
  getAvailableSizeLabels,
  getVariantPrimarySizeLabel,
  getVariantStatus,
  statusLabelES,
} from '@/utils/inventory';
import styles from './ProductQuickSummary.module.css';

interface Props {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

interface SummaryItem {
  label: string;
  value: string;
  hint?: string;
}

export default function ProductQuickSummary({ product, selectedVariant }: Props) {
  const sizeLabels = getAvailableSizeLabels(product);
  const talla = selectedVariant
    ? getVariantPrimarySizeLabel(product, selectedVariant)
    : sizeLabels.length === 0
      ? 'Por confirmar'
      : sizeLabels.length > 3
        ? `${sizeLabels.length} tallas`
        : sizeLabels.join(' · ');

  const items: SummaryItem[] = [
    { label: 'Talla', value: talla },
    { label: 'Estado', value: statusLabelES[getVariantStatus(product, selectedVariant)] },
    {
      label: 'Condición',
      value: `${getConditionPercent(product)}%`,
      hint: conditionLabelES[product.condition],
    },
    { label: 'Caja', value: boxShortLabelES[product.box] },
    { label: 'Originalidad', value: 'Confirmada' },
  ];

  return (
    <section className={styles.wrap} aria-label="Resumen rápido del par">
      <p className={styles.eyebrow}>Resumen rápido</p>
      <dl className={styles.grid}>
        {items.map((item) => (
          <div className={styles.cell} key={item.label}>
            <dt className={styles.cellLabel}>{item.label}</dt>
            <dd className={styles.cellValue}>
              {item.value}
              {item.hint && <span className={styles.cellHint}>{item.hint}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
