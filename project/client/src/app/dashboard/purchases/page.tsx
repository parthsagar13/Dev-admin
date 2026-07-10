import { PurchasesPage } from '@/views/user/PurchasesPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Purchases',
};

export default function Page() {
  return <PurchasesPage />;
}
