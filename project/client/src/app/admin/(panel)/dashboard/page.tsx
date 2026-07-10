import { AdminDashboard } from '@/views/admin/AdminDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export default function Page() {
  return <AdminDashboard />;
}
