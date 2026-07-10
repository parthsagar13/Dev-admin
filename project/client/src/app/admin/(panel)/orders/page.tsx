import { AdminOrders } from '@/views/admin/AdminOrders';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Orders',
};

export default function Page() {
  return <AdminOrders />;
}
