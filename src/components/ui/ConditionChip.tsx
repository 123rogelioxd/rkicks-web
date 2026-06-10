import type { ConditionGrade } from '@/types/product';
import { conditionLabel } from '@/utils/inventory';
import styles from './ConditionChip.module.css';

interface Props {
  condition: ConditionGrade;
}

export default function ConditionChip({ condition }: Props) {
  return (
    <span className={styles.chip}>{conditionLabel[condition]}</span>
  );
}
