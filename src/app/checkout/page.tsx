import type { Metadata } from 'next';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout - RKicks',
  description: 'Finaliza tu seleccion RKicks por WhatsApp.',
};

export default function CheckoutPage() {
  return (
    <>
      <Nav />
      <CheckoutClient />
      <Footer />
    </>
  );
}
