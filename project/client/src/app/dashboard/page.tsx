import { UserDashboardPage } from '@/views/user/UserDashboardPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your Neokit dashboard.',
};

export default function Page() {
  return <UserDashboardPage />;
}
