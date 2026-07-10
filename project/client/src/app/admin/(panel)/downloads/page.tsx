import { AdminDownloads } from '@/views/admin/AdminDownloads';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Downloads',
};

export default function Page() {
  return <AdminDownloads />;
}
