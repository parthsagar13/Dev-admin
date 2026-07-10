import { AdminPayments } from '@/views/admin/AdminPayments';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Payments',
};

export default function Page() {
  return <AdminPayments />;
}
