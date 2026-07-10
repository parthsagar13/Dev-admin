import { AdminLogin } from '@/views/admin/AdminLogin';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Sign In',
};

export default function Page() {
  return <AdminLogin />;
}
