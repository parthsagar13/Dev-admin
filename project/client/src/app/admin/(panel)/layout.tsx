import { AdminProtectedLayout } from '@/components/AdminProtectedLayout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import type { ReactNode } from 'react';

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProtectedLayout>
      <AdminLayout>{children}</AdminLayout>
    </AdminProtectedLayout>
  );
}
