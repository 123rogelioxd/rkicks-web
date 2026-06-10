import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import RCGStamp from '@/components/rcg/RCGStamp';
import { WhatsAppSection } from '@/components/whatsapp/WhatsAppCTA';
import Eyebrow from '@/components/ui/Eyebrow';
import styles from './page.module.css';

export default function RealConditionPage() {
  return (
    <>
      <Nav />

      {/* ── INK ZONE: Hero ── */}
      <div className={styles.heroZone}>
        <div className={`rk-page ${styles.hero}`}>
          <div className={styles.heroContent}>
            <Eyebrow onInk>Real Condition Guarantee · RKicks</Eyebrow>
            <h1 className={styles.heroHeadline}>
              Lo que ves es lo que llega.
            </h1>
            <p className={styles.heroSub}>
              Un sistema de documentación de condición diseñado para eliminar sorpresas.
              Cada par. Sin excepciones.
            </p>
          </div>
          <div className={styles.heroStamp}>
            <RCGStamp inverted />
          </div>
        </div>
      </div>

      {/* ── BONE ZONE ── */}
      <main className="rk-zone-bone">

        {/* Section 1: Intro */}
        <section className={styles.section}>
          <div className={`rk-page ${styles.sectionInner}`}>
            <div className={styles.introGrid}>
              <div className={styles.introText}>
                <Eyebrow>El programa</Eyebrow>
                <h2 className={styles.sectionH}>Qué es Real Condition</h2>
                <p className={styles.body}>
                  Real Condition Guarantee es el proceso que RKicks aplica a cada par antes
                  de publicarlo. Incluye inspección física, fotografía con luz natural,
                  clasificación de condición y documentación de defectos. El resultado es
                  una ficha completa por par que describe exactamente lo que recibirás.
                </p>
                <p className={styles.body}>
                  No existe interpretación ambigua de &quot;condición&quot;. Usamos un sistema
                  estandarizado de 5 grados y 4 niveles de defecto que se aplica igual a
                  cada par, independientemente de la marca o el precio.
                </p>
              </div>
              <div className={styles.introStamp}>
                <RCGStamp />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Condition grades */}
        <section className={`${styles.section} ${styles.sectionBorder}`}>
          <div className={`rk-page ${styles.sectionInner}`}>
            <Eyebrow>Sistema de calificación</Eyebrow>
            <h2 className={styles.sectionH}>Grados de condición</h2>
            <p className={styles.sectionDesc}>
              Cinco grados, criterios específicos. Ningún par queda sin clasificar.
            </p>

            <div className={styles.gradeTable}>
              {conditionGrades.map(grade => (
                <div key={grade.key} className={styles.gradeRow}>
                  <div className={styles.gradeLeft}>
                    <span className={styles.gradeKey}>{grade.label}</span>
                    <span className={styles.gradeEs}>{grade.labelEs}</span>
                  </div>
                  <div className={styles.gradeRight}>
                    <p className={styles.gradeDef}>{grade.definition}</p>
                    <p className={styles.gradeEx}>{grade.example}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Flaw levels */}
        <section className={`${styles.section} ${styles.sectionBorder}`}>
          <div className={`rk-page ${styles.sectionInner}`}>
            <Eyebrow>Clasificación de defectos</Eyebrow>
            <h2 className={styles.sectionH}>Niveles de detalle</h2>
            <p className={styles.sectionDesc}>
              Todo defecto visible recibe una descripción, una ubicación y una foto.
            </p>

            <div className={styles.flawGrid}>
              {flawLevels.map(level => (
                <div key={level.key} className={styles.flawCard}>
                  <div className={styles.flawBar}>
                    {[0, 1, 2, 3].map(i => (
                      <span
                        key={i}
                        className={styles.flawSeg}
                        style={{
                          opacity: i < level.segments ? 1 : 0.28,
                          background: level.color,
                        }}
                      />
                    ))}
                  </div>
                  <p className={styles.flawLabel}>{level.label}</p>
                  <p className={styles.flawDef}>{level.definition}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Authenticity process */}
        <section className={`${styles.section} ${styles.sectionBorder}`}>
          <div className={`rk-page ${styles.sectionInner}`}>
            <Eyebrow>Autenticación</Eyebrow>
            <h2 className={styles.sectionH}>Proceso de verificación</h2>
            <p className={styles.sectionDesc}>
              Cada par pasa por una revisión física antes de ser publicado.
            </p>

            <ol className={styles.stepList}>
              {authSteps.map((step, i) => (
                <li key={i} className={styles.step}>
                  <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.stepBody}>
                    <p className={styles.stepTitle}>{step.title}</p>
                    <p className={styles.stepDetail}>{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Section 5: Photography standards */}
        <section className={`${styles.section} ${styles.sectionBorder}`}>
          <div className={`rk-page ${styles.sectionInner}`}>
            <Eyebrow>Fotografía</Eyebrow>
            <h2 className={styles.sectionH}>Estándares de foto</h2>
            <p className={styles.sectionDesc}>
              Tres tipos de foto por par. Todas con luz natural. Sin filtros.
            </p>

            <div className={styles.photoGrid}>
              {photoTypes.map(type => (
                <div key={type.key} className={styles.photoCard}>
                  {/* Minimal placeholder representing photo type */}
                  <div className={styles.photoPlaceholder} style={{ background: type.bg }}>
                    <span className={styles.photoPlaceholderLabel}>{type.key.toUpperCase()}</span>
                  </div>
                  <p className={styles.photoType}>{type.label}</p>
                  <p className={styles.photoDef}>{type.definition}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Customer protection */}
        <section className={`${styles.section} ${styles.sectionBorder}`}>
          <div className={`rk-page ${styles.sectionInner}`}>
            <Eyebrow>Protección al comprador</Eyebrow>
            <h2 className={styles.sectionH}>La garantía</h2>

            <div className={styles.guaranteeBlock}>
              <p className={styles.guaranteeStatement}>
                Si el par que recibes no coincide con la condición documentada,
                te devolvemos tu dinero sin preguntas.
              </p>
              <ul className={styles.guaranteeList}>
                <li>Aplica a diferencias de condición no divulgadas</li>
                <li>Aplica a defectos no documentados en las fotos</li>
                <li>Aplica a talla incorrecta vs. etiqueta de fábrica</li>
                <li>No aplica a preferencias estéticas personales</li>
                <li>Se gestiona directamente por WhatsApp con el equipo</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 7: FAQ */}
        <section className={`${styles.section} ${styles.sectionBorder}`}>
          <div className={`rk-page ${styles.sectionInner}`}>
            <Eyebrow>Preguntas frecuentes</Eyebrow>
            <h2 className={styles.sectionH}>FAQ</h2>

            <div className={styles.faqList}>
              {faqs.map((faq, i) => (
                <details key={i} className={styles.faqItem}>
                  <summary className={styles.faqQ}>{faq.q}</summary>
                  <p className={styles.faqA}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── INK ZONE: WhatsApp CTA ── */}
      <WhatsAppSection />

      <Footer />
    </>
  );
}

/* ── Static data ── */

const conditionGrades = [
  {
    key: 'new',
    label: 'New',
    labelEs: 'Nuevo',
    definition: 'Sin usar. Etiquetas originales intactas. Sin marcas de uso en suela o upper.',
    example: 'Deadstock. Nunca sacado de la caja original.',
  },
  {
    key: 'like-new',
    label: 'Like New',
    labelEs: 'Como Nuevo',
    definition: 'Usado 1–3 veces máximo. Sin defectos visibles. Suela limpia.',
    example: 'Par probado en interior o usado una ocasión corta.',
  },
  {
    key: 'excellent',
    label: 'Excellent',
    labelEs: 'Excelente',
    definition: 'Usado con cuidado. Desgaste mínimo de suela. Sin defectos estructurales.',
    example: 'Uso ocasional en el último año. Limpieza profesional previa.',
  },
  {
    key: 'good',
    label: 'Good',
    labelEs: 'Bueno',
    definition: 'Uso regular. Desgaste de suela notorio pero no severo. Posibles marcas leves.',
    example: 'Uso semanal durante varios meses. Midsole con leve yellowing.',
  },
  {
    key: 'fair',
    label: 'Fair',
    labelEs: 'Regular',
    definition: 'Desgaste visible. Defectos documentados. Funcional pero con historial de uso real.',
    example: 'Marcas en cuero, desgaste de suela avanzado. Todo fotografiado.',
  },
];

const flawLevels = [
  {
    key: 'none',
    label: 'Sin defectos',
    segments: 1,
    color: 'var(--rk-flaw-none)',
    definition: 'No se encontró ningún defecto durante la inspección. El par está en condición perfecta para su grado.',
  },
  {
    key: 'minor',
    label: 'Defecto menor',
    segments: 2,
    color: 'var(--rk-flaw-minor)',
    definition: 'Defecto presente pero solo visible de cerca. No afecta la apariencia general del par.',
  },
  {
    key: 'visible',
    label: 'Defecto visible',
    segments: 3,
    color: 'var(--rk-flaw-visible)',
    definition: 'Defecto claramente visible a distancia normal. Documentado con foto y descripción de ubicación.',
  },
  {
    key: 'heavy',
    label: 'Desgaste notable',
    segments: 4,
    color: 'var(--rk-flaw-heavy)',
    definition: 'Desgaste estructural o cosmético significativo. Completamente divulgado. Precio refleja condición.',
  },
];

const authSteps = [
  {
    title: 'Inspección de materiales',
    detail: 'Se verifican costuras, detalles de construcción, peso y materiales contra referencias del modelo.',
  },
  {
    title: 'Verificación de talla',
    detail: 'La talla en insole y etiqueta de fábrica se comparan con la talla declarada. Se mide en cm.',
  },
  {
    title: 'Revisión de caja y accesorios',
    detail: 'Se documenta si la caja es original, de reemplazo o si no existe. Se listan los accesorios incluidos.',
  },
  {
    title: 'Fotografía de condición',
    detail: 'Fotos con luz natural de todos los ángulos. Los defectos se fotografían en contexto y de cerca.',
  },
  {
    title: 'Clasificación y publicación',
    detail: 'Se asigna grado de condición y nivel de defecto. La ficha se publica con toda la documentación.',
  },
];

const photoTypes = [
  {
    key: 'editorial',
    label: 'Editorial',
    bg: 'var(--rk-ink)',
    definition: 'Foto lateral del par completo sobre fondo neutro. Muestra el perfil y el colorway real.',
  },
  {
    key: 'condition',
    label: 'Condición',
    bg: '#1A1714',
    definition: 'Vista general de condición: suela, upper, talón y puntera. Luz directa sin sombras.',
  },
  {
    key: 'detail',
    label: 'Detalle',
    bg: '#0F0D0B',
    definition: 'Macro de cada defecto documentado. La foto muestra exactamente lo que está en el mapa.',
  },
];

const faqs = [
  {
    q: '¿Qué pasa si el par no coincide con la descripción?',
    a: 'Te devolvemos tu dinero sin preguntas. El proceso se inicia por WhatsApp con el equipo y se resuelve en 24 horas.',
  },
  {
    q: '¿Cómo verifican la autenticidad si no tienen laboratorio?',
    a: 'Usamos inspección física contra referencias del modelo: materiales, costuras, construcción, insole y peso. Para modelos de alta falsificación aplicamos criterios adicionales específicos al modelo.',
  },
  {
    q: '¿Puedo pedir más fotos antes de comprar?',
    a: 'Sí. Por WhatsApp puedes pedir fotos adicionales de cualquier ángulo o detalle específico. Si tenemos el par en inventario lo fotografiamos de inmediato.',
  },
  {
    q: '¿Qué significa que un par es "Like New"?',
    a: 'Fue usado 1 a 3 veces como máximo. No tiene defectos visibles, la suela no tiene desgaste y el upper está limpio. Si hay alguna marca mínima, aparece en el mapa de condición.',
  },
  {
    q: '¿Cómo funciona la compra por WhatsApp?',
    a: 'Le escribes al equipo, confirmamos la disponibilidad, acordamos el método de pago y enviamos o coordinamos entrega en CDMX. Todo el proceso es por WhatsApp, sin tienda online ni checkout.',
  },
];
