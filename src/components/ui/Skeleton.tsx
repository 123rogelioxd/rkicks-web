import styles from './Skeleton.module.css';

interface Props {
  width?: string | number;
  height?: string | number;
  radius?: string;
  className?: string;
}

export default function Skeleton({ width, height, radius, className }: Props) {
  return (
    <span
      className={`${styles.skel} ${className ?? ''}`}
      style={{
        width:        width  !== undefined ? (typeof width  === 'number' ? `${width}px`  : width)  : '100%',
        height:       height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : '14px',
        borderRadius: radius ?? 'var(--rk-radius-sm)',
      }}
      aria-hidden="true"
    />
  );
}
