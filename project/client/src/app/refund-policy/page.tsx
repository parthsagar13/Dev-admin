import { RefundPolicyPage } from '@/views/info/RefundPolicyPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description:
    'Read Neokit’s digital product Refund Policy. Refunds are considered for duplicate payments, technical errors, corrupted ZIP files, download access issues, or non-delivery after payment success.',
  openGraph: { title: 'Neokit Refund Policy' },
};

export default function Page() {
  return <RefundPolicyPage />;
}
