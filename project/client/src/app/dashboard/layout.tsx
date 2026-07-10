import { UserProtectedLayout } from '@/components/UserProtectedLayout';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <UserProtectedLayout>{children}</UserProtectedLayout>;
}
