import { AdminCustomers } from '@/views/admin/AdminCustomers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Customers',
};

export default function Page() {
  return <AdminCustomers />;
}
