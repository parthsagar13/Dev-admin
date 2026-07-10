import { PrivacyPolicyPage } from '@/views/info/PrivacyPolicyPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read Neokit’s Privacy Policy covering the information we collect, how we use it, third-party services, security practices, retention, and your rights.',
  openGraph: {
    title: 'Neokit Privacy Policy',
    description: 'How Neokit collects, uses, and protects your data.',
  },
};

export default function Page() {
  return <PrivacyPolicyPage />;
}
