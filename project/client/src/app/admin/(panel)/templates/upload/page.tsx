import { UploadTemplate } from '@/views/admin/UploadTemplate';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload Template',
};

export default function Page() {
  return <UploadTemplate />;
}
