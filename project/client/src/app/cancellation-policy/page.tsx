import { CancellationPolicyPage } from '@/views/info/CancellationPolicyPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation Policy',
  description:
    'Read Neokit’s Cancellation Policy. Orders can be cancelled only before payment completion. After payment success and download access, cancellations are not possible.',
  openGraph: { title: 'Neokit Cancellation Policy' },
};

export default function Page() {
  return <CancellationPolicyPage />;
}
