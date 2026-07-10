import { TermsPage } from '@/views/info/TermsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Review Neokit’s Terms & Conditions including digital product sales, licensing, downloads, payments, refunds, support, restrictions, and legal disclaimers.',
  openGraph: { title: 'Neokit Terms & Conditions' },
};

export default function Page() {
  return <TermsPage />;
}
