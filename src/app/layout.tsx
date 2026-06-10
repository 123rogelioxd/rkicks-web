import type { Metadata, Viewport } from 'next';
import '../styles/tokens.css';
import '../styles/base.css';

export const metadata: Metadata = {
  title: {
    default: 'RKicks — Curado por gente que sabe.',
    template: '%s · RKicks',
  },
  description:
    'Boutique de sneakers premium en México. Cada par verificado, cada defecto documentado. Parte de R Supply.',
  keywords: ['sneakers', 'mexico', 'jordan', 'nike', 'adidas', 'premium', 'autenticidad'],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: 'RKicks',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0D0B08',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,600&family=Inter:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
