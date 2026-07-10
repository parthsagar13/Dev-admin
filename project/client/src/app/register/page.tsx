import { Suspense } from 'react';
import { RegisterPage } from '@/views/RegisterPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your Neokit account to purchase and download premium developer templates.',
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RegisterPage />
    </Suspense>
  );
}
