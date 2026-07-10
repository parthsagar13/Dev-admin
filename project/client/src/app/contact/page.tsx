import { ContactPage } from '@/views/info/ContactPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Neokit | Support & Sales',
  description:
    'Contact Neokit for support, licensing, billing, and sales inquiries. Get help with downloads, invoices, and template setup.',
  openGraph: { title: 'Contact Neokit' },
};

export default function Page() {
  return <ContactPage />;
}
