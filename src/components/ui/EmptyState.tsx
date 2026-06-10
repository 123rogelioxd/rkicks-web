import styles from './EmptyState.module.css';

interface Props {
  heading: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ heading, body, actionLabel, onAction }: Props) {
  return (
    <div className={styles.wrap}>
      <p className={styles.heading}>{heading}</p>
      {body && <p className={styles.body}>{body}</p>}
      {actionLabel && onAction && (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
