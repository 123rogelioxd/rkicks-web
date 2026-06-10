import styles from './Eyebrow.module.css';

interface Props {
  children: React.ReactNode;
  onInk?: boolean;
  className?: string;
}

export default function Eyebrow({ children, onInk, className }: Props) {
  return (
    <p className={`${styles.eyebrow} ${onInk ? styles.onInk : ''} ${className ?? ''}`}>
      {children}
    </p>
  );
}
