import type { Flaw, FlawLevel } from '@/types/product';
import styles from './FlawMap.module.css';

interface Props {
  flaws: Flaw[];
  flawLevel: FlawLevel;
}

const severityColor: Record<FlawLevel, string> = {
  none:    'var(--rk-flaw-none)',
  minor:   'var(--rk-flaw-minor)',
  visible: 'var(--rk-flaw-visible)',
  heavy:   'var(--rk-flaw-heavy)',
};

export default function FlawMap({ flaws, flawLevel }: Props) {
  if (flaws.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Mapa de condición</span>
        <span className={styles.count}>{flaws.length} {flaws.length === 1 ? 'defecto' : 'defectos'}</span>
      </div>

      {/* Diagram placeholder */}
      <div className={styles.diagram} aria-label="Diagrama de defectos" role="img">
        <svg viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.diagramSvg} aria-hidden="true">
          {/* Sneaker silhouette outline for diagram */}
          <path d="M18 80 C18 84 40 88 90 87 C140 86 162 80 162 76"
            stroke="rgba(13,11,8,0.15)" strokeWidth="1" fill="none" />
          <path d="M18 76 C18 68 24 56 38 46 C52 36 72 32 92 32 C112 32 132 38 148 52 C158 62 162 72 162 76 C140 82 90 85 18 76 Z"
            fill="rgba(13,11,8,0.03)" stroke="rgba(13,11,8,0.12)" strokeWidth="0.8" />
          <path d="M78 32 Q88 24 98 24 Q108 24 112 32"
            stroke="rgba(13,11,8,0.1)" strokeWidth="0.8" fill="none" />
          <path d="M18 80 C40 83 90 84 140 82 C155 80 162 78 162 76"
            stroke="rgba(13,11,8,0.08)" strokeWidth="0.5" fill="none" />
        </svg>

        {/* Pins — positioned proportionally */}
        {flaws.map((flaw, idx) => {
          /* Distribute pins evenly across the shoe silhouette area */
          const positions = [
            { x: '78%', y: '55%' },
            { x: '22%', y: '50%' },
            { x: '50%', y: '35%' },
            { x: '60%', y: '70%' },
            { x: '35%', y: '60%' },
          ];
          const pos = positions[idx % positions.length];
          const color = severityColor[flaw.severity];

          return (
            <span
              key={flaw.id}
              className={styles.pin}
              style={{
                left: pos.x,
                top: pos.y,
                borderColor: color,
                color: color,
                backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
              }}
              aria-label={`Defecto ${idx + 1}: ${flaw.location}`}
            >
              {idx + 1}
            </span>
          );
        })}

        <span className={styles.diagramLabel}>CONDICIÓN · VISTA LATERAL</span>
      </div>

      {/* Flaw entries */}
      <div className={styles.entries}>
        {flaws.map((flaw, idx) => {
          const color = severityColor[flaw.severity];
          return (
            <div key={flaw.id} className={styles.entry}>
              <span
                className={styles.entryPin}
                style={{ borderColor: color, color }}
              >
                {idx + 1}
              </span>
              <div className={styles.entryBody}>
                <p className={styles.entryTitle}>
                  <span className={styles.entryLocation}>{flaw.location}</span>
                  <span className={styles.entrySeverity} style={{ color }}>
                    {flaw.severity}
                  </span>
                </p>
                <p className={styles.entryDesc}>{flaw.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
