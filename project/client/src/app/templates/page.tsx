import { Suspense } from 'react';
import { TemplatesPage } from '@/views/TemplatesPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Templates',
  description: 'Browse premium developer templates, boilerplates, UI kits, and SaaS starters on Neokit.',
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TemplatesPage />
    </Suspense>
  );
}
