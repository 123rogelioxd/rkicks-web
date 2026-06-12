import styles from './PurchaseTrust.module.css';

const steps = [
  'Selecciona tu talla',
  'Envianos tu pedido por WhatsApp',
  'Confirmamos disponibilidad',
  'Realiza tu pago',
  'Recibe tu par o tu guia de envio',
];

const reassurance = [
  'Fotos reales del par',
  'Autenticidad revisada',
  'Apartado con el 50%',
  'Atencion directa por WhatsApp',
];

const badges = [
  ['Originalidad', 'Verificada'],
  ['Fotos', 'Del par exacto'],
  ['Entrega', 'Coordinada por WhatsApp'],
  ['Apartado', '50%'],
];

interface Props {
  variant?: 'product' | 'checkout';
}

export default function PurchaseTrust({ variant = 'product' }: Props) {
  return (
    <section className={`${styles.wrap} ${variant === 'checkout' ? styles.checkout : ''}`} aria-label="Como comprar">
      <div className={styles.stepsBlock}>
        <p className={styles.eyebrow}>Como comprar</p>
        <ol className={styles.steps}>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className={styles.apartado}>Apartados con el 50%</p>
      </div>

      <div className={styles.reassurance} aria-label="Confianza de compra">
        {reassurance.map((item) => (
          <span key={item}>✓ {item}</span>
        ))}
      </div>

      <div className={styles.badges} aria-label="Garantias RKicks">
        {badges.map(([label, value]) => (
          <div className={styles.badge} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
