import { AdminTemplates } from '@/views/admin/AdminTemplates';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Templates',
};

export default function Page() {
  return <AdminTemplates />;
}
