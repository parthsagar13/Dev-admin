import { EditTemplate } from '@/views/admin/EditTemplate';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Template',
};

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <EditTemplate id={id} />;
}
