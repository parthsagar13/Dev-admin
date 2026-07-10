import { DownloadsPage } from '@/views/user/DownloadsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Downloads',
};

export default function Page() {
  return <DownloadsPage />;
}
